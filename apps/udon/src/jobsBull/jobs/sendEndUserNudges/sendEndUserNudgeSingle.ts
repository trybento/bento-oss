import { withTransaction } from 'src/data';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { slice } from 'src/utils/object';
import {
  notifyEmailViaCourier,
  NOTIF_EVENT_NAMES,
} from '../../../utils/notifications/notifyWithCourier';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { Organization } from 'src/data/models/Organization.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { JobHandler } from 'src/jobsBull/handler';
import { SendEndUserNudgeSingleJob } from 'src/jobsBull/job';

/**
 * Send nudges with Courier
 */
const handler: JobHandler<SendEndUserNudgeSingleJob> = async (job, logger) => {
  await withTransaction(async () => {
    const payload = job.data;
    const { organizationId, email, guideId } = payload;
    const organization = await Organization.findByPk(organizationId, {
      include: [OrganizationSettings],
    });
    if (!organization) {
      logger.error(`Organization ${organizationId} not found`);
      return;
    }
    const { organizationSettings } = organization;
    if (!organizationSettings?.sendAccountUserNudges) {
      logger.error(
        `nudges not enabled for organization ${organization?.slug} (${organizationId})`
      );
      return;
    }
    if (email.endsWith('@blueweave.com')) {
      logger.info('Skipping blueweave recipient for nudge');
      return;
    }
    const accountUser = await AccountUser.findOne({
      where: { organizationId, email },
      // pick the first one by insertion order so we always use the same recipient ID with
      // courier, and unsubscribe links work correctly.
      order: ['id'],
    });
    if (!accountUser) {
      logger.error(`account user not found for ${payload}`);
      return;
    }
    const guide = await Guide.findOne({
      where: { organizationId, id: guideId },
    });
    if (guide === null) {
      return;
    }
    const modules = await guide.$get('guideModules');
    const incomplete = modules.filter((m) => m.completedAt === null);
    if (incomplete.length === 0) {
      logger.error(`No incomplete modules for guide ${guide.entityId}`);
      return;
    }
    const steps = await incomplete[0].$get('steps', {
      include: [StepPrototype],
    });

    const messagePayload = {
      organization: {
        name: organization.name,
        defaultUserNotificationURL:
          organizationSettings.defaultUserNotificationURL,
      },
      accountUser: slice(accountUser, ['fullName']),
      module: slice(incomplete[0], ['name']) as { name: string },
      steps: steps.map(
        (s) =>
          slice(s, ['isComplete', 'createdFromStepPrototype.name']) as {
            isComplete: boolean;
            createdFromStepPrototype: { name: string };
          }
      ),
    };

    if (
      !messagePayload.module.name ||
      (messagePayload.steps.length === 1 &&
        !messagePayload.steps[0].createdFromStepPrototype.name)
    )
      return;

    await notifyEmailViaCourier({
      eventId: '38EM1QDMCYMGZHHZEMF59W7JAK8C',
      eventName: NOTIF_EVENT_NAMES.UserNudges,
      email: accountUser.email!,
      recipientId: accountUser.entityId,
      data: messagePayload,
      organizationId: organization.id,
    });
  });
};

export default handler;
