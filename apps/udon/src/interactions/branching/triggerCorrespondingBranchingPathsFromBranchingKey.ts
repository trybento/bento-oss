import { BentoEvents, GuideTypeEnum } from 'bento-common/types';

import promises from 'src/utils/promises';
import { withTransaction } from 'src/data';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { Module } from 'src/data/models/Module.model';
import { StepWithPrototypeBranchingInfo } from 'src/data/models/Step.model';
import { Template } from 'src/data/models/Template.model';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';
import { autoCompleteStepsMappedToEvent } from '../autoCompleteStepsMappedToEvent';
import { EventProperties } from '../targeting/checkStepEventMappingRulesSatisfied';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';
import createAndLaunchAccountGuide from './createAndLaunchAccountGuide';
import createAndLaunchUserGuide from './createAndLaunchUserGuide';
import { addModuleToGuideBase } from './addModuleToGuideBase';

type Args = {
  /** For which Step */
  step: StepWithPrototypeBranchingInfo;
  /** For which Account User */
  accountUser: AccountUser;
  /** Whether changes should be propagated */
  shouldPropagateChanges?: boolean;
  /** The choice keys the user have selected. */
  choiceKeys: string[];
};

/**
 * Called after a step completes, check branching key
 * @returns if modules were added, as opposed to guides
 */
