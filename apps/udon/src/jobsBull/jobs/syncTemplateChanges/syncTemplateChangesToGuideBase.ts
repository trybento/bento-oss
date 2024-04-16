import promises from 'src/utils/promises';
import keyBy from 'lodash/keyBy';
import { withTransaction } from 'src/data';
import {
  attrsFromStepPrototype,
  bulkUpsertGuideStepBase,
  GuideStepBase,
} from 'src/data/models/GuideStepBase.model';
import syncModuleToGuideModuleBase from './syncModuleToGuideModuleBase';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { createGuideBaseStepInputs } from 'src/interactions/inputFields/createGuideBaseStepInputs';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { createGuideBaseStepCtas } from 'src/interactions/ctas/createGuideBaseStepCtas';
import { createGuideBaseStepAutoCompleteInteractions } from 'src/interactions/autoComplete/createGuideBaseStepAutoCompleteInteractions';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type SyncTemplateChangesToGuideBaseArgs = {
  templateModules: TemplateModule[];
  guideBase: GuideBase;
};

export async function syncTemplateChangesToGuideBase({
  templateModules,
  guideBase,
}: SyncTemplateChangesToGuideBaseArgs) {
  return withSentrySpan(
    async () => {
      const guideModuleBases = await GuideModuleBase.findAll({
        where: {
          guideBaseId: guideBase.id,
        },
        order: [
          ['orderIndex', 'ASC'],
          [{ model: GuideStepBase, as: 'guideStepBases' }, 'orderIndex', 'ASC'],
        ],
        include: [
          {
            model: GuideStepBase,
          },
        ],
      });

      /** Existing guide module bases in the database */
      const guideModuleBasesByModuleId = keyBy(
        guideModuleBases,
        'createdFromModuleId'
      );

      /** @todo consider removing transactions entirely */
      return withTransaction(async () => {
        /** For all the modules on the template-level, sync the changes to the guide module base */
        const updatedGuideModuleBases = await promises.mapSeries(
          templateModules,
          async (templateModule) => {
            const { module } = templateModule;

            if (!module) {
              throw new Error('Module not found');
            }

            const stepPrototypesOfModule =
              (module.moduleStepPrototypes.map(
                (msp) => msp.stepPrototype
              ) as StepPrototype[]) || [];

            let guideModuleBase = guideModuleBasesByModuleId[module.id];

            if (guideModuleBase) {
              await syncModuleToGuideModuleBase({
                module,
                guideBase,
                guideModuleBase,
                orderIndex: templateModule.orderIndex,
              });
            } else {
              [guideModuleBase] = await GuideModuleBase.upsert(
                {
                  guideBaseId: guideBase.id,
                  organizationId: guideBase.organizationId,
                  orderIndex: templateModule.orderIndex,
                  createdFromModuleId: module.id,
                  createdByUserId: module.updatedByUserId,
                  updatedByUserId: module.updatedByUserId,
                },
                {
                  returning: true,
                  conflictFields: [
                    'guide_base_id',
                    'created_from_module_id',
                  ] as any,
                }
              );

              const guideStepBaseAttrs = stepPrototypesOfModule.map(
                (stepPrototype, idx) =>
                  attrsFromStepPrototype(stepPrototype, {
                    orderIndex: module.moduleStepPrototypes[idx].orderIndex,
                    guideBaseId: guideBase.id,
                    guideModuleBaseId: guideModuleBase.id,
                    createdByUserId: stepPrototype.updatedByUserId,
                    updatedByUserId: stepPrototype.updatedByUserId,
                  })
              );

              const guideStepBases = await bulkUpsertGuideStepBase(
                guideStepBaseAttrs
              );

              // create the auto complete interactions from prototypes
              await createGuideBaseStepAutoCompleteInteractions({
                guideStepBases,
              });

              // create cta bases from prototypes
              await createGuideBaseStepCtas({ guideStepBases });

              // create input bases from prototypes
              await createGuideBaseStepInputs({ guideStepBases });
            }

            return guideModuleBase;
          }
        );

        const updatedGuideModuleBasesById = keyBy(
          updatedGuideModuleBases,
          'id'
        );

        // Don't delete branchingModules.
        const guideModuleBaseIdsToDelete = guideModuleBases.reduce<number[]>(
          (acc, gmb) => {
            if (
              !updatedGuideModuleBasesById[gmb.id] &&
              !gmb.addedDynamicallyAt
            ) {
              acc.push(gmb.id);
            }
            return acc;
          },
          []
        );

        if (guideModuleBaseIdsToDelete.length > 0) {
          await GuideStepBase.destroy({
            where: {
              guideModuleBaseId: guideModuleBaseIdsToDelete,
            },
          });
          await GuideModuleBase.destroy({
            where: {
              id: guideModuleBaseIdsToDelete,
            },
          });
        }

        return guideBase;
      });
    },

    {
      name: 'syncTemplateChangesToGuideBase',
      data: {
        guideBaseId: guideBase.id,
      },
    }
  );
}
