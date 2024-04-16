import promises from 'src/utils/promises';
import { Events, InternalTrackEvents } from 'bento-common/types';

import { QueryDatabase, queryRunner } from 'src/data';
import { RollupQueryPayload, getTimeClause } from './rollup.helpers';
import { logger } from 'src/utils/logger';
import {
  AnnouncementDailyActivity,
  CtaUsageData,
} from 'src/data/models/Analytics/AnnouncementDailyActivity.model';

const getPairKey = (templateId: number, date: Date) =>
  `${templateId}-${date.getDate()}`;

export default async function runAnnouncementDataRollup(
  payload: RollupQueryPayload,
  opts: {
    /** Look for events for specific templateds */
    customTemplateIds?: number[];
    /** Delete data if no events are found (eg 0 activity) */
    trim?: boolean;
  } = {}
) {
  let templateIds = opts.customTemplateIds;

  if (!templateIds) {
    /* Only look up recent and relevant guides. We expect step activity will inform guide activity */
    const recentTemplates = (await queryRunner({
      sql: `--sql
				SELECT DISTINCT
					g.created_from_template_id AS "templateId"
				FROM analytics.step_events e
				JOIN core.steps s ON e.step_entity_id = s.entity_id
				JOIN core.guides g ON s.guide_id = g.id
        JOIN core.templates t ON t.id = g.created_from_template_id
				WHERE
					${getTimeClause(payload)}
					AND g.created_from_template_id IS NOT NULL
					AND t.is_side_quest = TRUE
			`,
      replacements: { ...payload },
      queryDatabase: QueryDatabase.follower,
    })) as { templateId: number }[];

    if (recentTemplates.length === 0) return;

    templateIds = recentTemplates.map((r) => r.templateId);
  }

  const sql = `--sql
		WITH guide_events AS (
			SELECT DISTINCT
				g.created_from_template_id AS template_id,
				ge.event_name,
				ge.account_user_entity_id,
				date_trunc('day', ge.created_at) AS event_date,
				g.organization_id
			FROM analytics.guide_events ge
			JOIN core.guides g ON ge.guide_entity_id = g.entity_id
			WHERE
				date_trunc('day', ge.created_at) = date_trunc('day', ${
          payload.lookback ? 'NOW()' : ':date ::date'
        })
				AND g.created_from_template_id IN (:templateIds)
		)
		SELECT
			ge.template_id AS "templateId",
			ge.event_date AS "date",
			ge.organization_id AS "organizationId",
			SUM(CASE WHEN ge.event_name = '${
        InternalTrackEvents.guideViewingStarted
      }' THEN 1 ELSE 0 END) AS viewed,
			SUM(CASE WHEN ge.event_name = '${
        Events.savedForLater
      }' THEN 1 ELSE 0 END) AS "savedForLater",
			SUM(CASE WHEN ge.event_name = '${
        Events.dismissed
      }' THEN 1 ELSE 0 END) AS dismissed
		FROM guide_events ge
		JOIN core.account_users au ON ge.account_user_entity_id = au.entity_id
		JOIN core.accounts a ON a.id = au.account_id AND a.deleted_at IS NULL
		GROUP BY ge.template_id, ge.organization_id, ge.event_date;
	`;

  const rows = (await queryRunner({
    sql,
    replacements: {
      ...payload,
      templateIds,
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    templateId: number;
    organizationId: number;
    date: Date;
    viewed: number;
    savedForLater: number;
    dismissed: number;
  }[];

  logger.debug(
    `[runAnnouncementDataRollup] ${rows.length} mayching entries to roll up`
  );

  if (rows.length === 0 && !opts.trim) return;

  const ctaData = await getCtaData(payload, templateIds);
  const addedTemplates = new Set<number>();

  await promises.each(rows, async (row) => {
    addedTemplates.add(row.templateId);

    const data: Partial<AnnouncementDailyActivity> = {
      ...row,
      ctaActivity: ctaData[getPairKey(row.templateId, row.date)] ?? {},
    };

    await AnnouncementDailyActivity.upsert(data, {
      conflictFields: ['template_id', 'date', 'organization_id'],
      returning: false,
    });
  });

  /**
   * We didn't find activity for these templates on the date specified
   *   so delete it if it exists
   */
  if (!payload.lookback && opts.customTemplateIds && opts.trim) {
    const templatesWithNoActivity = opts.customTemplateIds.filter(
      (id) => !addedTemplates.has(id)
    );

    await AnnouncementDailyActivity.destroy({
      where: {
        templateId: templatesWithNoActivity,
        date: new Date(payload.date),
      },
    });
  }
}

const getCtaData = async (
  payload: RollupQueryPayload,
  templateIds: number[]
) => {
  const rows = (await queryRunner({
    sql: `--sql
			WITH cta_events AS (
				SELECT DISTINCT
					g.created_from_template_id AS template_id,
					date_trunc('day', se.created_at) AS event_date,
					se.data->>'ctaText' AS cta_text,
					se.data->>'ctaEntityId' AS cta_entity_id,
					se.account_user_entity_id
				FROM analytics.step_events se
				JOIN core.steps s ON se.step_entity_id = s.entity_id
				JOIN core.guides g ON s.guide_id = g.id AND g.deleted_at IS NULL
				WHERE
					date_trunc('day', se.created_at) = date_trunc('day', ${
            payload.lookback ? 'NOW()' : ':date ::date'
          })
					AND se.event_name = 'cta_clicked'
					AND se.data->>'ctaText' IS NOT NULL
					AND g.created_from_template_id IN (:templateIds)
			)
			SELECT
				ce.template_id AS "templateId",
				ce.event_date AS "date",
				ce.cta_text AS "ctaText",
				ce.cta_entity_id AS "ctaEntityId",
				COUNT(*)
			FROM cta_events ce
			GROUP BY ce.template_id, ce.event_date, ce.cta_text, ce.cta_entity_id
		`,
    replacements: {
      ...payload,
      templateIds,
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    templateId: number;
    date: Date;
    ctaText: string;
    ctaEntityId: string;
    count: number;
  }[];

  return rows.reduce((a, v) => {
    const key = getPairKey(v.templateId, v.date);

    /** Append cta data keyed by entityId */
    a[key] = {
      ...(a[key] ?? {}),
      [v.ctaEntityId]: {
        text: v.ctaText,
        count: v.count,
      },
    };

    return a;
  }, {} as Record<string, CtaUsageData>);
};
