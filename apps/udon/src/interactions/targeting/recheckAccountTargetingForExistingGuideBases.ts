import { Op } from 'sequelize';

import { SelectedModelAttrs } from 'bento-common/types';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { Account } from 'src/data/models/Account.model';
import { doesAccountMatchAutoLaunchRules } from './checkAndAutoLaunchGuideBaseFromTemplates';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { logger } from 'src/utils/logger';
import { LaunchReport } from 'src/interactions/reporting/LaunchReport';
import { enableLaunchReportsIdentify } from 'src/utils/internalFeatures/internalFeatures';
import { sequelizeBulkUpsert } from 'src/data/sequelizeUtils';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';
import { formatTargeting, getAudiencesForOrg } from './targeting.helpers';

type FocusedGuideBase = SelectedModelAttrs<
  GuideBase,
  | 'id'
  | 'organizationId'
  | 'accountId'
  | 'state'
  | 'createdFromTemplateId'
  | 'obsoletedAt'
> & {
  createdFromTemplate: SelectedModelAttrs<
    Template,
    'id' | 'templateAutoLaunchRules'
  > & {
    templateAudiences: SelectedModelAttrs<
      TemplateAudience,
      'ruleType' | 'audienceEntityId' | 'groupIndex'
    >[];
  };
};

/**
 * Re-check and obsolete guide bases that no longer match the account's attributes
 *
 * @returns Promise the number of affected rows
 */
export async function recheckAccountTargetingForExistingGuideBases({
  account,
  excludeGuideIds = [],
  launchReport,
}: {
  account: Account;
  excludeGuideIds?: number[];
  launchReport?: LaunchReport;
}): Promise<number> {
  const guideBases = (await GuideBase.findAll({
    // rechecking account attributes should only happen for auto launched guides
    where: {
      wasAutoLaunched: { [Op.is]: true },
      id: { [Op.not]: excludeGuideIds },
    },
    attributes: [
      'id',
      'organizationId',
      'accountId',
      'state',
      'createdFromTemplateId',
      'obsoletedAt',
    ],
    include: [
      {
        model: Account.scope('notArchived'),
        where: { id: account.id },
        required: true,
        attributes: [],
      },
      {
        model: Template,
        required: true,
        attributes: ['id'],
        include: [
          { model: TemplateAutoLaunchRule },
          {
            model: TemplateAudience,
            attributes: ['ruleType', 'audienceEntityId', 'groupIndex'],
          },
        ],
      },
    ],
  })) as FocusedGuideBase[];

  if (guideBases.length === 0) {
    return 0;
  }

  const useLaunchReport = await enableLaunchReportsIdentify.enabled();

  const newLaunchReport = useLaunchReport && !launchReport;

  launchReport = newLaunchReport
    ? new LaunchReport('account', account.id, account.organizationId)
    : launchReport;

  const audiences = await getAudiencesForOrg(account.organizationId);

  const guideBasesUpdateData = guideBases.flatMap((guideBase) => {
    const formatted = formatTargeting({
      autoLaunchRules: guideBase.createdFromTemplate!.templateAutoLaunchRules,
      templateAudiences: guideBase.createdFromTemplate!.templateAudiences,
    });

    const rules = formatted.audiences ?? formatted.account;

    const [matches] = doesAccountMatchAutoLaunchRules({
      account,
      rules,
      extraAttributes: {
        audiences,
      },
      onDoneChecking: (results) => {
        launchReport?.addMatchLog(
          'template',
          guideBase.createdFromTemplateId!,
          results
        );
      },
    });

    const wasObsolete = guideBase.obsoletedAt;

    if ((matches && wasObsolete) || (!matches && !wasObsolete)) {
      logger.debug(
        `recheckAccountTargetingForExistingTemplates: ${account.id} ${
          guideBases.length
        } ${rules.groups?.length ?? 0} ${account.id} ${
          matches ? 'match, reactivating' : 'fail, obsoleting'
        }`
      );

      return [
        {
          ...guideBase.dataValues,
          obsoletedAt: matches ? null : new Date(),
        },
      ];
    }

    return [];
  });

  if (guideBasesUpdateData.length) {
    const affected = await sequelizeBulkUpsert(
      GuideBase,
      guideBasesUpdateData,
      {
        onError: (e) => {
          throw e; // rethrow
        },
        upsertOpts: {
          conflictFields: ['accountId', 'createdFromTemplateId'],
          returning: true,
        },
      }
    );

    return affected.length;
  }

  if (newLaunchReport) launchReport?.write();

  return 0;
}
