import { CreationAttributes } from 'sequelize';
import promises from 'src/utils/promises';
import { keyBy, isEqual } from 'lodash';
import { GuideTypeEnum, SelectedModelAttrs } from 'bento-common/types';
import { isFlatTheme } from 'bento-common/data/helpers';
import { withTransaction } from 'src/data';
import {
  attrsFromGuideStepBase,
  bulkUpsertStep,
  Step,
} from 'src/data/models/Step.model';
import { enableStepProgressSyncing } from 'src/utils/features';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { queueJob } from 'src/jobsBull/queues';
import { queueJob as queueJobBull } from 'src/jobsBull/queues';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { Guide } from 'src/data/models/Guide.model';
import createTaggedElements from 'src/interactions/taggedElements/createTaggedElements';
import { JobType } from 'src/jobsBull/job';
import { Template } from 'src/data/models/Template.model';
import { createStepAutoCompleteInteractions } from 'src/interactions/autoComplete/createStepAutoCompleteInteractions';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type SyncGuideBaseChangesToGuideArgs = {
  guideBase: SelectedModelAttrs<
    GuideBase,
    'organizationId' | 'createdFromTemplateId'
  > & {
    createdFromTemplate: SelectedModelAttrs<Template, 'type' | 'theme'>;
  };
  guideModuleBases: GuideModuleBase[];
  guide: SelectedModelAttrs<
    Guide,
    'id' | 'entityId' | 'createdFromGuideBaseId' | 'createdFromTemplateId'
  >;
};

type GuideModulesCollection = Array<
  Omit<
    SelectedModelAttrs<
      GuideModule,
      'id' | 'entityId' | 'name' | 'orderIndex' | 'createdFromGuideModuleBaseId'
    >,
    'steps'
  > & {
    steps: SelectedModelAttrs<
      Step,
      | 'id'
      | 'entityId'
      | 'guideId'
      | 'createdFromGuideStepBaseId'
      | 'createdFromStepPrototypeId'
    >[];
  }
>;

