import promises from 'src/utils/promises';
import { BatchedNotification } from 'src/data/models/BatchedNotifications.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import {
  Step,
  StepCompletedByType,
  StepModelScope,
  StepWithPrototypeBranchingInfo,
} from 'src/data/models/Step.model';
import { slice } from 'src/utils/object';
import { getRecipients } from 'src/jobsBull/workerBull.helpers';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { shouldSendStepNotification } from './notifications.helpers';
import { enableInternalGuideEvents } from 'src/utils/features';
import { Guide } from 'src/data/models/Guide.model';
import { QueueCompletedNotificationPayload, StepBatchData } from './types';
import { JobHandler } from 'src/jobsBull/handler';
import {
  HandleStepCompletedNotificationsJob,
  JobType,
  SendBatchedStepNotificationJob,
} from 'src/jobsBull/job';
import { Logger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';
import { SelectedModelAttrs } from 'src/../../common/types';

const BASE_CLIENT_URL = process.env.BASE_CLIENT_URL!;

/** How long to wait to batch notifications */
const BATCHING_TIME = 1000 * 60 * 5;
/** Punt and send the queue if it exceeds this count */
const MAX_BATCH_QUEUE = 100;
/** Timeout to block notifications for a step sending again */
const RENOTIFY_TIME = 60 * 1000 * 60 * 24;

export const handleStepCompletedNotifications = async (
  payload: QueueCompletedNotificationPayload,
  logger?: Logger
) => {
  const {
    stepEntityId,
    completedByType,
    completedByAccountUserId,
    completedByUserId,
    updatedByAttributes,
    updatedByChoice,
    inputsWithAnswers,
  } = payload;

  const step = (await Step.scope(
    StepModelScope.withPrototypeBranchingInfo
  ).findOne({
    where: { entityId: stepEntityId },
    include: [
      {
        required: true,
        model: Guide,
        attributes: ['id'],
        include: [
          {
            required: true,
            model: GuideBase,
            attributes: ['entityId'],
            include: [
              {
                required: true,
                model: Template,
                attributes: ['id', 'name', 'notificationSettings'],
              },
            ],
          },
        ],
      },
    ],
  })) as StepWithPrototypeBranchingInfo<
    Step & {
      guide: SelectedModelAttrs<Guide, 'id'> & {
        createdFromGuideBase: SelectedModelAttrs<GuideBase, 'entityId'> & {
          createdFromTemplate: SelectedModelAttrs<
            Template,
            'id' | 'name' | 'notificationSettings'
          >;
        };
      };
    }
  >;

  if (!step) {
    logger?.warn(`Step not found: ${stepEntityId}`);
    return;
  }

  const guide = step.guide!;
  const guideBase = guide.createdFromGuideBase!;
  const template = guideBase.createdFromTemplate!;
  const now = Date.now();

  if (step.notifiedAt && now - step.notifiedAt.getTime() < RENOTIFY_TIME) {
    return;
  }

  const organization = await Organization.findOne({
    where: { id: step.organizationId },
    include: [OrganizationSettings],
  });

  if (!organization) return;

  const emailNotificationEnabled =
    organization.organizationSettings.sendEmailNotifications;

  if (!emailNotificationEnabled) {
    return;
  }

  const accountUser =
    completedByType !== StepCompletedByType.User && completedByAccountUserId
      ? await AccountUser.findOne({
          where: {
            id: completedByAccountUserId,
            organizationId: organization.id,
          },
        })
      : null;
  const orgUser =
    completedByType == StepCompletedByType.User && completedByUserId
      ? await User.findOne({ where: { id: completedByUserId } })
      : null;

  const shouldSend = shouldSendStepNotification({
    step,
    notificationSettings: template.notificationSettings || {},
  });

  if (!shouldSend) return;

  const account = await accountUser?.$get('account', {
    scope: 'notArchived',
    include: [
      {
        model: User,
      },
    ],
    attributes: ['entityId', 'primaryOrganizationUserId', 'name'],
  });

  const contact = account?.primaryOrganizationUser || null;

  const { organizationSettings } = organization;
  const recipients = await getRecipients({
    contact: account?.primaryOrganizationUser || null,
    organization,
    organizationSettings,
  });

  const bodyData = {
    step: slice(step.createdFromStepPrototype, ['name', 'branchingQuestion']),
    guide: slice(template, ['name']),
    account: {
      name: account?.name || '-',
      customerUrl: account
        ? `${BASE_CLIENT_URL}/customers/${account?.entityId}`
        : undefined,
    },
    accountUser: !!accountUser ? slice(accountUser, ['fullName']) : undefined,
    orgUser: !!orgUser ? slice(orgUser, ['fullName']) : undefined,
    primaryContact: !!contact ? slice(contact, ['fullName']) : undefined,
    guideUrl: `${BASE_CLIENT_URL}/guide-bases/${guideBase.entityId}`,
    updatedByAttributes,
    updatedByChoice,
    inputsWithAnswers,
  } as StepBatchData;

  const useInternalEvents = await enableInternalGuideEvents.enabled(
    organization.id
  );

  /** Only notify if it's triggered by an account user, and not an internal one */
  const nonInternalAccountUser = accountUser && !accountUser.internal;
  const shouldNotifyByUser = nonInternalAccountUser || useInternalEvents;

  await promises.map(recipients, async (recipient) => {
    /* Handle email notification if enabled */
    if (emailNotificationEnabled && shouldNotifyByUser) {
      const jobPayload: SendBatchedStepNotificationJob = {
        jobType: JobType.SendBatchedStepNotification,
        recipientEmail: recipient.email,
        recipientEntityId: recipient.entityId,
      };

      const queuedSteps = (await BatchedNotification.findAll({
        where: {
          recipientEmail: recipient.email,
          recipientEntityId: recipient.entityId,
          notificationType: 'steps',
        },
      })) as BatchedNotification<StepBatchData>[];

      /** Try to find potential duplicates by following criteria */
      const sameNotification = queuedSteps.find(
        (n) =>
          n.bodyData?.guide.name === bodyData.guide.name &&
          n.bodyData.step.name === bodyData.step.name &&
          n.bodyData.account.name === bodyData.account.name
      );

      if (!sameNotification) {
        await BatchedNotification.create({
          notificationType: 'steps',
          recipientEmail: recipient.email,
          recipientEntityId: recipient.entityId,
          organizationId: organization.id,
          bodyData,
        });
      } else {
        /* Update incase attributes update, or other small info tweak */
        await sameNotification.update({
          bodyData,
        });
      }

      /** +1 for the newly created one */
      const exceedsLimit = queuedSteps.length + 1 > MAX_BATCH_QUEUE;

      await queueJob(jobPayload, {
        delayInMs: exceedsLimit ? undefined : BATCHING_TIME,
      });
    }
  });

  void logStepNotification(step);
};

const handler: JobHandler<HandleStepCompletedNotificationsJob> = async (
  job,
  logger
) => {
  const payload = job.data;
  await handleStepCompletedNotifications(payload, logger);
};

export default handler;

/** Log when we last notified so we can reference it later */
const logStepNotification = async (step: Step) => {
  await step.update({
    notifiedAt: new Date(),
  });
};
