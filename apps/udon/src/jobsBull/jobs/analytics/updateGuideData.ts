import { uniq } from 'lodash';
import promises from 'src/utils/promises';
import {
  isAnnouncementGuide,
  isModulelessGuide,
} from 'bento-common/utils/formFactor';
import { Mutable } from 'bento-common/types';
import { QueryDatabase, queryRunner, withTransaction } from 'src/data';
import { GuideData } from 'src/data/models/Analytics/GuideData.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import getAverageStepsCompletedForGuideBase from 'src/interactions/analytics/stats/getAverageStepsCompletedForGuideBase';
import getAverageStepsViewedForGuideBase from 'src/interactions/analytics/stats/getAverageStepsViewedForGuideBase';
import getNumberStepsCompletedOfGuideBase from 'src/interactions/analytics/stats/getNumberStepsCompletedForGuideBase';
import getPercentageProgressOfGuideBase from 'src/interactions/analytics/stats/getPercentageProgressOfGuideBase';
import getUsersCompletedAStepInGuideBase from 'src/interactions/analytics/stats/getUsersCompletedAStepInGuideBase';
import getUsersSavedForLaterOfGuideBase from 'src/interactions/analytics/stats/getUsersSavedForLaterOfGuideBase';
import getUsersWhoSkippedAStepInGuideBases from 'src/interactions/analytics/stats/getUsersWhoSkippedAStepInGuideBase';
import getUsersWhoViewedGuideBases from 'src/interactions/analytics/stats/getUsersWhoViewedGuideBase';
import getNumberGuidesWithView from 'src/interactions/analytics/stats/getNumberGuidesWithView';
import getNumberUsersClickedCtaOfGuideBase from 'src/interactions/analytics/stats/getNumberUsersClickedCtaOfGuideBase';
import getNumberUsersAnsweredForGuideBase from 'src/interactions/analytics/stats/getNumberUsersAnsweredForTemplate';
import {
  isRollupDisabled,
  parsePayloadDate,
  RollupQueryPayload,
  RollupTypeEnum,
  setLastRunTime,
} from 'src/jobsBull/jobs/rollupTasks/rollup.helpers';
import { updateTemplateData } from './analytics.helpers';
import { logger } from 'src/utils/logger';
import { getActiveOrgs } from 'src/interactions/reporting/reports.helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, UpdateGuideDataJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

const CHUNK_SIZE = process.env.UPDATE_GUIDE_DATA_CHUNK_SIZE
  ? Number(process.env.UPDATE_GUIDE_DATA_CHUNK_SIZE)
  : 20;

/**
 * Special rollup for guide aggregation data that needs to happen AFTER normal rollup
 *   because it uses the step table data
 */
const updateGuideDataTask: JobHandler<UpdateGuideDataJob> = async (
  job,
  logger
) => {
  if (await isRollupDisabled(RollupTypeEnum.GuideDataRollups)) return;

  const {
    guideBaseIds,
    date,
    organizationId,
    templateId,
    accountId,
    guideBaseId,
    recreate,
    aggregateTemplates,
    offset = 0,
    isLastJob,
  } = job.data;

  /** Handle backfill/specialty params */
  if (!guideBaseIds) {
    if (
      aggregateTemplates &&
      !(await isRollupDisabled(RollupTypeEnum.TemplateDataRollups))
    ) {
      logger.debug(
        `[updateGuideData] Wrapping up with template data aggregation`
      );
      await updateTemplateData({ offset, templateId, accountId, guideBaseId });

      return;
    }

    if (date === 'all') {
      /* Run backfill for everything we can */
      const total = await getActiveGbs(undefined, 0, recreate);
      logger.info(`[updateGuideData] Added backfill for ${total} guide bases`);
    } else if (organizationId) {
      /* Backup approach to "all" by breaking work down by org */
      if (organizationId === -1) {
        const activeOrgs = await getActiveOrgs(['id']);

        for (const { id: organizationId } of activeOrgs) {
          await queueJob({
            jobType: JobType.UpdateGuideData,
            organizationId,
            recreate,
          });
        }
      }

      const total = await getActiveGbs(organizationId, 0, recreate);

      logger.info(
        `[updateGuideData] Added backfill for ${total} guide bases for org ${organizationId}`
      );
    } else if (templateId) {
      const total = await getActiveTemplateGbs(templateId, 0, recreate);

      logger.info(
        `[updateGuideData] Added backfill for ${total} guide bases for template ${templateId}`
      );
    } else if (accountId) {
      const total = await getActiveAccountGbs(accountId, 0, recreate);

      logger.info(
        `[updateGuideData] Added backfill for ${total} guide bases for account ${accountId}`
      );
    } else if (guideBaseId) {
      await queueJob({
        jobType: JobType.UpdateGuideData,
        organizationId,
        recreate,
        guideBaseIds: [guideBaseId],
        isLastJob: true,
      });

      logger.info(
        `[updateGuideData] Added backfill for guide base '${guideBaseId}'`
      );
    } else {
      if (!date)
        throw new Error(
          'Date required to queue guide data rollups without targets'
        );

      /* Create the lookback key */
      const dateOpts: RollupQueryPayload = { date };
      await parsePayloadDate(dateOpts, RollupTypeEnum.GuideDataRollups);

      if (!dateOpts.lookback)
        throw new Error('Could not create lookback value');

      await getGuidesActive(dateOpts.lookback, 0, recreate);
    }

    await setLastRunTime(RollupTypeEnum.GuideDataRollups);
    return;
  }

  for (const guideBaseId of guideBaseIds) {
    await updateGuideDataForGuideBase(guideBaseId, recreate);
  }

  /** If done with guide base, do templates */
  if (
    isLastJob &&
    !(await isRollupDisabled(RollupTypeEnum.TemplateDataRollups))
  ) {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      aggregateTemplates: true,
      templateId,
      accountId,
      guideBaseId,
    });
  }
};

