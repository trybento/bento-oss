import promises from 'src/utils/promises';

import { notArchivedCondition } from 'src/data';
import {
  BatchedNotification,
  BatchedNotificationType,
} from 'src/data/models/BatchedNotifications.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { Organization } from 'src/data/models/Organization.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { Step } from 'src/data/models/Step.model';
import { BrokenVideoPayload } from 'src/jobsBull/jobs/sendBatchedAlerts/sendBatchedAlerts';
import { getRecipients } from 'src/jobsBull/workerBull.helpers';
import { logger } from 'src/utils/logger';

type Args = {
  videoUrl: string;
  videoId: string;
  stepEntityId: string;
};

/** Queue up a notification for alerting a CSM about broken videos */
export async function recordBrokenVideo({
  videoUrl,
  videoId,
  stepEntityId,
}: Args) {
  const step = await Step.findOne({
    where: { entityId: stepEntityId },
    include: [
      { model: Organization, include: [OrganizationSettings] },
      GuideStepBase,
    ],
  });

  if (!step || !videoId) {
    logger.info(
      `[recordBrokenVideo] No step ${stepEntityId} for sent ${videoUrl}`
    );
    return;
  }

  const { organization, createdFromGuideStepBase: guideStepBase } = step;

  if (!organization || !guideStepBase) {
    logger.info(
      `[recordBrokenVideo] No org or no guide step base for ${step.entityId}`
    );
    return;
  }

  const guideBase = await guideStepBase?.$get('guideBase');
  const account = await guideBase?.$get('account', {
    where: notArchivedCondition,
  });
  const contact = (await account?.$get('primaryOrganizationUser')) || null;

  const { organizationSettings } = organization;
  const recipients = await getRecipients({
    contact,
    organization,
    organizationSettings,
  });

  logger.info(`[recordBrokenVideo] Recording video Id ${videoId}`);

  const bodyData: BrokenVideoPayload = {
    videoId,
    videoUrl,
    organizationId: organization.id,
  };

  await promises.map(
    recipients,
    async (recipient) =>
      await BatchedNotification.findOrCreate({
        where: {
          notificationType: BatchedNotificationType.VideoAlert,
          recipientEmail: recipient.email,
          recipientEntityId: recipient.entityId,
          organizationId: organization.id,
          'bodyData.videoId': videoId,
        },
        defaults: {
          bodyData,
        },
      })
  );
}
