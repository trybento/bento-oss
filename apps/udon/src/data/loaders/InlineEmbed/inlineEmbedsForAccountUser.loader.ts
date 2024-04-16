import DataLoader from 'dataloader';
import { unzip } from 'lodash';
import {
  GroupCondition,
  InlineEmbedState,
  TargetingType,
} from 'bento-common/types/index';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import {
  getBranchingResultsOfAccounts,
  getTargetingExtraAttributes,
} from 'src/interactions/targeting/targeting.helpers';
import { enableBranchingSelectionTargeting } from 'src/utils/features';
import { Loaders } from '..';
import { checkAttributeRulesMatch } from 'src/interactions/targeting/checkAttributeRulesMatch';
import { AttributeRule } from 'src/interactions/targeting/types';

const inlineEmbedsForAccountUserLoader = (loaders: Loaders) =>
  new DataLoader<AccountUser, OrganizationInlineEmbed[]>(
    async (accountUsers) => {
      // extract pertinent data from the account users
      const [accountIds, accountUserIds, organizationIds] = unzip(
        accountUsers.map((au) => [au.accountId, au.id, au.organizationId])
      );

      // get all active onboarding inline embeds for the given account users' orgs
      const onboardingInlineEmbeds = (
        (await loaders.onboardingInlineEmbedsLoader.loadMany(
          organizationIds
        )) as OrganizationInlineEmbed[][]
      ).map((embeds) =>
        Array.isArray(embeds)
          ? embeds.filter((embed) => embed.state === InlineEmbedState.active)
          : []
      );

      // if there are any onboarding inline embeds which have some specific
      // targeting set
      if (
        onboardingInlineEmbeds.some((embeds) =>
          embeds.some(
            (embed) =>
              embed.targeting.account.type === TargetingType.attributeRules ||
              embed.targeting.accountUser.type === TargetingType.attributeRules
          )
        )
      ) {
        // gather account data and collate according to order of account users
        let accounts = await Account.findAll({
          where: { id: [...new Set(accountIds)] },
        });
        accounts = accountUsers.map(
          (au) => accounts.find((a) => a.id === au.accountId) as Account
        );

        // gather branching and template data for target matching
        const accountBranchingSelections = await getBranchingResultsOfAccounts(
          accountIds
        );
        const {
          branchingPathsByAccountUser,
          templatesByAccountUser,
          audiences,
        } = await getTargetingExtraAttributes({
          accountUserIds,
        });

        // filter onboarding inline embeds based on targeting
        for (const [i, embeds] of onboardingInlineEmbeds.entries()) {
          const useBranchingTargeting =
            await enableBranchingSelectionTargeting.enabled(
              embeds[i].organizationId
            );

          const accountExtraAttributes = {
            audiences,
            branchingSelections: useBranchingTargeting
              ? accountBranchingSelections[i]
              : [],
          };

          onboardingInlineEmbeds[i] = embeds.filter((embed) => {
            const account = accounts[i];
            const accountUser = accountUsers[i];
            const accountMatched =
              embed.targeting.account.type === TargetingType.all ||
              (embed.targeting.account.grouping === GroupCondition.any
                ? embed.targeting.account.rules.some((rule) =>
                    checkAttributeRulesMatch({
                      input: account,
                      rules: [rule] as AttributeRule[],
                      extraAttributes: accountExtraAttributes,
                    })
                  )
                : checkAttributeRulesMatch({
                    input: account,
                    rules: embed.targeting.account.rules as AttributeRule[],
                    extraAttributes: accountExtraAttributes,
                  }));

            const accountUserExtraAttributes = {
              audiences,
              branchingSelections: useBranchingTargeting
                ? branchingPathsByAccountUser[accountUser.id]
                : [],
              templates: templatesByAccountUser[accountUser.id],
            };

            const accountUserMatched =
              embed.targeting.accountUser.type === TargetingType.all ||
              (embed.targeting.accountUser.grouping === GroupCondition.any
                ? embed.targeting.accountUser.rules.some((rule) =>
                    checkAttributeRulesMatch({
                      input: accountUser,
                      rules: [rule] as AttributeRule[],
                      extraAttributes: accountUserExtraAttributes,
                    })
                  )
                : checkAttributeRulesMatch({
                    input: accountUser,
                    rules: embed.targeting.accountUser.rules as AttributeRule[],
                    extraAttributes: accountUserExtraAttributes,
                  }));

            return accountMatched && accountUserMatched;
          });
        }
      }

      const everboardingInlineEmbeds =
        await loaders.inlineEmbedsWithGuideForAccountUserLoader.loadMany(
          accountUsers.map((au) => au.id)
        );
      return onboardingInlineEmbeds.map((onboarding, i) =>
        (Array.isArray(onboarding) ? onboarding : []).concat(
          // @ts-ignore
          Array.isArray(everboardingInlineEmbeds[i])
            ? everboardingInlineEmbeds[i]
            : []
        )
      );
    },
    // @ts-ignore
    { cacheKeyFn: (au) => au.id }
  );

export default inlineEmbedsForAccountUserLoader;