export const updateGuideDataForGuideBase = async (
  guideBaseId: number,
  recreate = false
) => {
  const prepared: Partial<Mutable<GuideData>> = {
    usersCompletedAStep: 0,
    participantsWhoViewed: 0,
    usersClickedCta: 0,
    usersViewedAStep: 0,
    usersSkippedAStep: 0,
    stepsCompleted: 0,
    savedForLater: 0,
    avgStepsViewed: 0,
    avgStepsCompleted: 0,
    avgProgress: 0,
    guidesViewed: 0,
    usersAnswered: 0,
    guidesCompleted: 0,
  };

  const gb = await GuideBase.scope({
    method: [
      'withTemplate',
      { required: true, attributes: ['theme', 'formFactor'] },
    ],
  }).findOne({ where: { id: guideBaseId } });

  if (!gb) return;

  const existingGuideData = await GuideData.findOne({ where: { guideBaseId } });

  /** @todo organize this a bit better */
  const completed = (
    await getUsersCompletedAStepInGuideBase([guideBaseId])
  ).map((r) => r.completed_by_account_user_id);

  const seen = (await getUsersWhoViewedGuideBases([guideBaseId])).map(
    (r) => r.accountUserId
  );
  const skipped = (
    await getUsersWhoSkippedAStepInGuideBases([guideBaseId])
  ).map((r) => r.account_user_id);

  if (
    isModulelessGuide(
      gb.createdFromTemplate!.theme,
      gb.createdFromTemplate!.formFactor
    )
  ) {
    prepared.usersClickedCta =
      (await getNumberUsersClickedCtaOfGuideBase([guideBaseId]))?.[0] || 0;
  }

  if (isAnnouncementGuide(gb.createdFromTemplate!.formFactor)) {
    const savedForLater = await getUsersSavedForLaterOfGuideBase([guideBaseId]);
    prepared.savedForLater = savedForLater.length;
  }

  prepared.usersCompletedAStep = completed.length;
  prepared.usersSkippedAStep = skipped.length;

  const numStepsCompletedData = await getNumberStepsCompletedOfGuideBase([
    guideBaseId,
  ]);

  const uniqueSeen = uniq([...completed, ...skipped, ...seen]);
  prepared.usersViewedAStep = uniqueSeen.length;
  prepared.participantsWhoViewed = seen.length;
  prepared.stepsCompleted = numStepsCompletedData[0] || 0;

  /* Jobs run serially so some parts we can do concurrent for speed */
  await promises.map(
    [
      async () => {
        if (!isAnnouncementGuide(gb.createdFromTemplate!.formFactor)) {
          /* These stats aren't used for announcements */
          prepared.avgStepsCompleted =
            (await getAverageStepsCompletedForGuideBase([guideBaseId]))?.[0] ||
            0;
          prepared.avgStepsViewed =
            (await getAverageStepsViewedForGuideBase([guideBaseId]))?.[0] || 0;
          prepared.avgProgress =
            (await getPercentageProgressOfGuideBase([guideBaseId]))?.[0] || 0;
        }
      },
      async () => {
        prepared.guidesViewed =
          (await getNumberGuidesWithView([guideBaseId]))?.[0] || 0;
      },
      async () => {
        prepared.usersAnswered =
          (await getNumberUsersAnsweredForGuideBase([guideBaseId]))?.[0] || 0;
      },
      async () => {
        prepared.guidesCompleted = await getCompletedGuideCount(guideBaseId);
      },
    ],
    (fn) => fn()
  );

  if (existingGuideData && !recreate) {
    await existingGuideData.update(prepared);
  } else if ((existingGuideData && recreate) || !existingGuideData) {
    /* In case we delete a guide data and couldn't write */
    await withTransaction(async () => {
      if (existingGuideData && recreate)
        await GuideData.destroy({ where: { guideBaseId } });

      await GuideData.create({
        ...prepared,
        guideBaseId,
        organizationId: gb.organizationId,
      });
    });
  }
};

const getCompletedGuideCount = async (guideBaseId: number) => {
  const rows = await queryRunner<{ count: number }[]>({
    sql: `--sql	
			SELECT COUNT(*)
			FROM core.guides g
			WHERE
				g.created_from_guide_base_id = :guideBaseId
				AND g.deleted_at IS NULL
				AND g.completed_at IS NOT NULL
		`,
    replacements: {
      guideBaseId,
    },
    queryDatabase: QueryDatabase.follower,
  });

  return rows?.[0].count ?? 0;
};

