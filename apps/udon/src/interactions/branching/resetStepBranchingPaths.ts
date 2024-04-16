import { Op } from 'sequelize';
import { isSerialCyoa } from 'bento-common/data/helpers';
import {
  GuideCompletionState,
  Nullable,
  SelectedModelAttrsPick,
} from 'bento-common/types';

import { queryRunner } from 'src/data';
import promises from 'src/utils/promises';
import {
  destroyGuideModuleAndAssociatedRecords,
  destroyGuideModuleBaseAndAssociatedRecords,
  resetGuidesById,
} from './branching.helpers';
import { isBranchingStep } from 'src/utils/stepHelpers';
import {
  GuideModule,
  GuideModuleModelScope,
  GuideModuleWithBase,
} from 'src/data/models/GuideModule.model';
import {
  TriggeredBranchingPath,
  TriggeredBranchingPathModelScope,
  TriggeredBranchingPathWithBranchingPath,
} from 'src/data/models/TriggeredBranchingPath.model';
import {
  Step,
  StepWithPrototypeBranchingInfo,
} from 'src/data/models/Step.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';
import { makeLogger } from 'src/jobsBull/logger';
import { rebuildGuideModulesOrderIndex } from './rebuildGuideModulesOrderIndex';
import { rebuildGuideModuleBasesOrderIndex } from './rebuildGuideModuleBasesOrderIndex';

type Args = {
  accountUser: AccountUser;
  step: StepWithPrototypeBranchingInfo;
};

const logger = makeLogger('resetStepBranchingPaths');

/**
 * @todo unit test
 */
export async function resetStepBranchingPaths({ accountUser, step }: Args) {
  await withSentrySpan(
    async () => {
      const triggeredPaths = (await TriggeredBranchingPath.scope(
        TriggeredBranchingPathModelScope.withBranchingPath
      ).findAll({
        where: {
          triggeredFromStepId: step.id,
        },
      })) as TriggeredBranchingPathWithBranchingPath[];

      /**
       * If no triggered paths are found, it then means there is nothing to be done here.
       * @todo would it be possible to
       */
      if (!triggeredPaths.length) {
        logger.debug('No triggered paths found, nothing to do');
        return;
      }

      const prototype = step.createdFromStepPrototype;

      const branchingEntityType = triggeredPaths[0].branchingPath.entityType;

      /**
       * If this is a serial CYOA, we need to reset all incomplete guides that were
       * created off of it.
       */
      if (isSerialCyoa(branchingEntityType, prototype.branchingMultiple)) {
        /**
         * Iterates over all triggered branching paths to find all the guide that were created.
         * This is later used to find all incomplete branching guide paths that can be reset.
         */
        const triggeredGuideIds = triggeredPaths.reduce<number[]>(
          (acc, tbp) => {
            if (tbp.createdGuideId) acc.push(tbp.createdGuideId);
            return acc;
          },
          []
        );

        /**
         * Find all guides which were launched after the branching guide,
         * excluding those that had already been completed.
         */
        const incompleteGuidePaths = (await queryRunner({
          sql: `--sql
            SELECT
            	g.id AS "guideId"
            FROM
            	core.guides g
              JOIN core.triggered_branching_paths tbp ON g.id = tbp.created_guide_id
              JOIN core.branching_paths bp ON bp.id = tbp.branching_path_id
            WHERE
            	g.completion_state != :guideCompleteState
              AND g.id in (:triggeredGuideIds)
            GROUP BY
              g.id
        `,
          replacements: {
            guideCompleteState: GuideCompletionState.complete,
            triggeredGuideIds,
          },
        })) as { guideId: number }[];

        // Remove branches in progress.
        await resetGuidesById({
          accountUser,
          guideIds: incompleteGuidePaths.map((path) => path.guideId),
        });
      } else {
        await promises.each(triggeredPaths, async (triggeredPath) => {
          let guideModuleId = triggeredPath.createdGuideModuleId;
          let guideModule: GuideModule | undefined | null;
          let guideModuleBaseId = triggeredPath.createdGuideModuleBaseId;

          if (triggeredPath.createdGuideModuleBaseId && !guideModuleId) {
            guideModule = await GuideModule.findOne({
              where: {
                guideId: step.guideId,
                createdFromGuideModuleBaseId:
                  triggeredPath.createdGuideModuleBaseId,
              },
            });
            guideModuleId = guideModuleId || guideModule?.id;
          }

          if (guideModuleId) {
            const completedStepsOfModule = await Step.count({
              where: {
                guideModuleId,
                [Op.or]: [
                  { completedAt: { [Op.ne]: null } },
                  { isComplete: true }, // about to be deprecated
                ],
              },
            });

            // no progress made, so safe to remove
            if (!completedStepsOfModule) {
              guideModule =
                guideModule ||
                (await GuideModule.findByPk(
                  triggeredPath.createdGuideModuleId
                ));
              if (guideModule) {
                guideModuleBaseId =
                  guideModuleBaseId || guideModule.createdFromGuideModuleBaseId;
                await destroyGuideModuleAndAssociatedRecords({
                  guideModules: [guideModule],
                  organizationId: accountUser.organizationId,
                });
                await triggeredPath.destroy();
                await rebuildGuideModulesOrderIndex({
                  guide: guideModule.guideId,
                });
              }
            }
          }

          /* Check if we want to clean the guide module base too */
          if (guideModuleBaseId) {
            const remainingModule = (await GuideModule.scope(
              GuideModuleModelScope.withBase
            ).findOne({
              where: {
                createdFromGuideModuleBaseId: guideModuleBaseId,
              },
              attributes: ['id'],
            })) as Nullable<
              GuideModuleWithBase<SelectedModelAttrsPick<GuideModule, 'id'>>
            >;

            if (remainingModule) {
              await destroyGuideModuleBaseAndAssociatedRecords({
                guideModuleBase: remainingModule.createdFromGuideModuleBase,
              });

              await rebuildGuideModuleBasesOrderIndex({
                guideBase:
                  remainingModule.createdFromGuideModuleBase.guideBaseId,
              });
            }
          }
        });

        if (
          !isBranchingStep(prototype.stepType) ||
          (isBranchingStep(prototype.stepType) && !prototype.branchingMultiple)
        ) {
          // Set step incomplete
          await step.markAsIncomplete();
        }
      }
    },
    {
      name: 'branching.resetStepBranchingPaths',
      op: 'interactions',
    }
  );
}
