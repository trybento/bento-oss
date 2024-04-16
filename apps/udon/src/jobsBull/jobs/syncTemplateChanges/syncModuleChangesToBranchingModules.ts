import promises from 'src/utils/promises';
import { groupBy, isEqual, keyBy, pick } from 'lodash';
import { Op } from 'sequelize';

import { withTransaction } from 'src/data';
import {
  attrsFromStepPrototype,
  GuideStepBase,
} from 'src/data/models/GuideStepBase.model';
import { attrsFromGuideStepBase, Step } from 'src/data/models/Step.model';
import { guideBaseChanged, guideChanged } from 'src/data/events';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Guide } from 'src/data/models/Guide.model';
import { Module } from 'src/data/models/Module.model';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type SyncModuleChangesToBranchingModulesArgs = {
  module: Module;
};

/** @todo revisit to remove the need to propagate unnecessary branching changes */
export async function syncModuleChangesToBranchingModules({
  module,
}: SyncModuleChangesToBranchingModulesArgs) {
  return withSentrySpan(
    async () => {
      return withTransaction(async () => {
        const guideModuleBases = await GuideModuleBase.findAll({
          where: {
            createdFromModuleId: module.id,
            addedDynamicallyAt: {
              [Op.not]: null as unknown as undefined,
            },
          },
        });

        const moduleStepPrototypes = await ModuleStepPrototype.scope([
          'withStepPrototype',
          'byOrderIndex',
        ]).findAll({
          where: { moduleId: module.id },
        });

        const moduleStepPrototypesByModuleId = groupBy(
          moduleStepPrototypes,
          'moduleId'
        ) as Record<number, ModuleStepPrototype[]>;

        const allGuideStepBases = await GuideStepBase.findAll({
          where: {
            guideModuleBaseId: guideModuleBases.map((gmb) => gmb.id),
          },
          order: [
            ['guideModuleBaseId', 'ASC'],
            ['orderIndex', 'ASC'],
          ],
        });

        const guideStepBasesByGuideModuleBaseId = groupBy(
          allGuideStepBases,
          'guideModuleBaseId'
        );

        const destroyedGuideStepBaseIds = new Set<number>();
        const updatedGuideStepBasesByGuideModuleBaseId: Record<
          number,
          GuideStepBase[]
        > = {};

        await promises.mapSeries(guideModuleBases, async (guideModuleBase) => {
          const moduleStepPrototypesOfModule =
            moduleStepPrototypesByModuleId[module.id];
          const stepPrototypesOfModule = moduleStepPrototypesOfModule.map(
            (msp) => msp.stepPrototype
          ) as StepPrototype[];

          await guideModuleBase.update({
            updatedByUserId: module.updatedByUserId,
          });

          const guideStepBases =
            guideStepBasesByGuideModuleBaseId[guideModuleBase.id] || [];
          const guideStepBasesByStepPrototypeId = keyBy(
            guideStepBases,
            'createdFromStepPrototypeId'
          );

          const updatedGuideStepBases: GuideStepBase[] =
            await promises.mapSeries(
              stepPrototypesOfModule,
              async (stepPrototype, idx) => {
                const guideStepBase =
                  guideStepBasesByStepPrototypeId[stepPrototype.id];

                if (guideStepBase) {
                  const newValues = {
                    orderIndex: moduleStepPrototypesOfModule[idx].orderIndex,
                    updatedByUserId: stepPrototype.updatedByUserId,
                  };

                  // Update guideStepBase only if things have changed
                  if (
                    !isEqual(
                      pick(guideStepBase, ['orderIndex', 'updatedByUserId']),
                      newValues
                    )
                  ) {
                    await guideStepBase.update({
                      orderIndex: moduleStepPrototypesOfModule[idx].orderIndex,
                      updatedByUserId: stepPrototype.updatedByUserId,
                    });
                  }
                } else {
                  const [ret] = await GuideStepBase.upsert(
                    attrsFromStepPrototype(stepPrototype, {
                      orderIndex: moduleStepPrototypesOfModule[idx].orderIndex,
                      guideBaseId: guideModuleBase.guideBaseId,
                      guideModuleBaseId: guideModuleBase.id,
                      createdByUserId: stepPrototype.updatedByUserId,
                      updatedByUserId: stepPrototype.updatedByUserId,
                    }),
                    {
                      returning: true,
                      conflictFields: [
                        'guide_base_id',
                        'created_from_step_prototype_id',
                      ] as any,
                    }
                  );

                  return ret;
                }

                return guideStepBase;
              }
            );

          const updatedGuideStepBasesById = keyBy(updatedGuideStepBases, 'id');
          updatedGuideStepBasesByGuideModuleBaseId[guideModuleBase.id] =
            updatedGuideStepBases;

          const guideStepBasesToCleanUp = guideStepBases.filter(
            (guideStepBase) => !updatedGuideStepBasesById[guideStepBase.id]
          );
          if (guideStepBasesToCleanUp.length > 0) {
            await GuideStepBase.destroy({
              where: {
                id: guideStepBasesToCleanUp.map((gsb) => {
                  const { id } = gsb;
                  destroyedGuideStepBaseIds.add(id);
                  return id;
                }),
              },
            });
          }

          return guideModuleBase;
        });

        const branchingGuideModules = await GuideModule.findAll({
          where: {
            createdFromGuideModuleBaseId: [
              ...new Set(guideModuleBases.map((gmb) => gmb.id)),
            ],
          },
        });

        const allSteps = await Step.findAll({
          where: {
            guideModuleId: branchingGuideModules.map((gm) => gm.id),
          },
          order: [
            ['guideModuleId', 'ASC'],
            ['orderIndex', 'ASC'],
          ],
        });

        const stepsByGuideModuleId = groupBy(allSteps, 'guideModuleId');
        const stepsByGuideStepBaseId = keyBy(
          allSteps,
          'createdFromGuideStepBaseId'
        );

        await promises.mapSeries(branchingGuideModules, async (guideModule) => {
          // Should createdFromGuideModuleBaseId be nullable?
          const guideStepBases =
            updatedGuideStepBasesByGuideModuleBaseId[
              guideModule.createdFromGuideModuleBaseId!
            ];

          const steps = stepsByGuideModuleId[guideModule.id] || [];

          const existingGuideStepBases = guideStepBases.filter(
            (gsb) => !destroyedGuideStepBaseIds.has(gsb.id)
          );

          const updatedSteps = await promises.mapSeries(
            existingGuideStepBases,
            async (guideStepBase) => {
              let step = stepsByGuideStepBaseId[guideStepBase.id];

              if (!step) {
                [step] = await Step.upsert(
                  attrsFromGuideStepBase(guideStepBase, {
                    guideModuleId: guideModule.id,
                    guideId: guideModule.guideId,
                  }),
                  {
                    returning: true,
                    conflictFields: [
                      'guide_id',
                      'created_from_step_prototype_id',
                    ] as any,
                  }
                );
              }

              return step;
            }
          );

          const updatedStepsById = keyBy(updatedSteps, 'id');
          const stepsToDelete = steps.filter(
            (step) => !updatedStepsById[step.id]
          );

          if (stepsToDelete.length > 0) {
            await Step.destroy({
              where: {
                id: stepsToDelete.map((step) => step.id),
              },
            });
          }

          return guideModule;
        });

        const guideBases = await GuideBase.findAll({
          where: {
            id: [...new Set(guideModuleBases.map((gmb) => gmb.guideBaseId))],
          },
        });

        await promises.map(guideBases, async (guideBase) => {
          guideBaseChanged(guideBase.entityId);
        });

        const guidesWithBranchingModules = await Guide.findAll({
          where: {
            id: [...new Set(branchingGuideModules.map((gm) => gm.guideId))],
          },
        });

        await promises.map(guidesWithBranchingModules, async (guide) => {
          guideChanged(guide.entityId);
        });
      });
    },
    {
      name: 'syncModuleChangesToBranchingModules',
      data: {
        moduleId: module.id,
      },
    }
  );
}
