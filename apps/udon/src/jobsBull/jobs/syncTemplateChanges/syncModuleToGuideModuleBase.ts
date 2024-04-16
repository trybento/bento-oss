import { keyBy, isEqual } from 'lodash';

import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import {
  attrsFromStepPrototype,
  bulkUpsertGuideStepBase,
  GuideStepBase,
} from 'src/data/models/GuideStepBase.model';
import { Module } from 'src/data/models/Module.model';
import { createGuideBaseStepInputs } from 'src/interactions/inputFields/createGuideBaseStepInputs';
import { createGuideBaseStepCtas } from 'src/interactions/ctas/createGuideBaseStepCtas';
import { createGuideBaseStepAutoCompleteInteractions } from 'src/interactions/autoComplete/createGuideBaseStepAutoCompleteInteractions';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type Args = {
  /** Include: stepPrototypes */
  module: Module;
  guideBase: GuideBase;
  /** Include: guideStepBases */
  guideModuleBase: GuideModuleBase;
  orderIndex: number;
};

/**
 * Important note: GuideStepBases must be loaded into the GuideModuleBase, and StepPrototypes in the Module
 * ...for step syncing to work
 */
export default async function syncModuleToGuideModuleBase({
  guideBase,
  module,
  guideModuleBase,
  orderIndex,
}: Args) {
  return withSentrySpan(
    async () => {
      const stepPrototypesOfModule =
        module.stepPrototypes ||
        module.moduleStepPrototypes?.map((msp) => msp.stepPrototype) ||
        [];

      // Updates GMB only when necessary
      if (
        !isEqual(
          [guideModuleBase.orderIndex, guideModuleBase.updatedByUserId],
          [orderIndex, module.updatedByUserId]
        )
      ) {
        await guideModuleBase.update({
          orderIndex,
          updatedByUserId: module.updatedByUserId,
        });
      }

      const guideStepBases = guideModuleBase.guideStepBases || [];

      const guideStepBasesByStepPrototypeId = keyBy(
        guideStepBases,
        'createdFromStepPrototypeId'
      );

      const upsertData = stepPrototypesOfModule.reduce(
        (acc, stepPrototype, i) => {
          const guideStepBase: GuideStepBase | undefined =
            guideStepBasesByStepPrototypeId[stepPrototype.id];

          const orderIndex = module.moduleStepPrototypes?.[i]?.orderIndex ?? i;

          // Wont prepare for an update if nothing has changed
          if (
            !guideStepBase ||
            !isEqual(
              [guideStepBase.orderIndex, guideStepBase.updatedByUserId],
              [orderIndex, stepPrototype.updatedByUserId]
            )
          ) {
            acc.push(
              attrsFromStepPrototype(stepPrototype, {
                entityId: guideStepBase?.entityId,
                orderIndex,
                guideBaseId: guideBase.id,
                guideModuleBaseId: guideModuleBase.id,
                updatedByUserId: stepPrototype.updatedByUserId,
              })
            );
          }

          return acc;
        },
        [] as any[]
      );

      const newOrUpdatedGuideStepBases = await bulkUpsertGuideStepBase(
        upsertData
      );

      // Ids of all existing step prototype ids associated with this module
      const existingStepPrototypeIds = stepPrototypesOfModule.map(
        (sp) => sp.id
      );

      // Find guide step bases without a step prototype counterpart, which
      // should then be destroyed.
      const guideStepBaseIdsToDestroy = guideStepBases.reduce<number[]>(
        (acc, gsb) => {
          if (
            !gsb.createdFromStepPrototypeId ||
            !existingStepPrototypeIds.includes(gsb.createdFromStepPrototypeId)
          ) {
            acc.push(gsb.id);
          }
          return acc;
        },
        []
      );

      /**
       * WARNING: Removing a guide step base from a high-traffic account template can affect thousands of steps,
       * therefore we should soft-delete and destroy in the background.
       *
       * @todo soft delete, queue destroy job
       */
      if (guideStepBaseIdsToDestroy.length > 0) {
        await GuideStepBase.destroy({
          where: { id: guideStepBaseIdsToDestroy },
        });
      }

      /**
       * Combines existing and new GuideStepBase instances, unique by StepPrototype.
       * Useful to sync downstream objects that might need to be created/updated on both
       * existing and new instances.
       */
      const allGuideStepBases = guideStepBases.concat(
        newOrUpdatedGuideStepBases
      );

      await createGuideBaseStepAutoCompleteInteractions({
        guideStepBases: allGuideStepBases,
      });
      await createGuideBaseStepInputs({ guideStepBases: allGuideStepBases });
      await createGuideBaseStepCtas({ guideStepBases: allGuideStepBases });

      return guideModuleBase;
    },

    {
      name: 'syncModuleToGuideModuleBase',
      data: {
        module: module.id,
        guideBaseId: guideBase.id,
        guideModuleBaseId: guideModuleBase.id,
      },
    }
  );
}
