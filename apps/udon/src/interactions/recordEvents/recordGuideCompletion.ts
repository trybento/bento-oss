import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { User } from 'src/data/models/User.model';
import { enableInternalGuideEvents } from 'src/utils/features';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { triggerEventHook, EventHookType } from '../webhooks/triggerEventHook';
import detachPromise from 'src/utils/detachPromise';

type Args = {
  accountUser?: AccountUser;
  guide: Guide;
  user?: User;
};

export default async function recordGuideCompletion({
  accountUser,
  guide,
  user,
}: Args) {
  // auto-complete steps based on this guide's completion
  await queueJob({
    jobType: JobType.AutoCompleteStepOnGuideCompletion,
    completedGuideId: guide.id,
    completedByUserId: user?.id,
    completedByAccountUserId: accountUser?.id,
  });

  if (!accountUser && !user) return;

  const useInternalEvents = accountUser
    ? await enableInternalGuideEvents.enabled(accountUser.organizationId)
    : false;

  if (accountUser?.internal && !useInternalEvents) return;

  detachPromise(async () => {
    const account = accountUser && (await accountUser.$get('account'));

    const template = await guide.$get('createdFromTemplate', {
      attributes: ['entityId', 'name'],
    });

    const payload = {
      eventType: EventHookType.GuideCompleted as const,
      accountId: account?.externalId || null,
      accountName: account?.name || null,
      userId: accountUser?.externalId || null,
      userEmail: accountUser?.email || null,
      data: {
        guideEntityId: template?.entityId,
        guideName: template?.name,
      },
    };

    triggerEventHook({
      payload,
      organizationId: guide.organizationId,
    });
  });
}
