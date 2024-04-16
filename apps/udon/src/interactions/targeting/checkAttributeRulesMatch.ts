import { every, reduce } from 'lodash';

import { NpsSurveyTargetRule } from 'bento-common/types/netPromoterScore';
import { AttributeType, SelectedModelAttrs } from 'bento-common/types';
import { RuleResult } from 'bento-common/types/diagnostics';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';

import { checkIsRuleSatisfied } from 'src/interactions/targeting/checkIsRuleSatisfied';
import { AttributeRule } from 'src/interactions/targeting/types';
import { logger } from 'src/utils/logger';
import {
  addResultToMatchLog,
  ExtraAttributeDict,
  RuleMatchLog,
} from './targeting.helpers';

type Args<T extends AttributeRule | NpsSurveyTargetRule> = {
  rules: T[];
  input:
    | SelectedModelAttrs<
        Account,
        'attributes' | 'name' | 'createdInOrganizationAt'
      >
    | SelectedModelAttrs<
        AccountUser,
        'attributes' | 'fullName' | 'email' | 'createdInOrganizationAt'
      >;
  /** For matching Bento-attribute rules */
  extraAttributes?: ExtraAttributeDict;
  /** Report final rules that matched or failed */
  onDoneChecking?: (matchedResults: RuleResult) => void;
  /** Do not punt on rule failure */
  testAll?: boolean;
};

/**
 * Check an account or account user against attribute rules
 * @returns If all rules are matched
 */
export function checkAttributeRulesMatch<
  T extends AttributeRule | NpsSurveyTargetRule
>({
  rules,
  input,
  extraAttributes = {},
  onDoneChecking,
  testAll,
}: Args<T>): boolean {
  try {
    const attrType =
      input instanceof Account
        ? AttributeType.account
        : AttributeType.accountUser;

    const { externalId, name, fullName, email, createdInOrganizationAt } =
      input as any;
    const attributesObj = {
      ...input.attributes,
      name,
      fullName,
      email,
      createdAt: createdInOrganizationAt,
      id: externalId,
    };

    const matchResults: RuleMatchLog = {
      matchedRules: [] as any[],
      failedRules: [] as any[],
    };

    const testRule = (rule: T) =>
      checkIsRuleSatisfied({
        rule,
        attributes: attributesObj,
        extraAttributes: {
          ...extraAttributes,
          attrType,
        },
        onChecked: (matched, results) =>
          addResultToMatchLog(matched, results, matchResults),
      });

    const matchesAll = testAll
      ? reduce(
          rules,
          (a, rule) => {
            const matched = testRule(rule as T);
            return a ? matched : false;
          },
          true
        )
      : every(rules, (rule) => testRule(rule as T));

    onDoneChecking?.(matchResults);

    return matchesAll;
  } catch (e: any) {
    logger.error(`[checkAttributeRulesMatch] failed check: ${e.message}`, e);
    return false;
  }
}
