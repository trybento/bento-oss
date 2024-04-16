import promises from 'src/utils/promises';
import { some } from 'lodash';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { createPartition } from 'src/utils/helpers';
import { checkAttributeRulesMatch } from './checkAttributeRulesMatch';
import {
  getAudiencesForOrg,
  getTargetingExtraAttributes,
  getTargetingForTemplate,
} from './targeting.helpers';
import { TargetAttributeRules } from './types';
import {
  GroupTargeting,
  TargetingType,
} from 'src/../../common/types/targeting';

type Args = {
  organization: Organization;
  template?: Template;
  targets?: GroupTargeting;
};

export type TemplateAutoLaunchAudienceResult = {
  accounts: number;
  accountUsers: number;
};

/**
 * Preview the scope of a launch before launching
 * @returns Matching account users
 * @todo reduce logic by using GroupTargeting for both paths
 */
export default async function getTemplateAutoLaunchAudience({
  organization,
  template,
  targets,
}: Args): Promise<TemplateAutoLaunchAudienceResult> {
  if (!template && !targets) {
    throw new Error(
      'Must provide either a template or targets and auto launch rules'
    );
  }

  const accounts = await Account.scope('notArchived').findAll({
    where: {
      organizationId: organization.id,
    },
  });

  const matchedAccountIds: number[] = [];

  const audiences = await getAudiencesForOrg(organization.id);

  /**
   * Test for accounts
   */
  if (targets) {
    const accountTargeting = targets.audiences ?? targets.account;

    if (accountTargeting.type === TargetingType.all) {
      matchedAccountIds.push(...accounts.map((a) => a.id));
    } else {
      for (const account of accounts) {
        const areAnyAutoLaunchRulesSatisfied = accountTargeting.groups?.some(
          (group) =>
            checkAttributeRulesMatch({
              rules: group.rules as TargetAttributeRules,
              input: account,
              extraAttributes: {
                audiences,
              },
            })
        );

        await createPartition();

        if (areAnyAutoLaunchRulesSatisfied) {
          matchedAccountIds.push(account.id);
        }
      }
    }
  } else {
    const templateTargets = await getTargetingForTemplate(template!.id);

    const accountRules = templateTargets.audiences ?? templateTargets.account;

    const autoLaunchToAllAccounts =
      accountRules.type === TargetingType.all || !accountRules.groups?.length;

    if (autoLaunchToAllAccounts) {
      matchedAccountIds.push(...accounts.map((a) => a.id));
    } else {
      await promises.map(accounts, async (account) => {
        const areAnyAutoLaunchRulesSatisfied = some(
          accountRules.groups ?? [],
          (templateAutoLaunchRule) =>
            checkAttributeRulesMatch({
              rules: templateAutoLaunchRule.rules as TargetAttributeRules,
              input: account,
              extraAttributes: {
                audiences,
              },
            })
        );

        await createPartition();

        if (areAnyAutoLaunchRulesSatisfied) {
          matchedAccountIds.push(account.id);
        }
      });
    }
  }

  if (matchedAccountIds.length === 0) {
    return { accounts: 0, accountUsers: 0 };
  }

  /**
   * Test for account users
   */
  const matchedAccountUserIds: number[] = [];
  const accountUsers = await AccountUser.findAll({
    where: {
      organizationId: organization.id,
      accountId: matchedAccountIds,
    },
  });

  if (targets) {
    const accountUserTargeting = targets.audiences ?? targets.accountUser;

    if (accountUserTargeting.type === TargetingType.all) {
      return {
        accounts: matchedAccountIds.length,
        accountUsers: accountUsers.length,
      };
    } else {
      const { templatesByAccountUser, branchingPathsByAccountUser } =
        await getTargetingExtraAttributes({
          accountUserIds: accountUsers.map((au) => au.id),
          excludes: {
            audiences: true,
          },
        });

      await promises.map(accountUsers, async (accountUser) => {
        const templates = templatesByAccountUser[accountUser.id] || [];
        const branchingSelections =
          branchingPathsByAccountUser[accountUser.id] || [];

        const areAnyAutoLaunchRulesSatisfied =
          accountUserTargeting.groups?.some((group) =>
            checkAttributeRulesMatch({
              rules: group.rules as TargetAttributeRules,
              input: accountUser,
              extraAttributes: {
                templates,
                branchingSelections,
                audiences,
              },
            })
          );

        await createPartition();

        if (areAnyAutoLaunchRulesSatisfied) {
          matchedAccountUserIds.push(accountUser.id);
        }
      });
    }
  } else {
    const groupTargeting = await getTargetingForTemplate(template!.id);

    const autoLaunchToAllAccountUsers =
      groupTargeting.account.type === TargetingType.all;

    if (autoLaunchToAllAccountUsers) {
      return {
        accounts: matchedAccountIds.length,
        accountUsers: accountUsers.length,
      };
    } else {
      const { templatesByAccountUser, branchingPathsByAccountUser } =
        await getTargetingExtraAttributes({
          accountUserIds: accountUsers.map((au) => au.id),
          excludes: { audiences: true },
        });

      await promises.map(accountUsers, async (accountUser) => {
        const templates = templatesByAccountUser[accountUser.id] || [];
        const branchingSelections =
          branchingPathsByAccountUser[accountUser.id] || [];

        const areAnyAutoLaunchRulesSatisfied = some(
          groupTargeting.audiences?.groups ?? groupTargeting.accountUser.groups,
          (templateTargetRule) =>
            checkAttributeRulesMatch({
              rules: templateTargetRule.rules as TargetAttributeRules,
              input: accountUser,
              extraAttributes: {
                templates,
                branchingSelections,
                audiences,
              },
            })
        );

        await createPartition();

        if (areAnyAutoLaunchRulesSatisfied) {
          matchedAccountUserIds.push(accountUser.id);
        }
      });
    }
  }

  return {
    accounts: matchedAccountIds.length,
    accountUsers: matchedAccountUserIds.length,
  };
}
