import {
  GuideTypeEnum,
  Nullable,
  SelectedModelAttrsPick,
} from 'bento-common/types';
import { triggerCorrespondingBranchingPathsFromBranchingKeys } from './triggerCorrespondingBranchingPathsFromBranchingKey';
import { setStepCompletion } from '../setStepCompletion';
import { updateGuideLastActiveAt } from '../updateGuideLastActiveAt';
import {
  Step,
  StepCompletedByType,
  StepModelScope,
  StepWithPrototypeBranchingInfo,
} from 'src/data/models/Step.model';
import { resetStepBranchingPaths } from './resetStepBranchingPaths';
import { Guide } from 'src/data/models/Guide.model';
import NoContentError from 'src/errors/NoContentError';
import { AuthenticatedEmbedRequest } from 'src/graphql/types';
import { Template } from 'src/data/models/Template.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

export type SelectBranchingPathArgs = {
  stepEntityId: string;
  shouldCompleteStep: boolean;
  choiceKeys: string[];
  choiceLabels: string[];
};

export default async function selectBranchingPath(
  {
    stepEntityId,
    shouldCompleteStep = true,
    choiceKeys,
    choiceLabels,
  }: SelectBranchingPathArgs,
  { accountUser, organization }: AuthenticatedEmbedRequest['user']
): Promise<{
  guidesAddedOrLaunched: boolean;
  step?: Step | undefined;
  launchedGuides: Guide[];
}> {
  if (!stepEntityId) throw new Error('Step entityId not provided');

  const step = (await Step.scope([
    StepModelScope.withPrototypeBranchingInfo,
  ]).findOne({
    where: {
      entityId: stepEntityId,
      organizationId: organization.id,
    },
    // this is also used by the caller of this function so should remain or
    // the callers need to be updated if this is removed
    include: [
      {
        model: Guide,
        include: [
          {
            model: Template,
            required: true,
            attributes: ['type'],
          },
        ],
      },
    ],
  })) as Nullable<
    StepWithPrototypeBranchingInfo & {
      guide: Guide & {
        createdFromTemplate: SelectedModelAttrsPick<Template, 'type'>;
      };
    }
  >;

  if (!step) throw new NoContentError(stepEntityId, 'step');

  const { guide } = step;

  if (!guide) throw new NoContentError(step.guideId, 'guide');

  // Reset paths every time a selection is made.
  await resetStepBranchingPaths({ accountUser, step });

  /* If we are branching on an account guide */
  const isBranchingGuideOfAccountType =
    guide.createdFromTemplate.type === GuideTypeEnum.account;

  // trigger actions for that step
  const { guidesAddedOrLaunched, launchedGuides } =
    await triggerCorrespondingBranchingPathsFromBranchingKeys({
      accountUser,
      choiceKeys,
      step,
      shouldPropagateChanges: isBranchingGuideOfAccountType,
    });

  // set step completion if needed
  if (shouldCompleteStep) {
    /* Important this happens after branching action, so we don't complete before adding modules */
    await setStepCompletion({
      step,
      isComplete: choiceKeys.length > 0,
      accountUser,
      shouldApplyToGuideStepBase: isBranchingGuideOfAccountType,
      completedByType: StepCompletedByType.AccountUser,
      updatedByChoice: choiceLabels.join(','),
    });
  }

  await updateGuideLastActiveAt({ guide });

  await queueJob({
    jobType: JobType.UpdateChangedBranchGuideAudience,
    accountId: accountUser.accountId,
    accountUserId: accountUser.id,
  });

  return {
    guidesAddedOrLaunched: !!guidesAddedOrLaunched,
    step,
    launchedGuides,
  };
}
