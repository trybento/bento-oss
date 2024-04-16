import { throttle } from 'lodash';

import { clsNamespace } from 'src/utils/cls';
import pubsub from 'src/graphql/pubsub';
import detachPromise from 'src/utils/detachPromise';
import {
  ORGANIZATION_CHANGED_TOPIC,
  GUIDE_CHANGED_TOPIC,
  ADMIN_EVENT_TOPIC,
  GUIDE_BASE_CHANGED_TOPIC,
  AVAILABLE_GUIDES_CHANGED_TOPIC,
  STEP_AUTO_COMPLETE_INTERACTIONS_CHANGED_TOPIC,
  ORGANIZATION_INLINE_EMBEDS_CHANGED_TOPIC,
  TEMPLATE_INLINE_EMBED_CHANGED_TOPIC,
  ACCOUNT_USER_INLINE_EMBEDS_CHANGED_TOPIC,
  ONBOARDING_INLINE_EMBEDS_CHANGED_TOPIC,
} from 'src/websockets/sockets.constants';
import { redisReadyListener } from 'src/graphql/pubsub.helpers';
import { logger } from 'src/utils/logger';

export type SubscriptionEvents =
  | 'organization'
  | 'guides'
  | 'guideBases'
  | 'availableGuides'
  | 'stepAutoCompleteInteractions'
  | 'inlineEmbeds'
  | 'onboardingInlineEmbeds'
  | 'templateInlineEmbed'
  | 'accountUserInlineEmbeds';

export type SubscriptionEventsMap = Map<
  SubscriptionEvents,
  Set<string | number>
>;

/** Prevent flushEvents from trying to emit anything anymore */
let flushLocked = false;

/** Set whether or not we allow publish event flushing */
export const setFlushLocked = (isLocked: boolean) => {
  flushLocked = isLocked;
};

/** Whether or not Redis is ready to process events */
let redisReady = false;

const queuedEvents: SubscriptionEventsMap = new Map();

const flushQueuedEvents = () => {
  if (!queuedEvents.size) return;
  if (!redisReady) {
    logger.warn(
      '[flushQueueEvents] Redis existed ready state, pausing queue empty'
    );
    return;
  }

  flushEvents(queuedEvents);
  queuedEvents.clear();
};

/* Protection against calling before redis is ready */
redisReadyListener.on('allReady', () => {
  if (redisReady) return;

  redisReady = true;

  logger.info(
    `[flushQueuedEvents] All redis ready, begin flushing ${queuedEvents.size} queued events`
  );
  flushQueuedEvents();
});

redisReadyListener.on('notReady', () => (redisReady = false));

export const emptyEventsBatch = (): SubscriptionEventsMap => new Map();

