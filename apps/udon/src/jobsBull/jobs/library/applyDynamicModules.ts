import promises from 'src/utils/promises';
import { Op } from 'sequelize';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import appendTargetedModules from 'src/interactions/launching/appendTargetedModules';
import { guideBaseChanged } from 'src/data/events';
import { queueJob } from 'src/jobsBull/queues';
import { ApplyDynamicModulesJob, JobType } from 'src/jobsBull/job';
import { JobHandler } from 'src/jobsBull/handler';

const BATCH_SIZE = 40;

/**
 * Check if targeted templates need dynamic modules added to them
 */
const handler: JobHandler<ApplyDynamicModulesJob> = async (job, logger) => {
  const { templateId, lastGuideBaseId = 0 } = job.data;
  const guideBases = await GuideBase.findAll({
    where: {
      createdFromTemplateId: templateId,
      id: {
        [Op.gt]: lastGuideBaseId,
      },
    },
    include: [{ model: GuideModuleBase, attributes: ['createdFromModuleId'] }],
    limit: BATCH_SIZE,
  });

  if (guideBases.length === 0) return;

  await promises.map(
    guideBases,
    async (guideBase) => {
      const added = await appendTargetedModules({
        guideBase,
        moduleCount: guideBase.guideModuleBases.length,
      });

      /* Propagate to guides if new content */
      if (added.length) {
        guideBaseChanged(guideBase.entityId);

        await queueJob({
          jobType: JobType.SyncTemplateChanges,
          type: 'guideBase',
          guideBaseId: guideBase.id,
          organizationId: guideBase.organizationId,
        });
      }
    },
    { concurrency: 4 }
  );

  /* Re-queue if it looks like we may have more. */
  if (guideBases.length === BATCH_SIZE) {
    await queueJob({
      jobType: JobType.ApplyDynamicModules,
      templateId,
      lastGuideBaseId: guideBases[guideBases.length - 1].id,
    });
  }
};

export default handler;
