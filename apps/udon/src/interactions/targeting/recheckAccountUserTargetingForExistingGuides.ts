import { Op } from 'sequelize';
import {
  SelectedModelAttrs,
  SelectedModelAttrsPick,
  TargetingType,
} from 'bento-common/types';

import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { logger } from 'src/utils/logger';
import { LaunchReport } from 'src/interactions/reporting/LaunchReport';
import { enableLaunchReportsIdentify } from 'src/utils/internalFeatures/internalFeatures';
import { checkAttributeRulesMatch } from 'src/interactions/targeting/checkAttributeRulesMatch';
import {
  excludeExtraAttributeTargeting,
  formatTargeting,
  getTargetingExtraAttributes,
} from 'src/interactions/targeting/targeting.helpers';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';
import { TriggeredLaunchCta } from 'src/data/models/TriggeredLaunchCta.model';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';

type FocusedGuide = SelectedModelAttrsPick<Guide, 'id' | 'organizationId'> & {
  guideParticipants: Array<
    SelectedModelAttrsPick<GuideParticipant, 'id' | 'obsoletedAt'>
  >;
  createdFromTemplate: SelectedModelAttrsPick<Template, 'id' | 'name'> & {
    templateTargets: Array<TemplateTarget>;
    templateAudiences: Array<
      SelectedModelAttrs<
        TemplateAudience,
        'ruleType' | 'audienceEntityId' | 'groupIndex'
      >
    >;
  };
  createdFromGuideBase: SelectedModelAttrsPick<
    GuideBase,
    'id' | 'excludeFromUserTargeting'
  >;
  createdFromBranchingPath?: SelectedModelAttrsPick<
    TriggeredBranchingPath,
    'id'
  >;
  createdFromLaunchCta?: SelectedModelAttrsPick<TriggeredLaunchCta, 'id'>;
};

/**
 * Re-check and obsolete users from guides that no longer match the account
 * user's attributes
 *
 * @returns Guide instances that were checked
 */
export async function recheckAccountUserTargetingForExistingGuides(
  accountUser: AccountUser,
  launchReport?: LaunchReport,
  excludeGuideIds: number[] = []
): Promise<FocusedGuide[]> {
  const guides = (await Guide.findAll({
    where: { id: { [Op.not]: excludeGuideIds } },
    include: [
      {
        model: GuideParticipant,
        where: { accountUserId: accountUser.id },
        required: true,
        attributes: ['id', 'obsoletedAt'],
      },
      {
        model: Template,
        required: true,
        attributes: ['id', 'name'],
        include: [
          { model: TemplateTarget },
          {
            model: TemplateAudience,
            attributes: ['ruleType', 'audienceEntityId', 'groupIndex'],
          },
        ],
      },
      {
        model: GuideBase,
        required: true,
        attributes: ['id', 'excludeFromUserTargeting'],
      },
      {
        model: TriggeredBranchingPath,
        as: 'createdFromBranchingPath',
        required: false,
        attributes: ['id'],
      },
      {
        model: TriggeredLaunchCta,
        required: false,
        attributes: ['id'],
      },
    ],
    attributes: ['id', 'organizationId'],
  })) as FocusedGuide[];

  if (guides.length === 0) {
    return [];
  }

  const useLaunchReport = await enableLaunchReportsIdentify.enabled();

  const newLaunchReport = !launchReport && useLaunchReport;

  launchReport = newLaunchReport
    ? new LaunchReport(
        'accountUser',
        accountUser.id,
        accountUser.organizationId
      )
    : launchReport;

  const { templatesByAccountUser, branchingPathsByAccountUser, audiences } =
    await getTargetingExtraAttributes({
      accountUserIds: [accountUser.id],
      organizationId: accountUser.organizationId,
      excludes: excludeExtraAttributeTargeting(
        guides.flatMap((g) => g.createdFromTemplate.templateTargets || [])
      ),
    });

  const templates = templatesByAccountUser[accountUser.id];
  const branchingSelections = branchingPathsByAccountUser[accountUser.id];

  for (const guide of guides) {
    /**
     * If the linked guide base is excluded from user-level targeting, then
     * we want to avoid marking as obsolete. Therefore, just return null here
     * which is treated as a match below.
     */
    const groupTargeting = guide.createdFromGuideBase.excludeFromUserTargeting
      ? null
      : formatTargeting({
          templateTargets: guide.createdFromTemplate.templateTargets,
          templateAudiences: guide.createdFromTemplate.templateAudiences,
        });

    /**
     * Don't obsolete guides created from a manual action
     */
    if (guide.createdFromLaunchCta || guide.createdFromBranchingPath) continue;

    const targets = groupTargeting?.audiences ?? groupTargeting?.accountUser;

    const matches =
      targets && targets.type !== TargetingType.all && targets!.groups?.length
        ? targets.groups!.some((target) =>
            checkAttributeRulesMatch({
              input: accountUser,
              rules: target.rules,
              extraAttributes: {
                templates,
                audiences,
                branchingSelections,
              },
              testAll: !!launchReport,
              onDoneChecking: (result) => {
                launchReport?.addMatchLog(
                  'template',
                  guide.createdFromTemplate.id,
                  result,
                  guide.createdFromTemplate.name
                );
              },
            })
          )
        : true;

    const wasObsolete = !!guide.guideParticipants[0].obsoletedAt;

    if ((matches && wasObsolete) || (!matches && !wasObsolete)) {
      logger.debug(
        `recheckAccountUserTargetingForExistingGuides: ${accountUser.id} ${
          guides.length
        } ${accountUser.id} ${
          matches ? 'match, reactivating' : 'fail, obsoleting'
        }`
      );

      await guide.guideParticipants[0].update({
        obsoletedAt: matches ? null : new Date(),
      });
    }
  }

  if (newLaunchReport) launchReport?.write();

  return guides;
}