export async function triggerCorrespondingBranchingPathsFromBranchingKeys({
  accountUser,
  shouldPropagateChanges,
  step,
  choiceKeys,
}: Args): Promise<{
  /** Determine if modules were added */
  modulesAdded: boolean;
  /** Determine if guides were added or launched to a new account user  */
  guidesAddedOrLaunched: boolean;
  /** The guide that was launched, if any */
  launchedGuides: Guide[];
}> {
  return withSentrySpan(
    async () => {
      /** Query by org ID where desired */
      const { organizationId } = accountUser;

      let modulesAdded = false;
      let guidesAddedOrLaunched = false;
      const launchedGuides: Guide[] = [];

      if (!step?.createdFromStepPrototype) {
        return { modulesAdded, guidesAddedOrLaunched, launchedGuides };
      }

      const branchingPaths = await BranchingPath.findAll({
        where: {
          branchingKey: step.createdFromStepPrototype.entityId,
          choiceKey: choiceKeys,
        },
        /** Reverse order as we insert by placing modules after the triggering module */
        order: [['orderIndex', 'DESC']],
      });

      if (branchingPaths.length === 0)
        return { modulesAdded, guidesAddedOrLaunched, launchedGuides };

      const guide = await Guide.findOne({
        where: { id: step.guideId, organizationId },
        include: [GuideBase],
      });

      if (!guide)
        return { modulesAdded, guidesAddedOrLaunched, launchedGuides };

      const account = await accountUser.$get('account', {
        scope: 'notArchived',
      });

      if (!account) throw new Error('Account not found');

      return withTransaction(async () => {
        await promises.each(branchingPaths, async (branchingPath) => {
          let createdGuideModule: GuideModule | undefined;
          let createdGuideModuleBase: GuideModuleBase | undefined;

          const choiceText =
            step.createdFromStepPrototype.branchingChoices!.reduce<string[]>(
              (acc, bc) => {
                if (bc.choiceKey === branchingPath.choiceKey) {
                  acc.push(bc.label);
                }
                return acc;
              },
              []
            );

          const triggeredBranchingPathShared: Partial<TriggeredBranchingPath> =
            {
              branchingPathId: branchingPath.id,
              triggeredFromStepId: step.id,
              triggeredFromGuideId: guide.id,
              accountUserId: accountUser.id,
              organizationId: guide.organizationId,
              ...(choiceText.length
                ? {
                    data: { choiceText },
                  }
                : {}),
            };

          if (
            branchingPath.actionType === 'create' &&
            branchingPath.entityType === 'module' &&
            branchingPath.moduleId
          ) {
            await withSentrySpan(
              async () => {
                // Add module here
                const module = await Module.findOne({
                  where: { id: branchingPath.moduleId },
                });

                if (!module || !guide.createdFromGuideBase) return;

                const { guideModuleBase, guideModule } =
                  await addModuleToGuideBase({
                    module,
                    guideBase: guide.createdFromGuideBase,
                    shouldOnlyAddToNewGuidesDynamically:
                      !shouldPropagateChanges,
                    guide,
                    step,
                  });
                createdGuideModule = guideModule;
                createdGuideModuleBase = guideModuleBase;

                modulesAdded = true;

                await TriggeredBranchingPath.create({
                  ...triggeredBranchingPathShared,
                  createdGuideModuleId: createdGuideModule?.id,
                  createdGuideModuleBaseId: createdGuideModuleBase?.id,
                });
              },
              {
                name: 'branching.createModule',
              }
            );
          } else if (
            branchingPath.actionType === 'create' &&
            branchingPath.entityType === 'guide' &&
            branchingPath.templateId
          ) {
            await withSentrySpan(
              async () => {
                // Launch template here
                const template = await Template.findOne({
                  where: {
                    id: branchingPath.templateId,
                    organizationId,
                  },
                });

                if (!template) return;

                const activeGuideBase = await GuideBase.findOne({
                  where: {
                    organizationId,
                    createdFromTemplateId: template.id,
                    accountId: account.id,
                    state: 'active',
                  },
                });

                /** the guide created just now or simply "launched" to the new account user */
                let launchedGuide: Guide | undefined | null;

                const args = {
                  account,
                  accountUser,
                  activeGuideBase,
                  template,
                };

                /**
                 * Launches the destination guide according to that guide scope.
                 * This is necessary to allow user level CYOA guides to launch
                 * account level destination guides.
                 */
                switch (template.type) {
                  case GuideTypeEnum.account:
                    launchedGuide = await createAndLaunchAccountGuide(args);
                    break;

                  case GuideTypeEnum.user:
                    launchedGuide = await createAndLaunchUserGuide(args);
                    break;

                  default:
                    throw new Error(
                      `Branching not implemented for scope: ${template.type}`
                    );
                }

                if (launchedGuide) {
                  await TriggeredBranchingPath.create({
                    ...triggeredBranchingPathShared,
                    createdGuideId: launchedGuide.id,
                  });

                  guidesAddedOrLaunched = true;
                  launchedGuides.push(launchedGuide);
                }
              },
              {
                name: 'branching.createGuide',
              }
            );
          } else if (!branchingPath.moduleId && !branchingPath.templateId) {
            /* Record "No destination" branches */
            await TriggeredBranchingPath.create({
              ...triggeredBranchingPathShared,
            });
          }
        });

        await withSentrySpan(
          async () => {
            // Immediately run step auto-completions to make sure
            // the launched module/guide are going to be immediately updated.
            if (modulesAdded || guidesAddedOrLaunched) {
              const organization = (await account.$get('organization'))!;

              await autoCompleteStepsMappedToEvent({
                accountUserExternalId: accountUser.externalId,
                eventName: BentoEvents.account,
                eventProperties:
                  account.attributes as unknown as EventProperties,
                organization,
                accountExternalId: account!.externalId,
              });

              await autoCompleteStepsMappedToEvent({
                accountUserExternalId: accountUser.externalId,
                eventName: BentoEvents.user,
                eventProperties:
                  accountUser.attributes as unknown as EventProperties,
                organization,
                accountExternalId: account!.externalId,
              });
            }
          },
          {
            name: 'branching.autocomplete',
          }
        );

        return { modulesAdded, guidesAddedOrLaunched, launchedGuides };
      });
    },
    {
      name: `branching.triggerCorrespondingBranchingPathsFromBranchingKeys`,
      op: 'interaction',
    }
  );
}
