import { Op } from 'sequelize';

import promises from 'src/utils/promises';
import { syncTemplateChangesToGuideBase } from './syncTemplateChangesToGuideBase';
import { SYNC_JOB_GUIDE_BASE_BATCH_SIZE } from './syncChanges.helpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type Args = {
  template: Template;
  lastGuideBaseId?: number;
};

export async function propagateTemplateChanges({
  template,
  lastGuideBaseId = 0,
}: Args): Promise<
  [
    /** The last GuideBaseId processed */
    lastBatchGuideBaseId: number,
    /** How many GuideBase instances were processed */
    syncedCount: number
  ]
> {
  return withSentrySpan(
    async () => {
      const templateModules = await TemplateModule.scope([
        { method: ['withModule', true] },
        'byOrderIndex',
      ]).findAll({
        where: { templateId: template.id },
      });

      const guideBases = await GuideBase.findAll({
        where: {
          createdFromTemplateId: template.id,
          isModifiedFromTemplate: false,
          id: {
            [Op.gt]: lastGuideBaseId,
          },
        },
        limit: SYNC_JOB_GUIDE_BASE_BATCH_SIZE,
        order: [['id', 'ASC']],
      });

      // if no guide bases are found, do nothing
      if (!guideBases.length) return [0, 0];

      // for each guide base...
      await promises.each(guideBases, async (guideBase) => {
        // sync template to guide base
        await syncTemplateChangesToGuideBase({
          templateModules,
          guideBase,
        });

        // queue sync from guide base to guides
        await queueJob({
          jobType: JobType.SyncTemplateChanges,
          type: 'guideBase',
          organizationId: template.organizationId,
          guideBaseId: guideBase.id,
        });
      });

      const lastBatchGuideBaseId = guideBases[guideBases.length - 1].id;

      return [lastBatchGuideBaseId, guideBases.length];
    },

    {
      name: 'propagateTemplateChanges',
      data: {
        templateId: template.id,
        lastGuideBaseId,
      },
    }
  );
}
