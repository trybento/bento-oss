import {
  Payloads,
  Handler,
  StepViewingEventPayload,
  GuideViewingEventPayload,
  BasePayload,
} from './analytics.types';
import { Events, InternalTrackEvents } from 'bento-common/types';
import { logger } from 'src/utils/logger';
import { Event } from 'src/data/models/Analytics/Event.model';
import { AccountUserEvent } from 'src/data/models/Analytics/AccountUserEvent.model';
import { StepEvent } from 'src/data/models/Analytics/StepEvent.model';
import { GuideEvent } from 'src/data/models/Analytics/GuideEvent.model';
import { FeatureEvent } from 'src/data/models/Analytics/FeatureEvent.model';

/** Create an entry in analytics.events, repository for all things and fallback option */
const newEvent = async <K extends keyof Payloads>(
  eventName: K,
  payload: Payloads[K]
) => {
  const { accountUserEntityId, organizationEntityId, ...rest } = payload || {};

  return await Event.create({
    eventName: eventName,
    data: rest,
    accountUserEntityId,
    organizationEntityId,
    stepEntityId: (payload as StepViewingEventPayload).stepEntityId,
    guideEntityId: (payload as GuideViewingEventPayload).guideEntityId,
  });
};

/** Generate a newEvent caller that also triggers an additional action */
const withHook =
  <A extends Events | InternalTrackEvents>(
    hook?: Handler,
    allowedEvents?: A[]
  ) =>
  async (eventName: A, payload: Payloads[A]) => {
    if (allowedEvents && !allowedEvents.includes(eventName)) {
      logger.warn(
        `Analytic error: "${eventName}" is not an accepted event`,
        payload
      );
      return;
    }
    try {
      await newEvent(eventName, payload);
      if (hook) await hook(eventName, payload);
    } catch (e: any) {
      logger.error('Analytic error', e);
    }
  };

/** Create an analytics event */
export const analytics = {
  /** Generic new analytics event with no side effects */
  newEvent: withHook(),
  user: {
    newEvent: withHook((eventName, payload) => {
      console.debug('insert to userTable', eventName);
    }),
  },
  accountUser: {
    newEvent: withHook(
      async (eventName, payload) => {
        await AccountUserEvent.create({
          eventName,
          ...payload,
        });
      },
      [
        Events.accountUserAppActivity,
        InternalTrackEvents.quickLinkClicked,
        Events.helpCenterSearched,
      ]
    ),
  },
  notification: {
    newEvent: withHook((eventName, payload) => {
      console.debug('insert to notification table', eventName);
    }),
  },
  step: {
    newEvent: withHook(
      async (eventName, payload) => {
        await StepEvent.create({
          eventName,
          ...payload,
        });
      },
      [
        Events.stepCompleted,
        Events.ctaClicked,
        InternalTrackEvents.stepViewingStarted,
      ]
    ),
  },
  guide: {
    newEvent: withHook(
      async (eventName, payload) => {
        await GuideEvent.create({
          eventName,
          ...payload,
        });
      },
      [
        Events.savedForLater,
        Events.dismissed,
        InternalTrackEvents.guideViewingEnded,
        InternalTrackEvents.guideViewingStarted,
      ]
    ),
  },
  feature: {
    newEvent: withHook(
      async (eventName, payload) => {
        const {
          accountUserEntityId,
          organizationEntityId,
          userEntityId,
          ...rest
        } = payload as BasePayload;

        await FeatureEvent.create({
          eventName,
          accountUserEntityId,
          userEntityId,
          organizationEntityId,
          data: rest,
        });
      },
      [
        Events.gptEvent,
        Events.troubleshootEvent,
        Events.troubleshootVisited,
        InternalTrackEvents.audienceEvent,
        InternalTrackEvents.integrationSync,
      ]
    ),
  },
  test: {
    newEvent: withHook((eventName) => {
      const globalAny = global as any;
      if (globalAny.testMethod) {
        globalAny.testMethod(eventName);
      } else {
        logger.warn('[analytics] test analytics called with no test hook');
      }
    }),
  },
};
export { Events, InternalTrackEvents };
