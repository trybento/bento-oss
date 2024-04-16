import ReactDOMServer from 'react-dom/server';
import EndUserNudge from 'bento-common/email_templates/EndUserNudge';
import { moduleNameOrFallback } from 'bento-common/utils/naming';
import { Nullable, SelectedModelAttrsPick } from 'bento-common/types';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { Organization } from 'src/data/models/Organization.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { sendEmail } from '../../../utils/notifications/sendEmail';
import { NOTIFICATIONS_ADDRESS } from 'src/utils/constants';
import { logger } from 'src/utils/logger';
import { JobHandler } from 'src/jobsBull/handler';
import { SendEndUserNudgeWithTemplateJob } from 'src/jobsBull/job';
import { Step, StepModelScope } from 'src/data/models/Step.model';
import {
  GuideModule,
  GuideModuleModelScope,
  GuideModuleWithBase,
  GuideModuleWithModule,
} from 'src/data/models/GuideModule.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { Module } from 'src/data/models/Module.model';

/** For SendGrid opt-outs */
const UNSUB_GROUP = 20244;

const handler: JobHandler<SendEndUserNudgeWithTemplateJob> = async (
  job,
  logger
) => {
  const { organizationId, email, guideId, sample } = job.data;
  if (email.endsWith('@blueweave.com')) {
    logger.info('Skipping blueweave recipient for nudge');
    return;
  }
  const organization = await getNudgeOrg(organizationId);
  if (!organization) {
    logger.warn(
      `[nudges] No org or nudges turned off for org id ${organizationId}`
    );
    return;
  }

  /* For testing templates and tweaks */
  if (sample) return await sendSample(email, organization);

  /* Deduplicate by email id search */
  const accountUser = await AccountUser.findOne({
    where: { organizationId, email },
    order: ['id'],
  });

  if (!accountUser || !accountUser.email) {
    logger.error(
      `account user not found for ${JSON.stringify(job.data)} or has no email ${
        accountUser?.entityId
      }`
    );
    return;
  }

  const guide = (await Guide.findOne({
    where: {
      id: guideId,
      organizationId,
    },
    include: [
      {
        required: false,
        model: GuideModule.scope([
          GuideModuleModelScope.withBase,
          GuideModuleModelScope.withModule,
        ]),
        where: {
          completedAt: null,
        },
        attributes: ['id'],
      },
    ],
  })) as Nullable<
    Guide & {
      guideModules: Array<
        GuideModuleWithBase<
          SelectedModelAttrsPick<GuideModule, 'id'>,
          GuideModuleBase
        > &
          GuideModuleWithModule<
            SelectedModelAttrsPick<GuideModule, 'id'>,
            Module
          >
      >;
    }
  >;

  if (!guide) return;

  if (!guide.guideModules.length) {
    logger.error(`No incomplete modules for guide ${guide.entityId}`);
    return;
  }

  const firstIncompleteModule = guide.guideModules[0];

  const steps = (await firstIncompleteModule.$get('steps', {
    scope: StepModelScope.withPrototype,
  })) as (Step & {
    createdFromStepPrototype: SelectedModelAttrsPick<StepPrototype, 'name'>;
  })[];

  const subject = `Can I help you complete your ${organization.name} onboarding?`;
  const text = `Congrats on getting started with ${organization.name}! We've set up
        in-product guides to show you the fastest path to success. Log in to ${organization.name} to keep going.`;
  const html = ReactDOMServer.renderToString(
    EndUserNudge({
      organizationName: organization.name || '',
      defaultUserNotificationURL:
        organization.organizationSettings.defaultUserNotificationURL || '',
      moduleName: moduleNameOrFallback(
        firstIncompleteModule.createdFromGuideModuleBase.name ||
          firstIncompleteModule.createdFromModule.name
      ),
      steps: steps.map((s) => ({
        isComplete: s.isComplete,
        name: s.createdFromStepPrototype.name,
      })),
    })!
  );

  await sendEmail({
    to: accountUser.email,
    from: {
      name: `${organization.name} via Bento`,
      email: NOTIFICATIONS_ADDRESS,
    },
    subject,
    text,
    html,
    asm: {
      groupId: UNSUB_GROUP,
      groupsToDisplay: [UNSUB_GROUP],
    },
  });
};

export default handler;

/** Send a sample nudge that does not require associated guides and steps in a certain state */
const sendSample = async (email: string, organization: Organization) => {
  logger.debug(`[nudges] Sending sample to ${email}`);
  const text = 'This is a sample nudge.';
  const html = ReactDOMServer.renderToString(
    EndUserNudge({
      organizationName: organization.name || '',
      defaultUserNotificationURL:
        organization.organizationSettings.defaultUserNotificationURL || '',
      moduleName: 'Sample module',
      steps: [
        { name: 'Sample step', isComplete: true },
        { name: 'Another sample step', isComplete: false },
      ],
    })!
  );
  const subject = `Can I help you complete your ${organization.name} onboarding?`;

  try {
    await sendEmail({
      to: email,
      from: {
        name: `${organization.name} via Bento`,
        email: NOTIFICATIONS_ADDRESS,
      },
      subject,
      text,
      html,
      asm: {
        groupId: UNSUB_GROUP,
        groupsToDisplay: [UNSUB_GROUP],
      },
    });
  } catch (e) {
    logger.error(e);
  }
};

const getNudgeOrg = async (organizationId: number) => {
  const organization = await Organization.findByPk(organizationId, {
    include: [OrganizationSettings],
  });
  if (!organization) return;
  const { organizationSettings } = organization;
  if (!organizationSettings?.sendAccountUserNudges) return;

  return organization;
};
