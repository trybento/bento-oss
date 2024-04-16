import promises from 'src/utils/promises';
import { convertArrayToCSV } from 'convert-array-to-csv';

import { queryRunner } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { chunkArray } from 'src/utils/helpers';
import { logger } from 'src/utils/logger';
import { Events } from '../analytics/analytics';
import { COLUMN_LABELS, formatRawDate } from './reports.helpers';

type Args = {
  organization: Organization;
  templateEntityId: string;
};

/** CTAs recorded before analytics refresh don't have text info */
const GENERIC_CTA_LABEL = 'Unknown CTA';
const CTA_LOOKUP_CHUNK_SIZE = 200;

type BaseRow = {
  accountName: string;
  accountExternalId: string;
  accountUserName: string;
  accountUserEmail: string;
  accountUserEntityId: string;
  accountUserExternalId: string;
  stepEntityId: string;
  viewedAt: string;
};

/**
 * Report building off a list of who has viewed a single step guide
 *   Provides dates when user actions were taken, if any
 */
export default async function generateCtaReport({
  organization,
  templateEntityId,
}: Args) {
  const views = (await queryRunner({
    sql: `--sql
			SELECT DISTINCT
				a.name AS "accountName",
				a.external_id AS "accountExternalId",
				au.full_name AS "accountUserName",
				au.email AS "accountUserEmail",
				au.entity_id AS "accountUserEntityId",
				au.external_id AS "accountUserExternalId",
				s.entity_id AS "stepEntityId",
				MIN(se.created_at) AS "viewedAt"
			FROM analytics.step_events se
			JOIN core.steps s ON se.step_entity_id = s.entity_id
			JOIN core.guides g ON g.id = s.guide_id
			JOIN core.templates t ON g.created_from_template_id = t.id
			JOIN core.account_users au ON se.account_user_entity_id = au.entity_id
			JOIN core.accounts a ON au.account_id = a.id
			WHERE
				se.event_name = 'step_viewing_started' AND
				t.entity_id = :templateEntityId AND
				t.organization_id = :organizationId
			GROUP BY a.name, a.external_id, au.full_name, au.email, au.external_id, au.entity_id, s.entity_id;
		`,
    replacements: {
      organizationId: organization.id,
      templateEntityId,
    },
  })) as BaseRow[];

  const ctaLabels = await getAllCtas(templateEntityId);
  const allActionInfo = await getInfoForUsers(
    views.map((v) => v.accountUserEntityId),
    templateEntityId
  );

  logger.debug(
    `[generateCtaReport] cta report with ${views.length} rows requested`
  );

  const headers = [
    COLUMN_LABELS.accountName,
    COLUMN_LABELS.accountExternalId,
    COLUMN_LABELS.accountUserName,
    COLUMN_LABELS.accountUserEmail,
    COLUMN_LABELS.accountUserExternalId,
    'Viewed at',
    'Saved at',
    'Dismissed at',
    ...ctaLabels.map((label) => `"${label}" clicked at`),
  ];

  const mappedRows = views.map((v) => {
    const ctaData =
      allActionInfo[getKey(v.accountUserEntityId, v.stepEntityId)] || {};
    const guideData = allActionInfo[getKey(v.accountUserEntityId, null)] || {};

    return [
      v.accountName,
      v.accountExternalId,
      v.accountUserName,
      v.accountUserEmail,
      v.accountUserExternalId,
      formatRawDate(v.viewedAt),
      formatRawDate(guideData.savedForLaterAt),
      formatRawDate(guideData.dismissedAt),
      ...ctaLabels.map((label) => formatRawDate(ctaData[label])),
    ];
  });

  const report = [headers, ...mappedRows];

  return convertArrayToCSV(report) as string;
}

/** Get all possible CTA names so we can set the columns and lookups */
const getAllCtas = async (templateEntityId: string) => {
  const rows = (await queryRunner({
    sql: `--sql
		SELECT DISTINCT
			se.data->>'ctaText' AS text
		FROM analytics.step_events se
		JOIN core.steps s ON se.step_entity_id = s.entity_id
		JOIN core.guides g ON g.id = s.guide_id
		JOIN core.templates t ON t.id = g.created_from_template_id
		WHERE t.entity_id = :templateEntityId
		AND se.event_name = 'cta_clicked';
		`,
    replacements: {
      templateEntityId,
    },
  })) as { text: string | null }[];

  return rows.map((r) => r.text || GENERIC_CTA_LABEL);
};

const relevantEvents = [
  Events.ctaClicked,
  Events.savedForLater,
  Events.dismissed,
];

type InfoDict = {
  dismissedAt?: string;
  savedForLaterAt?: string;
  [ctaText: string]: string | undefined;
};

/** Provide account user and step entityIds to form lookup key */
const getKey = (auEId: string, sEId: string | null) => `${auEId}-${sEId}`;

/** Get actions info by accountUserEntityId-stepEntityId */
const getInfoForUsers = async (
  accountUserEntityIds: string[],
  templateEntityId: string
): Promise<Record<string, InfoDict>> => {
  const chunked = chunkArray(accountUserEntityIds, CTA_LOOKUP_CHUNK_SIZE);

  const results: Record<string, InfoDict> = {};

  await promises.each(chunked, async (entityIdChunk) => {
    const rows = (await queryRunner({
      sql: `--sql
				SELECT
					se.event_name AS "eventName",
					se.data->>'ctaText' AS "ctaText",
					se.step_entity_id AS "stepEntityId",
					se.account_user_entity_id AS "accountUserEntityId",
					MIN(se.created_at) AS "date"
				FROM analytics.step_events se
				JOIN core.steps s ON se.step_entity_id = s.entity_id
				JOIN core.guides g ON g.id = s.guide_id
				JOIN core.templates t ON t.id = g.created_from_template_id
				WHERE t.entity_id = :templateEntityId
					AND se.event_name IN (:relevantEvents)
					AND se.account_user_entity_id IN (:entityIdChunk)
				GROUP BY se.event_name, se.data->>'ctaText', se.step_entity_id, se.account_user_entity_id

				UNION

				SELECT
					ge.event_name AS "eventName",
					NULL AS "ctaText",
					NULL AS "stepEntityId",
					ge.account_user_entity_id AS "accountUserEntityId",
					MIN(ge.created_at) AS "date"
				FROM analytics.guide_events ge
				JOIN core.guides g ON g.entity_id = ge.guide_entity_id
				JOIN core.templates t ON t.id = g.created_from_template_id
				WHERE t.entity_id = :templateEntityId
					AND ge.event_name IN (:relevantEvents)
					AND ge.account_user_entity_id IN (:entityIdChunk)
				GROUP BY ge.event_name, ge.account_user_entity_id;
			`,
      replacements: {
        relevantEvents,
        templateEntityId,
        entityIdChunk,
      },
    })) as {
      eventName: Events;
      ctaText: string;
      stepEntityId: string;
      accountUserEntityId: string;
      date: string;
    }[];

    rows.forEach((row) => {
      const key = getKey(row.accountUserEntityId, row.stepEntityId);

      if (!results[key]) results[key] = {};

      switch (row.eventName) {
        case Events.dismissed:
          results[key].dismissedAt = row.date;
          break;
        case Events.savedForLater:
          results[key].savedForLaterAt = row.date;
          break;
        case Events.ctaClicked:
          results[key][row.ctaText || GENERIC_CTA_LABEL] = row.date;
          break;
        default:
      }
    });
  });

  return results;
};
