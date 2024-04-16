import Bluebird from 'bluebird';
import { keyBy, some } from 'lodash';

import { RuleResult } from 'bento-common/types/diagnostics';
import { GuideTypeEnum, TargetingType } from 'bento-common/types';
import { GroupTargetingSegment } from 'bento-common/types/targeting';

import { createGuideBase } from 'src/interactions/createGuideBase';
import { launchGuideBase } from 'src/interactions/launching/launchGuideBase';
import { Account } from 'src/data/models/Account.model';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { logger } from 'src/utils/logger';
import { MatchedRule } from 'src/data/models/AutoLaunchLog.model';
import recordAutoLaunch from 'src/interactions/recordEvents/recordAutoLaunch';
import {
  ExtraAttributeDict,
  formatTargeting,
  getAudiencesForOrg,
  getBranchingResultsOfAccount,
} from './targeting.helpers';
import { enableBranchingSelectionTargeting } from 'src/utils/features';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { Template } from 'src/data/models/Template.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { checkAttributeRulesMatch } from 'src/interactions/targeting/checkAttributeRulesMatch';
import {
  AttributeRule,
  TargetAttributeRules,
} from 'src/interactions/targeting/types';
import getSplitTestTemplate from './getSplitTestTemplate';
import detachPromise from 'src/utils/detachPromise';
import { LaunchReport } from '../reporting/LaunchReport';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';

type Args = {
  templatesAndAccounts: {
    templateId: number;
    account: Account;
  }[];
  activateAt?: Date;
  organizationId: number;
};

type Options = {
  launchReport?: LaunchReport;
};

export function doesAccountMatchAutoLaunchRules({
  account,
  rules,
  onDoneChecking,
  extraAttributes = {},
  testAll,
}: {
  account: Account;
  rules: GroupTargetingSegment<AttributeRule>;
  onDoneChecking?: (results: RuleResult) => void;
  extraAttributes?: ExtraAttributeDict;
  /** Rules tester will not punt on failed rules, to gather info on all failures */
  testAll?: boolean;
}): [boolean, MatchedRule[]] {
  if (!rules) return [false, []];

  const autoLaunchToAllRule = rules.type === TargetingType.all;
  const matchedRules: MatchedRule[] = [];

  let areAnyAutoLaunchRulesSatisfied = false;
  if (autoLaunchToAllRule) {
    matchedRules.push({ ruleType: TargetingType.all });
    areAnyAutoLaunchRulesSatisfied = true;
    onDoneChecking?.('allTarget');
  } else {
    const attributesAutoLaunchRules = rules.groups;

    areAnyAutoLaunchRulesSatisfied = some(
      attributesAutoLaunchRules,
      (templateAutoLaunchRule) => {
        const matched = checkAttributeRulesMatch({
          rules: templateAutoLaunchRule.rules as TargetAttributeRules,
          input: account,
          extraAttributes,
          onDoneChecking: (results) => onDoneChecking?.(results),
          testAll,
        });

        const mRule = {
          ruleType: TargetingType.attributeRules,
          rules: templateAutoLaunchRule.rules,
        };

        if (matched) matchedRules.push(mRule);

        return matched;
      }
    );
  }

  return [areAnyAutoLaunchRulesSatisfied, matchedRules];
}

/** Create guide bases for accounts that match all rules. Returns a GuideBase only if one was created. */
export async function checkAndAutoLaunchGuideBaseFromTemplates(
  { templatesAndAccounts, activateAt, organizationId }: Args,
  { launchReport }: Options = {}
) {
  const { templateIds, accounts } = templatesAndAccounts.reduce(
    (data, launchDataItem) => {
      data.templateIds.push(launchDataItem.templateId);
      data.accounts.push(launchDataItem.account);
      return data;
    },
    { templateIds: [], accounts: [] } as {
      templateIds: number[];
      accounts: Account[];
    }
  );

  const templates = await Template.findAll({
    where: { id: templateIds },
    include: [
      TemplateAutoLaunchRule,
      { model: TemplateTarget, attributes: ['targetType', 'rules'] },
      TemplateAudience,
    ],
    attributes: ['id', 'name', 'entityId', 'type'],
  });

  const templatesById = keyBy(templates, 'id');

  let matchResults: RuleResult;

  const branchingSelections: string[][] = [];

  for (const account of accounts) {
    branchingSelections.push(
      (await enableBranchingSelectionTargeting.enabled(account.organizationId))
        ? await getBranchingResultsOfAccount({
            accountId: account.id,
          })
        : []
    );
  }

  const audiences = await getAudiencesForOrg(organizationId);

  const templateMatches = templateIds
    .map((templateId, i) => {
      const template: Template = templatesById[templateId];

      const groupTargeting = formatTargeting({
        autoLaunchRules: template.templateAutoLaunchRules,
        templateTargets: template.templateTargets,
        templateAudiences: template.templateAudiences,
      });

      // replace with groups
      return {
        template,
        account: accounts[i],
        matchResults: doesAccountMatchAutoLaunchRules({
          account: accounts[i],
          rules: groupTargeting.audiences ?? groupTargeting.account,
          testAll: !!launchReport,
          extraAttributes: {
            branchingSelections: branchingSelections[i],
            audiences,
          },
          onDoneChecking: (results) => {
            matchResults = results;
            if (typeof results !== 'string' && results.failedRules) {
              // Save report if failed, else wait for more info
              launchReport?.addMatchLog(
                'template',
                template.id,
                results,
                template.name
              );
            }
          },
        }),
      };
    })
    .filter(({ matchResults: [matches] }) => matches);

  return (
    await Bluebird.mapSeries(
      templateMatches,
      async ({ template, account, matchResults: [_, matchedRules] }) => {
        const isSplitTest = template.type === GuideTypeEnum.splitTest;
        let _template: Template | undefined = template;

        if (isSplitTest) {
          detachPromise(
            () =>
              recordAutoLaunch({
                organizationId: account.organizationId,
                accountId: account.id,
                templateId: template.id,
                matchedRules,
              }),
            'record split test autolaunch'
          );

          _template = await getSplitTestTemplate({
            splitTestTemplate: template,
          });

          /* Handles causes where we may split test to nothing */
          if (!_template) return undefined;
        }

        try {
          const createdGuideBase = await createGuideBase({
            account,
            templateEntityId: _template.entityId,
            wasAutoLaunched: true,
            createdFromSplitTestId: isSplitTest ? template.id : undefined,
          });

          await launchGuideBase({
            guideBase: createdGuideBase,
            activateAt,
          });

          launchReport?.addMatchLog(
            'template',
            _template.id,
            matchResults,
            _template.name
          );

          await recordAutoLaunch({
            organizationId: account.organizationId,
            accountId: account.id,
            templateId: _template.id,
            matchedRules,
            guideBaseId: createdGuideBase.id,
          });

          return createdGuideBase;
        } catch (e) {
          logger.error(e);
          const org = await account.$get('organization', {
            attributes: ['slug'],
          });
        }
        return undefined;
      }
    )
  ).filter(Boolean) as GuideBase[];
}
