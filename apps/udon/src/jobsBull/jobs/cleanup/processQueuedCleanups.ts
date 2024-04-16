import promises from 'src/utils/promises';
import { QueryDatabase, queryRunner } from 'src/data';
import { Event } from 'src/data/models/Analytics/Event.model';
import { GuideEvent } from 'src/data/models/Analytics/GuideEvent.model';
import { StepEvent } from 'src/data/models/Analytics/StepEvent.model';
import {
  QueuedCleanup,
  QueuedCleanupPayload,
} from 'src/data/models/Utility/QueuedCleanup.model';
import detachPromise from 'src/utils/detachPromise';
import { isOffHours } from 'src/utils/helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, ProcessQueuedCleanupsJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

/**
 * Add a cleanup to the list
 */
export const queueCleanup = (payload: QueuedCleanupPayload) => {
  detachPromise(() =>
    QueuedCleanup.create({
      payload,
    })
  );
};

const CLEANUP_CONCURRENCY = process.env.CLEANUP_CONCURRENCY
  ? Number(process.env.CLEANUP_CONCURRENCY)
  : 3;

/**
 * Nightly cleanup of old rows where we can't join anymore since the join is gone
 */
const handler: JobHandler<ProcessQueuedCleanupsJob> = async (job, logger) => {
  /* Support cleaning up old style tasks */
  const jobPayload = job.data;
  const customPayload = jobPayload && jobPayload.type ? jobPayload : null;

  if (!customPayload) {
    /** Double the cleanup pace off-hours when there's little DB load */
    const multiplier = isOffHours() ? 2 : 1;

    /** Not a custom cleanup; use the queue table */
    const pendingRows = await QueuedCleanup.findAll({
      limit: CLEANUP_CONCURRENCY * multiplier,
      order: [['createdAt', 'ASC']],
    });

    await promises.each(pendingRows, (row) => processQueuedCleanupRow(row));

    /** Check for more recursively */
    if (pendingRows.length === CLEANUP_CONCURRENCY) {
      await queueJob({
        jobType: JobType.ProcessQueuedCleanups,
      });
    }
  } else if (customPayload) {
    await handleCleanupPayload(customPayload);
  }
};

export default handler;

/**
 * This should just clean up detached event rows that mostly do not cascade.
 */
const handleCleanupPayload = async (payload: QueuedCleanupPayload) => {
  switch (payload.type) {
    case 'events-guide':
      await Event.destroy({
        where: { guideEntityId: payload.guideEntityIds },
      });
      break;
    case 'events-step':
      await Event.destroy({ where: { stepEntityId: payload.stepEntityIds } });
      break;
    case 'stepEvents':
      await StepEvent.destroy({
        where: { stepEntityId: payload.stepEntityIds },
      });
      break;
    case 'guideEvents':
      await GuideEvent.destroy({
        where: {
          guideEntityId: payload.guideEntityIds,
        },
      });
      break;
    case 'guideRollups':
      if (!payload.guideIds.length) break;

      await queryRunner({
        sql: 'DELETE FROM analytics.guide_daily_rollup WHERE guide_id IN (:idList)',
        replacements: {
          idList: payload.guideIds,
        },
        queryDatabase: QueryDatabase.primary,
      });
      break;
    default:
  }
};

const processQueuedCleanupRow = async (cleanupRow: QueuedCleanup) => {
  const { payload } = cleanupRow;

  if (payload) await handleCleanupPayload(payload);

  await cleanupRow.destroy();
};
