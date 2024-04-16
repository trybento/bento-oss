import { Op } from 'sequelize';
import { SelectedModelAttrs } from 'bento-common/types';

import promises from 'src/utils/promises';
import { Guide } from 'src/data/models/Guide.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { SYNC_JOB_GUIDE_BATCH_SIZE } from './syncChanges.helpers';
import { syncGuideBaseChangesToGuide } from './syncGuideBaseChangesToGuide';
import { Logger } from 'src/jobsBull/logger';
import { Template } from 'src/data/models/Template.model';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type Args = {
  guideBase: GuideBase & {
    createdFromTemplate: SelectedModelAttrs<Template, 'type' | 'theme'>;
  };
  lastGuideId?: number;
  logger: Logger;
};

/**
 * Propagate changes from a given GuideBase to associated Guides.
 */
export async function propagateGuideBaseChanges({
  guideBase,
  lastGuideId = 0,
  logger,
}: Args): Promise<
  [
    /** Which guide was last synced */
    lastSyncedGuideId: number,
    /** How many guides were synced this time */
    totalGuidesSynced: number
  ]
> {
  return withSentrySpan(
    async () => {
      const guideModuleBases = await GuideModuleBase.findAll({
        where: {
          guideBaseId: guideBase.id,
        },
        order: [
          ['orderIndex', 'ASC'],
          [
            { model: GuideStepBase, as: 'guideStepBases' },
            'guideModuleBaseId',
            'ASC',
          ],
          [{ model: GuideStepBase, as: 'guideStepBases' }, 'orderIndex', 'ASC'],
        ],
        include: [
          {
            model: GuideStepBase,
          },
        ],
      });

      const guides = (await Guide.findAll({
        where: {
          createdFromGuideBaseId: guideBase.id,
          id: {
            [Op.gt]: lastGuideId,
          },
        },
        limit: SYNC_JOB_GUIDE_BATCH_SIZE,
        // Both `entityId` and `id` are required here since later methods
        // rely on those for pagination or triggering WS changes.
        attributes: [
          'id',
          'entityId',
          'createdFromGuideBaseId',
          'createdFromTemplateId',
        ],
        order: [['id', 'ASC']],
      })) as SelectedModelAttrs<
        Guide,
        'id' | 'entityId' | 'createdFromGuideBaseId' | 'createdFromTemplateId'
      >[];

      // If we have no guides, we're done here
      if (!guides.length) return [0, 0];

      const lastBatchGuideId = guides[guides.length - 1].id;

      logger.debug(
        `[propagateGuideBaseChanges] Syncing to ${guides.length} guides: ${guides[0].id}-${lastBatchGuideId}`
      );

      await promises.each(guides, (guide) =>
        syncGuideBaseChangesToGuide({
          guideBase,
          guideModuleBases,
          guide,
        })
      );

      return [lastBatchGuideId, guides.length];
    },
    {
      name: 'propagateGuideBaseChanges',
      data: {
        guideBaseId: guideBase.id,
        lastGuideId,
      },
    }
  );
}
