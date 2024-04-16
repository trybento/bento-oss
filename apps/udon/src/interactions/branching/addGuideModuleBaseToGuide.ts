import { CreationAttributes } from 'sequelize';

import { withTransaction } from 'src/data';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import {
  attrsFromGuideStepBase,
  bulkUpsertStep,
} from 'src/data/models/Step.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';
import { createStepAutoCompleteInteractions } from '../autoComplete/createStepAutoCompleteInteractions';
import { rebuildGuideModulesOrderIndex } from './rebuildGuideModulesOrderIndex';

type Args = {
  guide: Guide;
  guideModuleBase: GuideModuleBase;
  guideStepBases: GuideStepBase[];
  /** Determines the order index for the new GuideModule instance */
  orderIndex: number;
};

export async function addGuideModuleBaseToGuide({
  guide,
  guideModuleBase,
  guideStepBases,
  orderIndex,
}: Args): Promise<GuideModule> {
  return withSentrySpan(
    async () => {
      return withTransaction(async () => {
        const findOrCreateBaseArgs: CreationAttributes<GuideModule> = {
          organizationId: guide.organizationId,
          guideId: guide.id,
          createdFromModuleId: guideModuleBase.createdFromModuleId,
          createdFromGuideModuleBaseId: guideModuleBase.id,
        };

        const [existingOrNewGuideModule, created] =
          await GuideModule.findOrCreate({
            where: findOrCreateBaseArgs,
            defaults: {
              ...findOrCreateBaseArgs,
              orderIndex,
            },
          });

        /**
         * Won't do anything else, just return it
         */
        if (!created) {
          return existingOrNewGuideModule;
        }

        /**
         * Re-computes the order index of each GuideModule associated with the affected guide
         * to ensure that the new instance is properly inserted in the right position and all subsequent
         * instances are shifted by 1.
         */
        await rebuildGuideModulesOrderIndex({ guide });

        const stepAttrs = guideStepBases.map((guideStepBase) =>
          attrsFromGuideStepBase(guideStepBase, {
            guideModuleId: existingOrNewGuideModule.id,
            guideId: guide.id,
          })
        );

        const steps = await bulkUpsertStep(stepAttrs);
        await createStepAutoCompleteInteractions({ steps });

        return existingOrNewGuideModule;
      });
    },
    {
      name: 'addGuideModuleBaseToGuide',
      data: {
        guideId: guide.id,
        guideModuleId: guideModuleBase.createdFromModuleId,
        guideModuleBaseId: guideModuleBase.id,
      },
    }
  );
}
