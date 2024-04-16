import { Nullable, SelectedModelAttrsPick } from 'bento-common/types';

import {
  AccountUser,
  AccountUserModelScope,
  AccountUserWithAccount,
} from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { Step } from 'src/data/models/Step.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Template } from 'src/data/models/Template.model';
import { enableInternalGuideEvents } from 'src/utils/features';
import { triggerEventHook, EventHookType } from '../webhooks/triggerEventHook';
import { WebhookPayloadMap } from '../webhooks/webhook.types';
import { recordStepParticipantFirstViewedAt } from './recordStepParticipantFirstViewedAt';

type Args = {
  stepEntityId: string;
  accountUserEntityId: string;
  skipNotifications?: boolean;
};

/** Handle creation and updating of StepParticipants */
export default async function recordStepView({
  stepEntityId,
  accountUserEntityId,
  skipNotifications = false,
}: Args) {
  const step = (await Step.findOne({
    where: {
      entityId: stepEntityId,
    },
    include: [
      {
        model: GuideStepBase,
        attributes: ['orderIndex'],
        required: true,
      },
      {
        model: StepPrototype,
        attributes: ['name'],
        required: true,
      },
      {
        model: Guide,
        required: true,
        attributes: ['id'],
        include: [
          {
            model: Template,
            required: true,
            attributes: ['entityId', 'name'],
          },
        ],
      },
    ],
  })) as Nullable<
    Step & {
      createdFromGuideStepBase: SelectedModelAttrsPick<
        GuideStepBase,
        'orderIndex'
      >;
      createdFromStepPrototype: SelectedModelAttrsPick<StepPrototype, 'name'>;
      guide: SelectedModelAttrsPick<Guide, 'id'> & {
        createdFromTemplate: SelectedModelAttrsPick<
          Template,
          'entityId' | 'name'
        >;
      };
    }
  >;

  if (!step) return;

  const accountUser = (await AccountUser.scope(
    AccountUserModelScope.withAccount
  ).findOne({
    where: { entityId: accountUserEntityId! },
  })) as Nullable<AccountUserWithAccount>;

  if (!accountUser) return;

  if (step.organizationId !== accountUser.organizationId) {
    throw new Error('Refused to record step view for a different organization');
  }

  const firstView = await recordStepParticipantFirstViewedAt({
    step,
    accountUser: accountUser,
    organizationId: accountUser.organizationId,
  });

  const useInternalEvents = await enableInternalGuideEvents.enabled(
    step.organizationId
  );

  if (
    !firstView ||
    skipNotifications ||
    (accountUser.internal && !useInternalEvents)
  )
    return;

  const { account } = accountUser;
  const { guide } = step;

  const payload: WebhookPayloadMap[EventHookType.StepViewed] = {
    eventType: EventHookType.StepViewed as const,
    accountId: account!.externalId || null,
    accountName: account!.name || null,
    userId: accountUser.externalId || null,
    userEmail: accountUser.email || null,
    data: {
      stepEntityId: step.entityId,
      stepName: step.createdFromStepPrototype.name,
      guideEntityId: guide.createdFromTemplate.entityId,
      guideName: guide.createdFromTemplate.name,
      orderIndex: step.createdFromGuideStepBase.orderIndex,
    },
  };

  triggerEventHook({
    organizationId: accountUser.organizationId,
    payload,
    key: payload.userId + payload.data.stepEntityId,
  });
}
