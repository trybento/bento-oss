import promises from 'src/utils/promises';
import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import { TemplateData } from 'src/data/models/Analytics/TemplateData.model';
import fetchTemplateStats from 'src/interactions/analytics/fetchTemplateStats';
import { logger } from 'src/utils/logger';
import {
  RollupTypeEnum,
  setLastRunTime,
} from 'src/jobsBull/jobs/rollupTasks/rollup.helpers';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

export const CLEANUP_CHUNK_SIZE = 200;

/** Remove redundant/excessive logging around user activities */
export const cleanupAppUserActivityData = async (
  interval: string,
  customChunkSize = CLEANUP_CHUNK_SIZE
) => {
  const chunkSize = customChunkSize;

  let aueIdsCleaned = 0,
    eIdsCleaned = 0;

  const cleanAuEvents = async () => {
    const accountUserEventLookup = `
		SELECT id FROM analytics.account_user_events
		WHERE id IN (
				SELECT
						id
				FROM (
						SELECT
								id,
								row_number() OVER w as rnum
						FROM analytics.account_user_events
						WHERE event_name = 'account_user_app_activity'
							AND created_at > NOW() - INTERVAL :interval
						WINDOW w AS (
								PARTITION BY account_user_entity_id
								ORDER BY created_at DESC
						)
				) t
		WHERE t.rnum > 1)
		LIMIT :chunkSize;
		`;

    const aueIds = (await queryRunner({
      sql: accountUserEventLookup,
      replacements: {
        interval,
        chunkSize,
      },
      queryDatabase: QueryDatabase.follower,
    })) as { id: number }[];
    if (aueIds.length) {
      await queryRunner({
        sql: 'DELETE FROM analytics.account_user_events WHERE id IN (:idList)',
        replacements: {
          idList: aueIds.map((row) => row.id),
        },
        queryDatabase: QueryDatabase.primary,
      });
    }

    aueIdsCleaned = aueIds.length;
  };

  const cleanEvents = async () => {
    const eventLookup = `
		SELECT id FROM analytics.events
		WHERE id IN (
				SELECT
						id
				FROM (
						SELECT
								id,
								row_number() OVER w as rnum
						FROM analytics.events
						WHERE event_name = 'account_user_app_activity'
							AND created_at > NOW() - INTERVAL :interval
						WINDOW w AS (
								PARTITION BY account_user_entity_id
								ORDER BY created_at DESC
						)
				) t
		WHERE t.rnum > 1)
		LIMIT :chunkSize;
	`;

    const eIds = (await queryRunner({
      sql: eventLookup,
      replacements: {
        interval,
        chunkSize,
      },
      queryDatabase: QueryDatabase.follower,
    })) as { id: number }[];

    if (eIds.length) {
      await queryRunner({
        sql: 'DELETE FROM analytics.events WHERE id IN (:idList)',
        replacements: {
          idList: eIds.map((row) => row.id),
        },
        queryDatabase: QueryDatabase.primary,
      });
    }

    eIdsCleaned = eIds.length;
  };

  await Promise.all([cleanAuEvents, cleanEvents]);

  /* If last cleanup was less than batch size, it's probably the last batch */
  const cleanedLastChunk = aueIdsCleaned < chunkSize && eIdsCleaned < chunkSize;

  return cleanedLastChunk;
};

/** Cleanup old launch reports */
export const cleanupLaunchReports = () =>
  queryRunner({
    sql: "DELETE FROM debug.launch_reports WHERE updated_at < NOW() - INTERVAL '1 month'",
    queryDatabase: QueryDatabase.primary,
  });

/**
 * Queue account user update jobs, enforcing queue name
 *  The job will handle chunking itself
 */
export const queueAccountUserDataRollup = async (
  accountUserEntityIds: string[]
) => {
  if (accountUserEntityIds.length <= 0) return;

  logger.debug(`[audRollup] Adding ${accountUserEntityIds.length}`);

  await queueJob({
    jobType: JobType.UpdateAccountUserData,
    accountUserEntityIds,
  });
};

const TEMPLATE_DATA_CHUNK_SIZE = 10;

/**
 * make the template.stats loader by preloading template stats
 */
export const updateTemplateData = async ({
  offset,
  templateId,
  accountId,
  guideBaseId,
}: {
  offset?: number;
  templateId?: number;
  accountId?: number;
  guideBaseId?: number;
}) => {
  offset = offset || 0;

  let rows: { templateId: number }[] = [];

  if (templateId !== undefined) {
    rows = [{ templateId }];
  } else if (accountId !== undefined) {
    rows = (await queryRunner({
      sql: `--sql
        SELECT DISTINCT
          gb.created_from_template_id AS "templateId"
        FROM core.guide_bases gb
        WHERE gb.account_id = :accountId
        ORDER BY gb.created_from_template_id ASC
        LIMIT :limit
        OFFSET :offset
      ;`,
      replacements: {
        accountId,
        limit: TEMPLATE_DATA_CHUNK_SIZE,
        offset,
      },
      queryDatabase: QueryDatabase.follower,
    })) as { templateId: number }[];
  } else if (guideBaseId !== undefined) {
    rows = (await queryRunner({
      sql: `--sql
        SELECT
          gb.created_from_template_id AS "templateId"
        FROM core.guide_bases gb
        WHERE gb.id = :guideBaseId
      ;`,
      replacements: {
        guideBaseId,
      },
      queryDatabase: QueryDatabase.follower,
    })) as { templateId: number }[];
  } else {
    rows = (await queryRunner({
      sql: `--sql
        SELECT DISTINCT gb.created_from_template_id AS "templateId"
        FROM analytics.guide_data gd
        JOIN core.guide_bases gb ON gd.guide_base_id = gb.id
        WHERE gd.updated_at >= COALESCE((
          SELECT rs.last_run FROM analytics.rollup_states rs WHERE rs.rollup_name = :rollupName
        ), NOW() - INTERVAL '1 hour')
        ORDER BY gb.created_from_template_id ASC
        LIMIT :limit
        OFFSET :offset
      ;`,
      replacements: {
        rollupName: RollupTypeEnum.TemplateDataRollups,
        limit: TEMPLATE_DATA_CHUNK_SIZE,
        offset,
      },
      queryDatabase: QueryDatabase.follower,
    })) as { templateId: number }[];
  }

  const templates = await Template.findAll({
    where: {
      id: rows.map((r) => r.templateId),
    },
  });

  const templatesById = keyBy(templates, 'id');

  await promises.map(
    rows,
    async (row) => {
      const template = templatesById[row.templateId];

      if (!template) return;

      const stats = await fetchTemplateStats({ template });

      await TemplateData.upsert(
        {
          templateId: template.id,
          organizationId: template.organizationId,
          stats,
        },
        {
          conflictFields: ['template_id'],
        }
      );
    },
    { concurrency: 3 }
  );

  if (rows.length === TEMPLATE_DATA_CHUNK_SIZE) {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      aggregateTemplates: true,
      offset: offset + TEMPLATE_DATA_CHUNK_SIZE,
      templateId,
      accountId,

      /**
       * We shouldn't ever expect to queue another chunk when
       * updating for a single guide base, as there should only
       * be one template returned. However, just adding here for
       * consistency/safety.
       */
      guideBaseId,
    });
  } else {
    await setLastRunTime(RollupTypeEnum.TemplateDataRollups);
  }
};
