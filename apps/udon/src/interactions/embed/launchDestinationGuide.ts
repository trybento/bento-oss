import {
  GuideTypeEnum,
  Nullable,
  SelectedModelAttrsPick,
} from 'bento-common/types';
import {
  isAnnouncementGuide,
  isTooltipGuide,
} from 'bento-common/utils/formFactor';

import { withTransaction } from 'src/data';
import { Guide } from 'src/data/models/Guide.model';
import { Template } from 'src/data/models/Template.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { setStepCompletion } from '../setStepCompletion';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { AuthenticatedEmbedRequest } from 'src/graphql/types';
import ArchivedAccountError from 'src/errors/ArchivedAccountError';
import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import { GuideBaseStepCta } from 'src/data/models/GuideBaseStepCta.model';
import createAndLaunchAccountGuide from '../branching/createAndLaunchAccountGuide';
import createAndLaunchUserGuide from '../branching/createAndLaunchUserGuide';
import detachPromise from 'src/utils/detachPromise';
import { TriggeredLaunchCta } from 'src/data/models/TriggeredLaunchCta.model';

export type LaunchDestinationArgs = {
  /** Which template is supposed to be launched */
  destinationKey: string;
  /** From which Step this action came from */
  stepEntityId: string;
  /** From which CTA this action came from */
  ctaEntityId: string;
  /** Whether to mark the step as complete */
  markComplete?: boolean;
};

const launchDestinationGuide = async (
  {
    destinationKey,
    stepEntityId,
    ctaEntityId,
    markComplete = false,
  }: LaunchDestinationArgs,
  { account, accountUser, organization }: AuthenticatedEmbedRequest['user']
): Promise<Guide> => {
  return await withTransaction(async () => {
    if (account.deletedAt) {
      throw new ArchivedAccountError(account.entityId);
    }

    const originStep = await Step.findOne({
      where: { entityId: stepEntityId },
      include: [
        {
          required: true,
          model: Guide,
          attributes: ['id'],
          include: [
            {
              model: Template,
              attributes: ['formFactor'],
              required: true,
            },
          ],
        },
      ],
    });

    if (!originStep) {
      throw new Error('Invalid Step');
    }

    const originTemplateFormFactor =
      originStep.guide.createdFromTemplate!.formFactor;

    const template = await Template.findOne({
      where: {
        organizationId: organization.id,
        entityId: destinationKey,
      },
      include: [
        {
          required: false,
          model: GuideBase.scope('active'),
          where: {
            accountId: account.id,
          },
        },
      ],
    });

    if (!template) {
      throw new Error('Invalid guide destination key');
    }

    const originCta = (await GuideBaseStepCta.findOne({
      attributes: ['id'],
      where: {
        entityId: ctaEntityId,
        guideBaseStepId: originStep.createdFromGuideStepBaseId,
      },
      include: [
        {
          required: true,
          attributes: [],
          model: StepPrototypeCta,
          where: {
            launchableTemplateId: template.id,
          },
        },
      ],
    })) as Nullable<SelectedModelAttrsPick<GuideBaseStepCta, 'id'>>;

    if (!originCta) {
      throw new Error('Invalid CTA');
    }

    const activeGuideBase = template.guideBases[0] || null;

    let guide: Guide | null;

    const args: Parameters<
      typeof createAndLaunchAccountGuide | typeof createAndLaunchUserGuide
    >[0] = {
      account,
      accountUser,
      activeGuideBase,
      template,
      isDestination: true,
    };

    if (template.type === GuideTypeEnum.account) {
      guide = await createAndLaunchAccountGuide(args);
      if (!guide) {
        throw new Error('Account destination guide failed to launch');
      }
    } else {
      guide = await createAndLaunchUserGuide(args);
    }

    /**
     * Announcements and tooltips should automatically mark
     * the origin step/guide as completed to continue consistent with
     * the default CTA behavior of those form factors.
     */
    if (
      isAnnouncementGuide(originTemplateFormFactor) ||
      isTooltipGuide(originTemplateFormFactor) ||
      markComplete
    ) {
      await setStepCompletion({
        step: originStep,
        isComplete: true,
        completedByType: StepCompletedByType.AccountUser,
        accountUser,
      });
    }

    if (guide)
      detachPromise(() =>
        TriggeredLaunchCta.create({
          accountUserId: accountUser.id,
          createdGuideId: guide!.id,
          triggeredFromStepId: originStep.id,
          triggeredFromGuideId: originStep.guideId,
          triggeredFromGuideBaseCtaId: originCta.id,
          organizationId: organization.id,
        })
      );

    return guide;
  });
};

export default launchDestinationGuide;
