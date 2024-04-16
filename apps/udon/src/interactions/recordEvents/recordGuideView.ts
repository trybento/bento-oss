import { SelectedModelAttrs } from 'bento-common/types';
import { isAnnouncement } from 'bento-common/data/helpers';
import { recordGuideParticipantFirstViewedAt } from './recordGuideParticipantFirstViewedAt';
import { updateGuideLastActiveAt } from '../updateGuideLastActiveAt';
import { triggerEventHook, EventHookType } from '../webhooks/triggerEventHook';
import {
  enableGuideViewedEmails,
  enableInternalGuideEvents,
} from 'src/utils/features';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide, GuideScope } from 'src/data/models/Guide.model';
import NoContentError from 'src/errors/NoContentError';
import { Organization } from 'src/data/models/Organization.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

type Args = {
  entityId: string;
} & (
  | {
      accountUser: SelectedModelAttrs<
        AccountUser,
        'id' | 'internal' | 'organizationId' | 'entityId'
      >;
      accountUserEntityId?: never;
      organizationEntityId?: never;
    }
  | {
      accountUser?: never;
      accountUserEntityId: string;
      organizationEntityId: string;
    }
);

/** Handle creation and updating of GuideParticipants */
export default async function recordGuideView({
  entityId,
  accountUser: givenAccountUser,
  accountUserEntityId,
  organizationEntityId,
}: Args) {
  const accountUser =
    givenAccountUser ??
    (await AccountUser.findOne({
      where: {
        entityId: accountUserEntityId,
      },
      include: [
        {
          model: Organization,
          required: true,
          attributes: [],
          where: {
            entityId: organizationEntityId,
          },
        },
      ],
    }));

  if (!accountUser) {
    throw new NoContentError(accountUserEntityId, 'accountUser');
  }

  const guide = await Guide.scope({
    method: [
      GuideScope.withTemplate,
      {
        required: true,
        attributes: ['entityId', 'name', 'formFactor', 'isSideQuest'],
      },
    ],
  }).findOne({
    where: {
      entityId,
      organizationId: accountUser.organizationId,
    },
  });

  if (!guide) {
    throw new NoContentError(entityId, 'guide');
  }

  const isFirstViewing = await recordGuideParticipantFirstViewedAt({
    guide,
    accountUser,
  });

  await updateGuideLastActiveAt({ guide });

  const useInternalEvents = await enableInternalGuideEvents.enabled(
    accountUser.organizationId
  );

  if (isFirstViewing && (!accountUser.internal || useInternalEvents)) {
    const account = await accountUser.$get('account');

    const payload = {
      eventType: EventHookType.GuideViewed as const,
      accountId: account!.externalId || null,
      userId: accountUser.externalId || null,
      accountName: account!.name || null,
      userEmail: accountUser.email || null,
      data: {
        guideEntityId: guide.createdFromTemplate!.entityId,
        guideName: guide.createdFromTemplate!.name,
      },
    };

    triggerEventHook({
      payload,
      organizationId: accountUser.organizationId,
      key: (payload.userId || 'n') + payload.data.guideEntityId,
    });

    const useGuideViewedEmails = await enableGuideViewedEmails.enabled(
      accountUser.organizationId
    );

    if (
      !isAnnouncement(guide.createdFromTemplate!.designType) &&
      useGuideViewedEmails
    ) {
      await queueJob({
        jobType: JobType.SendGuideViewedEmail,
        guideEntityId: guide.entityId,
        accountUserEntityId: accountUser.entityId,
      });
    }
  }

  return guide;
}