/**
 * All gb's that we need to backfill
 *
 * Will queue sub-tasks for itself.
 */
const getActiveGbs = async (
  orgId?: number,
  offset = 0,
  recreate = false
): Promise<number> => {
  logger.debug(
    `[updateGuideData] getting active guides for account, offset: ${offset}`
  );

  const sql = `
    SELECT gb.id FROM core.guide_bases gb
    JOIN core.accounts a ON gb.account_id = a.id
    JOIN core.organizations o ON a.organization_id = o.id
    WHERE a.deleted_at IS NULL AND o.state != 'inactive'${
      orgId ? ' AND o.id = :orgId' : ''
    }
    ORDER BY gb.id ASC
    LIMIT :limit
    OFFSET :offset;
  `;

  const rows = (await queryRunner({
    sql,
    replacements: {
      ...(orgId ? { orgId } : {}),
      limit: CHUNK_SIZE,
      offset,
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    id: number;
  }[];

  const hasMore = rows.length === CHUNK_SIZE;

  await queueJob({
    jobType: JobType.UpdateGuideData,
    guideBaseIds: rows.map((r) => r.id),
    recreate,
    isLastJob: !hasMore,
  });

  return (
    rows.length +
    (hasMore ? await getActiveGbs(orgId, offset + CHUNK_SIZE, recreate) : 0)
  );
};

const getActiveAccountGbs = async (
  accountId: number,
  offset = 0,
  recreate = false
): Promise<number> => {
  logger.debug(
    `[updateGuideData] getting active guide bases for account '${accountId}', offset: ${offset}`
  );

  const rows = (await queryRunner({
    sql: `
      SELECT
        gb.id
      FROM core.guide_bases gb
      WHERE gb.account_id = :accountId
      ORDER BY gb.id ASC
      LIMIT :limit
      OFFSET :offset;
    `,
    replacements: {
      accountId,
      limit: CHUNK_SIZE,
      offset,
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    id: number;
  }[];

  const hasMore = rows.length === CHUNK_SIZE;

  await queueJob({
    jobType: JobType.UpdateGuideData,
    guideBaseIds: rows.map((r) => r.id),
    recreate,
    isLastJob: !hasMore,
    accountId,
  });

  return (
    rows.length +
    (hasMore
      ? await getActiveAccountGbs(accountId, offset + CHUNK_SIZE, recreate)
      : 0)
  );
};

const getActiveTemplateGbs = async (
  templateId: number,
  offset = 0,
  recreate = false
): Promise<number> => {
  logger.debug(
    `[updateGuideData] getting active guidebases for template, offset: ${offset}`
  );

  const sql = `--sql
		SELECT gb.id FROM core.guide_bases gb
		JOIN core.accounts a ON gb.account_id = a.id
		JOIN core.organizations o ON a.organization_id = o.id
		WHERE a.deleted_at IS NULL AND o.state != 'inactive'
			AND gb.created_from_template_id = :templateId
		ORDER BY gb.id ASC
		LIMIT :limit
		OFFSET :offset;
	`;

  const rows = (await queryRunner({
    sql,
    replacements: {
      templateId,
      limit: CHUNK_SIZE,
      offset,
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    id: number;
  }[];

  const hasMore = rows.length === CHUNK_SIZE;

  await queueJob({
    jobType: JobType.UpdateGuideData,
    guideBaseIds: rows.map((r) => r.id),
    recreate,
    isLastJob: !hasMore,
    templateId,
  });

  return (
    rows.length +
    (hasMore
      ? await getActiveTemplateGbs(templateId, offset + CHUNK_SIZE, recreate)
      : 0)
  );
};

/** guides with step activity will likely have some numbers change */
const getGuidesActive = async (
  lookback: string,
  offset = 0,
  recreate = false
): Promise<void> => {
  logger.debug(`[updateGuideData] getting active guides, offset: ${offset}`);

  const sql = `--sql
		SELECT DISTINCT g.created_from_guide_base_id AS guide_base_id FROM analytics.step_events se
		JOIN core.steps s ON se.step_entity_id = s.entity_id
		JOIN core.guides g ON s.guide_id = g.id
		WHERE se.created_at >= NOW() - INTERVAL :lookback
		ORDER BY g.created_from_guide_base_id ASC
		LIMIT :limit
		OFFSET :offset;
	`;

  const rows = (await queryRunner({
    sql,
    replacements: { lookback, limit: CHUNK_SIZE, offset },
    queryDatabase: QueryDatabase.follower,
  })) as { guide_base_id: number }[];

  const hasMore = rows.length === CHUNK_SIZE;

  await queueJob({
    jobType: JobType.UpdateGuideData,
    guideBaseIds: rows.map((r) => r.guide_base_id),
    recreate,
    isLastJob: !hasMore,
  });

  if (hasMore) {
    return getGuidesActive(lookback, offset + CHUNK_SIZE, recreate);
  }
};

export default updateGuideDataTask;
