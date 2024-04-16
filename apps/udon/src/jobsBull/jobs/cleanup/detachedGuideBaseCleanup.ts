import promises from 'src/utils/promises';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { queueJob } from 'src/jobsBull/queues';
import { DetachedGuideBaseCleanupJob, JobType } from 'src/jobsBull/job';
import { DeleteLevel } from 'src/jobsBull/jobs/guideDeletion/helpers';
import { JobHandler } from 'src/jobsBull/handler';

/** How many gb's we can delete at once in a task */
const MAX_SIZE = 5;

/**
 * Remove guide bases with no templates to join
 * 	 These are deleted templates that we never cascaded down for because the
 *   cascade operation would be significantly expensive
 */
const handler: JobHandler<DetachedGuideBaseCleanupJob> = async (
  job,
  logger
) => {
  const payload = job.data;
  const limit = payload.batchSize || MAX_SIZE;

  const guideBases = await GuideBase.findAll({
    where: {
      createdFromTemplateId: null,
    },
    limit,
  });

  if (!guideBases.length) return;

  logger.info(
    `[detachedGuideBaseCleanup] Removing ${guideBases.length} guideBases`
  );

  await promises.map(
    guideBases,
    async (guideBase) => {
      // Optimistically set the guide base's deletedAt
      await guideBase.destroy();

      // Asynchronously delete the guide base
      await queueJob({
        jobType: JobType.DeleteGuides,
        organizationId: guideBase.organizationId,
        deleteLevel: DeleteLevel.GuideBase,
        deleteObjectId: guideBase.id,
      });
    },
    { concurrency: 2 }
  );

  const guideBasesLeft = await GuideBase.count({
    where: {
      createdFromTemplateId: null,
    },
  });

  if (guideBasesLeft > 0) {
    logger.debug(
      `[detachedGuideBaseCleanup] ${guideBasesLeft} remaining guideBases, queueing another job`
    );

    await queueJob({
      jobType: JobType.DetachedGuideBaseCleanup,
      batchSize: limit,
    });
  }
};

export default handler;
