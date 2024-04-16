import { Events, Nullable, SelectedModelAttrs } from 'bento-common/types';

import { analytics } from '../analytics/analytics';
import { triggerEventHook, EventHookType } from '../webhooks/triggerEventHook';
import { enableInternalGuideEvents } from 'src/utils/features';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { User } from 'src/data/models/User.model';
import { InputWithAnswer } from 'src/graphql/InputStep/types';
import { isBranchingStep } from 'src/utils/stepHelpers';
import {
  StepCompletedByPayloadType,
  WebhookPayloadMap,
} from '../webhooks/webhook.types';
import { Template } from 'src/data/models/Template.model';
import {
  StepPrototype,
  StepPrototypeModelScope,
} from 'src/data/models/StepPrototype.model';
import { logger } from 'src/utils/logger';
import {
  GuideStepBase,
  GuideStepBaseWithPrototypeWithBranchingInfo,
} from 'src/data/models/GuideStepBase.model';

type Args = {
  step: Step;
  accountUser?: AccountUser;
  guide: Guide & {
    createdFromTemplate: SelectedModelAttrs<Template, 'entityId' | 'name'>;
  };
  user?: User;
  /** List of inputs (labels and values) given by the end-user */
  inputsWithAnswers?: InputWithAnswer[];
  /** The branching choice, if selected */
  updatedByChoice?: string;
};

export default async function recordStepCompletion({
  step,
  accountUser,
  guide,
  user,
  inputsWithAnswers,
  updatedByChoice,
}: Args) {
  await analytics.step.newEvent(Events.stepCompleted, {
    accountUserEntityId: accountUser?.entityId,
    userEntityId: user?.entityId,
    stepEntityId: step.entityId,
    organizationEntityId: guide.organization.entityId,
  });

  const useInternalEvents = await enableInternalGuideEvents.enabled(
    step.organizationId
  );

  if (accountUser && accountUser.internal && !useInternalEvents) return;

  const account = accountUser && (await accountUser.$get('account'));

  const stepBase = (await step.$get('createdFromGuideStepBase', {
    include: [
      {
        model: StepPrototype.scope(StepPrototypeModelScope.withBranchingFields),
        required: true,
      },
    ],
    attributes: ['orderIndex'],
  })) as Nullable<
    GuideStepBaseWithPrototypeWithBranchingInfo<
      SelectedModelAttrs<GuideStepBase, 'orderIndex'>
    >
  >;

  if (!stepBase) {
    logger.info('Wont send webhook for missing Step prototype.');
    return;
  }

  const stepPrototype = stepBase.createdFromStepPrototype;

  const payload: WebhookPayloadMap[EventHookType.StepCompleted] = {
    eventType: EventHookType.StepCompleted as const,
    accountId: account?.externalId || null,
    accountName: account?.name || null,
    userId: accountUser?.externalId || null,
    userEmail: accountUser?.email || user?.email || null,
    data: {
      stepEntityId: step.entityId,
      stepName: stepPrototype.name,
      guideEntityId: guide.createdFromTemplate?.entityId,
      guideName: guide.createdFromTemplate?.name,
      orderIndex: stepBase.orderIndex,
      inputAnswers: inputsWithAnswers,
      completedByType:
        step.completedByType === StepCompletedByType.Auto
          ? StepCompletedByPayloadType.auto
          : StepCompletedByPayloadType.manual,
      branchingChoices: isBranchingStep(stepPrototype.stepType)
        ? {
            question: stepPrototype.branchingQuestion,
            choice: updatedByChoice || '-',
          }
        : undefined,
    },
  };

  triggerEventHook({
    payload,
    organizationId: step.organizationId,
  });
}
