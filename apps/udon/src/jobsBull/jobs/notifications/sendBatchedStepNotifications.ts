import promises from 'src/utils/promises';
import {
  notifyEmailViaCourier,
  NOTIF_EVENT_NAMES,
} from '../../../utils/notifications/notifyWithCourier';
import {
  NotificationBatchedFlatData,
  NotificationBatchedData_accountGuide,
  StepBatchData,
} from './types';
import { BatchedNotification } from 'src/data/models/BatchedNotifications.model';
import { getEmailsArray } from 'src/utils/helpers';
import { formatInputsWithAnswersForEmail } from 'src/interactions/inputFields/helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { SendBatchedStepNotificationJob } from 'src/jobsBull/job';

export const sendBatchedStepNotifications = async (
  job: SendBatchedStepNotificationJob
) => {
  const { recipientEmail, recipientEntityId } = job;

  const recipient = {
    email: recipientEmail,
    entityId: recipientEntityId,
  };

  const allNotifs = await BatchedNotification.findAll<
    BatchedNotification<StepBatchData>
  >({
    where: {
      recipientEmail,
      recipientEntityId,
      notificationType: 'steps',
    },
  });

  if (!allNotifs || allNotifs.length === 0) return;

  const data: NotificationBatchedFlatData = {
    primaryContactName: allNotifs[0].bodyData?.primaryContact?.fullName,
  };

  /** Prepare and format notification data for Courier */
  allNotifs.forEach((notif) => {
    const { bodyData } = notif;
    if (!bodyData) return;

    const {
      step: { name: stepName },
      guide: { name: guideName },
      guideUrl,
      account: { name: accountName, customerUrl },
      accountUser,
      updatedByAttributes,
      inputsWithAnswers,
      updatedByChoice,
      orgUser,
    } = bodyData;

    const dictKey = `${accountName} - ${guideName}`;

    if (!data[dictKey]) {
      data[dictKey] = {
        accountName,
        customerUrl,
        guideName,
        guideUrl,
        steps: [],
      };
    }

    data[dictKey].steps.push({
      completedBy: accountUser?.fullName,
      orgUserName: orgUser?.fullName,
      stepName,
      updatedByAttributes: updatedByAttributes
        ? Object.keys(updatedByAttributes).reduce(
            (_acc, key) => `${updatedByAttributes[key]}, for '${key}'`,
            ''
          )
        : undefined,
      inputsWithAnswers: formatInputsWithAnswersForEmail(inputsWithAnswers),
      updatedByChoice,
    });
  });

  const orgId = allNotifs[0].organizationId;

  const emailArray = getEmailsArray(recipient.email);

  await promises.map(emailArray, async (email) => {
    const msgId = await notifyEmailViaCourier({
      eventId: 'CMH5GM7TTM4882M50YGQGJG1703S',
      eventName: NOTIF_EVENT_NAMES.StepNotifs,
      email,
      recipientId: recipient.entityId,
      data: reformatDataForCourier(data),
      organizationId: orgId,
    });

    /** Only take the notif off queue if we confirm it is sent */
    if (msgId)
      await BatchedNotification.destroy({
        where: {
          recipientEmail: email,
          recipientEntityId,
        },
      });
  });
};

const handler: JobHandler<SendBatchedStepNotificationJob> = async (
  job,
  logger
) => {
  const payload = job.data;

  await sendBatchedStepNotifications(payload);
};

export default handler;

/** Because Courier likes lists, not dicts */
const reformatDataForCourier = (data: NotificationBatchedFlatData) => {
  const primaryContactName = data.primaryContactName;
  delete data.primaryContactName;

  return {
    primaryContactName,
    accountGuides: Object.keys(data).map((accountDataKey) => {
      const accountGuide: NotificationBatchedData_accountGuide =
        data[accountDataKey] || {};

      return {
        accountName: accountGuide.accountName,
        customerUrl: accountGuide.customerUrl,
        guideName: accountGuide.guideName,
        guideUrl: accountGuide.guideUrl,
        steps: accountGuide.steps,
      };
    }),
  };
};