export function flushEvents(events: SubscriptionEventsMap) {
  if (flushLocked) return;

  /**
   * @todo clean up "duplicate" topics
   */
  for (const entityId of events.get('guides')?.values() || []) {
    detachPromise(
      () => pubsub.publish(GUIDE_CHANGED_TOPIC, { entityId }),
      'flushEvents pubsub guide changed'
    );
    detachPromise(
      () =>
        pubsub.publish(`${GUIDE_CHANGED_TOPIC}.${entityId}`, {
          entityId,
        }),
      'flushEvents embedPubSub guide changed'
    );
  }
  for (const entityId of events.get('guideBases')?.values() || []) {
    detachPromise(
      () => pubsub.publish(GUIDE_BASE_CHANGED_TOPIC, { entityId }),
      'flushEvents pubsub guide base changed'
    );
  }
  for (const accountUserExternalId of events.get('availableGuides')?.values() ||
    []) {
    detachPromise(
      () =>
        pubsub.publish(
          `${AVAILABLE_GUIDES_CHANGED_TOPIC}.${accountUserExternalId}`,
          { accountUserExternalId }
        ),
      'flushEvents pubsub available guides changed'
    );
  }
  for (const accountUserExternalId of events
    .get('stepAutoCompleteInteractions')
    ?.values() || []) {
    detachPromise(
      () =>
        pubsub.publish(
          `${STEP_AUTO_COMPLETE_INTERACTIONS_CHANGED_TOPIC}.${accountUserExternalId}`,
          { accountUserExternalId }
        ),
      'flushEvents pubsub step auto complete interactions changed'
    );
  }
  for (const organizationId of events.get('inlineEmbeds')?.values() || []) {
    detachPromise(
      () =>
        pubsub.publish(ORGANIZATION_INLINE_EMBEDS_CHANGED_TOPIC, {
          organizationId,
        }),
      'flushEvents pubsub inline embeds changed'
    );
    detachPromise(
      () =>
        pubsub.publish(
          `${ORGANIZATION_INLINE_EMBEDS_CHANGED_TOPIC}.${organizationId}`,
          { organizationId }
        ),
      'flushEvents embed pubsub inline embeds changed'
    );
  }
  for (const organizationId of events.get('onboardingInlineEmbeds')?.values() ||
    []) {
    detachPromise(
      () =>
        pubsub.publish(ONBOARDING_INLINE_EMBEDS_CHANGED_TOPIC, {
          organizationId,
        }),
      'flushEvents pubsub onboarding inline embeds changed'
    );
  }
  for (const organizationId of events.get('organization')?.values() || []) {
    detachPromise(
      () =>
        pubsub.publish(ORGANIZATION_CHANGED_TOPIC, {
          organizationId,
        }),
      'flushEvents pubsub organization changed'
    );
  }
  for (const templateEntityId of events.get('templateInlineEmbed')?.values() ||
    []) {
    detachPromise(
      () =>
        pubsub.publish(TEMPLATE_INLINE_EMBED_CHANGED_TOPIC, {
          templateEntityId,
        }),
      'flushEvents pubsub template inline embed changed'
    );
  }
  for (const accountUserExternalId of events
    .get('accountUserInlineEmbeds')
    ?.values() || []) {
    detachPromise(
      () =>
        pubsub.publish(
          `${ACCOUNT_USER_INLINE_EMBEDS_CHANGED_TOPIC}.${accountUserExternalId}`,
          { accountUserExternalId }
        ),
      'flushEvents embed pubsub account user inline embeds changed'
    );
  }
}

const callFlush = throttle(() => flushQueuedEvents(), 100, {
  trailing: true,
});

/** Flush the events, or queue them if Redis isn't ready */
export const flushOrQueueEvents = (
  /** The events to flush */
  events: SubscriptionEventsMap
) => {
  for (const [type, identifiers] of events.entries()) {
    queuedEvents.set(
      type,
      new Set([...(queuedEvents.get(type) || []), ...identifiers])
    );
  }

  if (!redisReady) return;

  callFlush();
};

const eventHandler =
  <K = string>(type: SubscriptionEvents) =>
  (identifier: K) => {
    if (flushLocked) return;

    const batch =
      (clsNamespace.get('events') as undefined | SubscriptionEventsMap) ||
      emptyEventsBatch();
    const transaction = clsNamespace.get('transaction');

    batch.set(type, new Set([...(batch.get(type) || []), identifier as any]));
    if (!transaction) {
      flushOrQueueEvents(batch);
    }
  };

export const organizationChanged = eventHandler<number>('organization');
export const guideChanged = eventHandler('guides');
export const guideBaseChanged = eventHandler('guideBases');
export const availableGuidesChanged = eventHandler('availableGuides');
export const stepAutoCompleteInteractionsChanged = eventHandler(
  'stepAutoCompleteInteractions'
);
export const inlineEmbedsChanged = eventHandler<number>('inlineEmbeds');
export const onboardingInlineEmbedsChanged = eventHandler<number>(
  'onboardingInlineEmbeds'
);
export const templateInlineEmbedChanged = eventHandler<string>(
  'templateInlineEmbed'
);
export const inlineEmbedsForAccountUserChanged = eventHandler<string>(
  'accountUserInlineEmbeds'
);

/* No need to batch one-off events that should only go to select clients */
export const adminEvent = (
  organizationEntityId: string,
  { type, data }: { type: string; data: string }
) => {
  detachPromise(
    () =>
      pubsub.publish(ADMIN_EVENT_TOPIC, { organizationEntityId, type, data }),
    'pubsub admin event'
  );
};