export async function syncGuideBaseChangesToGuide({
  guideBase,
  guideModuleBases,
  guide,
}: SyncGuideBaseChangesToGuideArgs) {
  await withSentrySpan(
    async () => {
      const guideModules = (await GuideModule.findAll({
        attributes: [
          'entityId',
          'id',
          'name',
          'orderIndex',
          'createdFromGuideModuleBaseId',
        ],
        include: [
          {
            model: Step,
            attributes: [
              'entityId',
              'id',
              'guideId',
              'createdFromGuideStepBaseId',
              'createdFromStepPrototypeId',
            ],
          },
        ],
        where: {
          guideId: guide.id,
        },
        order: [
          ['orderIndex', 'ASC'],
          [{ model: Step, as: 'steps' }, 'orderIndex', 'ASC'],
        ],
      })) as GuideModulesCollection;

      const guideModulesByGuideModuleBaseId = keyBy(
        guideModules,
        'createdFromGuideModuleBaseId'
      );

      const steps: GuideModulesCollection[number]['steps'] =
        guideModules.flatMap((gm) => gm.steps);

      const stepsByGuideStepBaseId = keyBy(steps, 'createdFromGuideStepBaseId');

      await createTaggedElements({
        guide,
        steps,
        organizationId: guideBase.organizationId,
        stopEvents: true,
      });

      const updatedGuideModulesById: Record<
        number,
        GuideModulesCollection[number]
      > = {};

      /**
       * @todo consider entirely removing the transaction
       * @see https://docs.google.com/document/d/195E_xLEy-JJiYaDZcdBq5_a6T3GXJJC2zLF1c80ghYo
       */
      return withTransaction(async () => {
        await promises.each(guideModuleBases, async (guideModuleBase) => {
          let guideModule = guideModulesByGuideModuleBaseId[guideModuleBase.id];
          const guideStepBases = guideModuleBase.guideStepBases || [];

          if (guideModule) {
            // Update guide module in case things have changed
            if (!isEqual(guideModule.orderIndex, guideModuleBase.orderIndex)) {
              await guideModule.update({
                orderIndex: guideModuleBase.orderIndex,
              });
            }

            const bulkCreateStepData = guideStepBases.reduce<
              CreationAttributes<Step>[]
            >((acc, guideStepBase) => {
              const step = stepsByGuideStepBaseId[guideStepBase.id];

              /**
               * We don't care about existing Steps since we don't have to propagate anything from
               * GuideStepBase to Steps anymore, therefore we only care about the ones that should
               * be created.
               */
              if (!step) {
                acc.push(
                  attrsFromGuideStepBase(guideStepBase, {
                    guideModuleId: guideModule.id,
                    guideId: guide.id,
                  })
                );
              }

              return acc;
            }, []);

            const newOrUpdatedSteps = await bulkUpsertStep(bulkCreateStepData);

            await createStepAutoCompleteInteractions({
              steps: steps.concat(newOrUpdatedSteps),
            });
          } else {
            if (
              guideBase.createdFromTemplate.type === GuideTypeEnum.user &&
              guideModuleBase.addedDynamicallyAt
            ) {
              return;
            }

            [guideModule] = await GuideModule.upsert(
              {
                createdFromGuideModuleBaseId: guideModuleBase.id,
                guideId: guide.id,
                createdFromModuleId: guideModuleBase.createdFromModuleId,
                organizationId: guideModuleBase.organizationId,
                orderIndex: guideModuleBase.orderIndex,
              },
              {
                returning: true,
                conflictFields: ['guide_id', 'created_from_module_id'] as any,
              }
            );

            const stepAttrs = guideStepBases.map((guideStepBase) =>
              attrsFromGuideStepBase(guideStepBase, {
                guideModuleId: guideModule.id,
                guideId: guide.id,
              })
            );

            const newSteps = await bulkUpsertStep(stepAttrs);

            await createStepAutoCompleteInteractions({
              steps: newSteps,
            });

            /* If we added a guide module check if for prior completion */
            const useStepSync = await enableStepProgressSyncing.enabled(
              guideBase.organizationId
            );

            if (
              !isFlatTheme(guideBase.createdFromTemplate.theme) &&
              useStepSync
            ) {
              /** @todo paginate/chunk down giving a single guide can have too many participants */
              const guideParticipants = await GuideParticipant.findAll({
                attributes: ['accountUserId'],
                where: { guideId: guide.id },
              });

              if (guideParticipants.length) {
                for (const gp of guideParticipants) {
                  await queueJob({
                    jobType: JobType.PreCompleteSteps,
                    guideId: guide.id,
                    accountUserId: gp.accountUserId,
                  });
                }
              }
            }
          }

          /**
           * Record the guide module as updated to prevent it from being deleted later.
           */
          updatedGuideModulesById[guideModule.id] = guideModule;
        });

        /**
         * Find all guide modules that were not updated and therefore should be deleted.
         */
        const guideModulesToDelete = guideModules.reduce<number[]>(
          (acc, guideModule) => {
            if (!updatedGuideModulesById[guideModule.id]) {
              acc.push(guideModule.id);
            }
            return acc;
          },
          []
        );

        /**
         * Soft-delete the affected guide modules and queue a job to actually delete them
         * in the background, so we don't block the transaction.
         */
        if (guideModulesToDelete.length) {
          await GuideModule.destroy({
            where: {
              id: guideModulesToDelete,
            },
          });

          await queueJobBull({
            jobType: JobType.DeleteObjects,
            type: 'guideModule',
            organizationId: guideBase.organizationId,
            objectIds: guideModulesToDelete,
          });
        }
      });
    },

    {
      name: 'syncGuideBaseChangesToGuide',
      data: {
        guideBaseId: guideBase.id,
        guideId: guide.id,
      },
    }
  );
}
