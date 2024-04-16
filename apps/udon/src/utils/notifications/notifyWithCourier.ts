import { CourierClient } from '@trycourier/courier';

import { Event } from 'src/data/models/Analytics/Event.model';
import { Organization } from 'src/data/models/Organization.model';
import { IS_DEPLOYED, IS_TEST } from '../constants';
import { logger } from '../logger';

/** Note, place the Production: Testing key to test drafts */
const COURIER_API_KEY: string | undefined = process.env.COURIER_API_KEY;

/** Names for analytics.events table */
enum NOTIF_EVENTS {
  email = 'email_sent',
}

export enum NOTIF_EVENT_NAMES {
  StepNotifs = 'stepNotifications',
  UserNudges = 'userNudges',
  VideoAlert = 'videoAlert',
  GuideViewed = 'guideViewed',
  EmailVerification = 'emailVerification',
  InviteUser = 'inviteUser',
}

const courierClient = !!COURIER_API_KEY
  ? CourierClient({ authorizationToken: COURIER_API_KEY })
  : null;

/** Add to events table so we can check it later. For now we just need to know it happened */
async function logNotification({
  eventName,
  organizationId,
  accountUserEntityId,
  stepEntityId,
  guideEntityId,
  data,
}: {
  eventName: string;
  organizationId: number;
  stepEntityId?: string;
  accountUserEntityId?: string;
  guideEntityId?: string;
  data: any;
}) {
  const org = await Organization.findOne({
    where: { id: organizationId },
    attributes: ['entityId'],
  });

  await Event.create({
    organizationEntityId: org?.entityId,
    eventName,
    accountUserEntityId,
    stepEntityId,
    guideEntityId,
    data,
  });
}

/** Send an email via courier and return messageId if successful */
export async function notifyEmailViaCourier({
  eventId,
  eventName,
  email,
  recipientId,
  data,
  organizationId,
}: {
  eventId: string;
  eventName?: string;
  email: string;
  /** uuid for logging purposes */
  recipientId: string;
  data: any;
  organizationId: number;
}) {
  if (!courierClient) {
    if (!IS_TEST) {
      logger.warn('courier API key not configured');
      if (!IS_DEPLOYED) {
        console.log(
          `[notify] Attempted send ${eventId} to ${email}, recipientID ${recipientId}, with data:`,
          JSON.stringify(data, null, 2)
        );
      }
    }
    return;
  }

  const res = await courierClient.send({
    eventId,
    recipientId,
    profile: {
      email,
    },
    data,
  });

  void logNotification({
    organizationId,
    eventName: NOTIF_EVENTS.email,
    accountUserEntityId: recipientId,
    data: { eventId, eventName },
  });

  return res.messageId;
}
