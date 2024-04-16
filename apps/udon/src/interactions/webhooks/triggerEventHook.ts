import { v4 as uuidv4 } from 'uuid';
import { WebhookDestinationData, WebhookPayload } from './webhook.types';
import detachPromise from 'src/utils/detachPromise';
import { hasActiveHookListeners } from './webhook.helpers';
import { queueEventHook } from 'src/jobsBull/jobs/integrations/integrations.helpers';

export { EventHookType } from './webhook.types';

type Args = {
  payload: WebhookPayload;
  organizationId: number;
  destinationOpts?: WebhookDestinationData;
  key?: string;
};

export function getEventHookMetadata() {
  return {
    timestamp: new Date().toISOString(),
    eventId: uuidv4(),
  };
}

export function triggerEventHook({
  payload: rawPayload,
  organizationId,
  destinationOpts,
  key,
}: Args) {
  detachPromise(async () => {
    /* Don't put load on the job queue if events aren't even used */
    const shouldQueue = await hasActiveHookListeners(organizationId);
    if (!shouldQueue && !destinationOpts) return;

    const payload = {
      ...rawPayload,
      ...getEventHookMetadata(),
    };

    await queueEventHook({ payload, destinationOpts, organizationId }, 2500);
  }, 'triggerEventHook');
}
