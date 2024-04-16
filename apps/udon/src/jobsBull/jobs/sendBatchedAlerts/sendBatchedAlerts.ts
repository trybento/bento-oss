import {
  notifyEmailViaCourier,
  NOTIF_EVENT_NAMES,
} from '../../../utils/notifications/notifyWithCourier';
import {
  BatchedNotification,
  BatchedNotificationType,
} from 'src/data/models/BatchedNotifications.model';
import { GroupedDict } from './types';
import getBrokenVideoInformation from './getBrokenVideoInformation';
import { dedupeArrayByKey } from 'src/utils/helpers';
import { enableVideoAlerts } from 'src/utils/internalFeatures/internalFeatures';
import { JobHandler } from 'src/jobsBull/handler';
import { SendBatchedAlertsJob } from 'src/jobsBull/job';

/** Group alerts under the email as key */
const groupByRecipient = <T>(
  allErrors: BatchedNotification<any>[],
  initDict?: GroupedDict<T>
) => {
  const dict: GroupedDict<T> = initDict || {};
  /* Group errors by recipient email so we send each address one alert */
  allErrors.forEach((queuedError) => {
    const { recipientEmail, recipientEntityId, bodyData, organizationId } =
      queuedError;
    if (!recipientEmail || !recipientEntityId || !bodyData) return;

    if (!dict[recipientEmail]) dict[recipientEmail] = [];

    dict[recipientEmail].push({
      bodyData,
      recipientEmail,
      recipientEntityId,
      organizationId,
    });
  });

  return dict;
};

/** Included the IDs in case, but easier to load names as they come in */
export type BrokenVideoPayload = {
  organizationId: number;
  videoId: string;
  videoUrl: string;
};

export async function checkBrokenVideoAlerts() {
  const useVideoAlerts = enableVideoAlerts.enabled();

  if (!useVideoAlerts) return;

  const notifications = await BatchedNotification.findAll<
    BatchedNotification<BrokenVideoPayload>
  >({
    where: {
      notificationType: BatchedNotificationType.VideoAlert,
    },
  });

  if (notifications.length < 1) return;

  const dict = await getBrokenVideoInformation({
    notifications,
  });

  /* Compose promises for sending notifs */
  const emailJobs = Object.keys(dict).map((email) => async () => {
    const notif = dict[email];
    const alerts = dedupeArrayByKey(notif.alerts, 'linkUrl');

    if (alerts.length === 0) return;

    await notifyEmailViaCourier({
      eventId: '4V55M9SBQ34QWPNEVRKH4W0577GJ',
      eventName: NOTIF_EVENT_NAMES.VideoAlert,
      email: notif.recipient.recipientEmail,
      recipientId: notif.recipient.recipientEntityId,
      data: {
        numAlerts: alerts.length,
        alerts,
      },
      organizationId: notif.recipient.organizationId,
    });
  });

  /* Send it all out */
  for (let i = 0; i < emailJobs.length; i++) {
    await emailJobs[i]();
  }

  /* Remove queued alerts */
  await BatchedNotification.destroy({
    where: {
      entityId: notifications.map((er) => er.entityId),
    },
  });
}

export type SegmentErrorPayload = {
  eventName: string;
  missingKeys: string;
};

const handler: JobHandler<SendBatchedAlertsJob> = async () => {
  await checkBrokenVideoAlerts();
};

export default handler;
