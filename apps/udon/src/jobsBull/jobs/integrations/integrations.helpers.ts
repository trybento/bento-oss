import { Op } from 'sequelize';
import { WebhookType } from 'bento-common/types';

import { Webhook } from 'src/data/models/Integrations/Webhook.model';
import { Organization } from 'src/data/models/Organization.model';
import {
  EventHookType,
  EventHookPayload,
  WebhookState,
} from 'src/interactions/webhooks/webhook.types';
import { backoffDelay, fetchTimeout } from 'src/utils/helpers';
import { logger } from 'src/utils/logger';
import { invalidateHookListenersCache } from 'src/interactions/webhooks/webhook.helpers';
import { Logger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { INTEGRATION_FETCH_TIMEOUT } from 'src/utils/constants';

export enum EventHookDestination {
  webhook = 'webhook',
}

export type EventHookJobPayload = EventHookPayload & {
  /** Queue job to keep retrying one type of hook */
  retryInfo?: {
    type: EventHookDestination;
    times: number;
  };
  customTimeout?: number;
};

/** How many times the webhook failed to run before we give up */
const MAX_EVENT_HOOK_TRIES = 10;

/**
 * Run the specified hook handler with retry/requeue catches
 */
export const runEventHookHandlers = async ({
  type,
  payload,
  logger,
}: {
  type: EventHookDestination;
  payload: EventHookJobPayload;
  logger?: Logger;
}) => {
  let onFailedHandler: void | (() => Promise<void>);

  switch (type) {
    case EventHookDestination.webhook:
      onFailedHandler = await handleWebhook(payload);
      break;
    default:
      logger?.info(`[eventHooks] event hook type ${type} not supported`);
  }

  /* Success, move along */
  if (!onFailedHandler) return;

  const currentAttempts = payload.retryInfo ? payload.retryInfo.times : 0;

  /**
   * We specifically do not rely on any queue system's fail mechanism because
   *   - we need to specify what to retry, not retry /everything/
   *   - we want to handle n number of retry behavior
   */
  if (currentAttempts + 1 >= MAX_EVENT_HOOK_TRIES) {
    /* Run the permanent fail so we don't keep flooding the queue */
    await onFailedHandler();
  } else {
    /* Queue retry */
    const newPayload: EventHookJobPayload = {
      ...payload,
      retryInfo: {
        type,
        times: currentAttempts + 1,
      },
    };

    const delay = backoffDelay(currentAttempts, 1000);

    await queueEventHook(newPayload, delay);
  }
};

/**
 * It could return a permanent "onFail" callback
 *   The callback means it errored
 */
type EventHookHandler = (
  payload: EventHookJobPayload
) => Promise<void | (() => Promise<void>)>;

/**
 * The only real difference between types at this point is the restriction
 *   on event types when querying for webhooks set up
 */
const webhookHandlerFactory =
  (webhookType: WebhookType) => async (payload: EventHookJobPayload) => {
    const {
      organizationId,
      destinationOpts,
      payload: webhookPayload,
      customTimeout,
    } = payload;
    const { eventType } = payload.payload;

    // Check by event name and org id whether or not webhooks enabled for this org/event, and enabled state
    const webhook = destinationOpts
      ? null
      : await Webhook.findOne({
          where: {
            organizationId,
            state: WebhookState.Active,
            webhookType,
            eventType: {
              [Op.or]: [eventType, EventHookType.All],
            },
          },
          include: [Organization],
        });

    const webhookUrl = destinationOpts?.webhookUrl || webhook?.webhookUrl;
    const secretKey = destinationOpts?.secretKey || webhook?.secretKey;

    if (!webhookUrl) return;

    /* Prevent double sends on tests, which do not always have explicit types */
    if (destinationOpts && destinationOpts.webhookType !== webhookType) return;

    try {
      logger.debug(`[webhook] sending ${webhookType} ping to ${webhookUrl}`);

      const res = await fetchTimeout(
        webhookUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Secret-Key': secretKey,
          },
          body: JSON.stringify(webhookPayload),
        },
        customTimeout ?? INTEGRATION_FETCH_TIMEOUT
      );

      if (!res.ok)
        throw new Error(
          `${res.status} ${res.statusText} - ${
            (await res.json()).message ?? ''
          }`
        );

      logger.debug(`[webhookHandler] Sent request, status ${res.status}`);
    } catch (e: any) {
      /* Rethrow for test requests */
      if (destinationOpts) throw e;

      return async () => {
        if (!destinationOpts && webhook) {
          await webhook.update({
            lastError: e.message || 'Error',
            state: WebhookState.Inactive,
          });

          await invalidateHookListenersCache(organizationId);
        }
      };
    }
  };

export const handleWebhook: EventHookHandler = webhookHandlerFactory(
  WebhookType.standard
);

export const queueEventHook = async (
  jobPayload: EventHookJobPayload,
  delayInMs?: number
) => {
  await queueJob(
    {
      jobType: JobType.HandleEventHook,
      ...jobPayload,
    },
    { delayInMs }
  );
};
