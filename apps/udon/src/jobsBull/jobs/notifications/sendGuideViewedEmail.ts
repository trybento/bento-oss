import promises from 'src/utils/promises';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { Organization } from 'src/data/models/Organization.model';
import {
  getOrgSettings,
  OrganizationSettings,
} from 'src/data/models/OrganizationSettings.model';
import { getEmailsArray } from 'src/utils/helpers';
import {
  notifyEmailViaCourier,
  NOTIF_EVENT_NAMES,
} from '../../../utils/notifications/notifyWithCourier';
import { notArchivedCondition } from 'src/data';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { SendGuideViewedEmailJob } from 'src/jobsBull/job';
import { JobHandler } from 'src/jobsBull/handler';

const BASE_CLIENT_URL = process.env.BASE_CLIENT_URL!;
const COURIER_TEMPLATE = 'EH03VH7GHV4J35QZXEKS3JRNFJ5T';

const handler: JobHandler<SendGuideViewedEmailJob> = async (job, logger) => {
  const payload = job.data;
  const { guideEntityId, accountUserEntityId } = payload;
  const accountUser = await AccountUser.findOne({
    where: {
      entityId: accountUserEntityId,
    },
    include: [
      { model: Account, where: notArchivedCondition },
      { model: Organization, include: [OrganizationSettings] },
    ],
  });
  if (!accountUser) {
    logger.warn(`Account not found: ${accountUserEntityId}`);
    return;
  }
  const guide = await Guide.findOne({
    where: {
      entityId: guideEntityId,
    },
  });
  if (!guide) {
    logger.warn(`Guide not found: ${guideEntityId}`);
    return;
  }

  const guideBase = await GuideBase.findOne({
    where: {
      id: guide.createdFromGuideBaseId,
    },
    include: [{ model: Template, attributes: ['id', 'notificationSettings'] }],
  });

  if (!guideBase) {
    logger.warn(`Guide base not found: ${guide.createdFromGuideBaseId}`);
    return;
  }

  if (guideBase.createdFromTemplate?.notificationSettings?.disable) return;

  const account = accountUser.account;
  const organization = accountUser.organization;
  const orgSettings = await getOrgSettings(organization);

  if (!orgSettings.sendEmailNotifications) {
    return;
  }
  const contact = await account.$get('primaryOrganizationUser');
  const emails = contact?.email || orgSettings.fallbackCommentsEmail;
  if (!emails) {
    logger.warn(
      `No fallback email address for ${organization.name} ${organization.entityId}`
    );
    return;
  }
  const emailArray = getEmailsArray(emails);

  const data = {
    account: account.get({ plain: true }),
    accountUser: accountUser.get({ plain: true }),
    organization: organization.get({ plain: true }),
    guide: guide.get({ plain: true }),
    primaryContact: contact?.get({ plain: true }),
    guideUrl: `${BASE_CLIENT_URL}/guide-bases/${guideBase.entityId}`,
  };

  await promises.map(
    emailArray,
    async (email) =>
      await notifyEmailViaCourier({
        eventId: COURIER_TEMPLATE,
        eventName: NOTIF_EVENT_NAMES.GuideViewed,
        email,
        recipientId: account.entityId,
        data,
        organizationId: organization.id,
      })
  );
};

export default handler;
