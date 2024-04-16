import { differenceInDays, differenceInMilliseconds } from 'date-fns';
import {
  AttributeRuleArgs,
  AttributeType,
  DynamicAttributes,
  RuleTypeEnum,
  TargetValueType,
} from 'bento-common/types';
import { isRelativeDateTargeting } from 'bento-common/data/helpers';
import { NpsSurveyTargetRule } from 'bento-common/types/netPromoterScore';
import { CheckResults } from 'bento-common/types/diagnostics';
import { TargetingType, TemplateAttribute } from 'bento-common/types/targeting';

import { logger } from 'src/utils/logger';
import { AttributeRule } from './types';
import {
  addResultToMatchLog,
  ExtraAttributeDict,
  RuleMatchLog,
} from './targeting.helpers';

type Args = {
  rule: AttributeRule | AttributeRuleArgs | NpsSurveyTargetRule;
  attributes: DynamicAttributes;
  /** Extra Bento attribute types */
  extraAttributes?: ExtraAttributeDict;
  onChecked?: (matched: boolean, results: CheckResults[]) => void;
};

/**
 * Some operators could potentially already be supported by the backend
 * but are not enabled here since they are not enabled within Miso.
 *
 * @todo revisit the combinations of operators supported by type
 */
const valueTypeOperatorsMap: Record<TargetValueType, RuleTypeEnum[]> = {
  [TargetValueType.text]: [
    RuleTypeEnum.equals,
    RuleTypeEnum.notEquals,
    RuleTypeEnum.stringContains,
    RuleTypeEnum.stringDoesNotContain,
    RuleTypeEnum.isEmpty,
    RuleTypeEnum.isNotEmpty,
  ],
  [TargetValueType.boolean]: [
    RuleTypeEnum.equals,
    RuleTypeEnum.notEquals,
    RuleTypeEnum.isEmpty,
    RuleTypeEnum.isNotEmpty,
  ],
  [TargetValueType.template]: [RuleTypeEnum.equals, RuleTypeEnum.notEquals],
  [TargetValueType.branchingPath]: [
    RuleTypeEnum.equals,
    RuleTypeEnum.notEquals,
  ],
  [TargetValueType.number]: [
    RuleTypeEnum.equals,
    RuleTypeEnum.notEquals,
    RuleTypeEnum.gt,
    RuleTypeEnum.gte,
    RuleTypeEnum.lt,
    RuleTypeEnum.lte,
    RuleTypeEnum.isEmpty,
    RuleTypeEnum.isNotEmpty,
  ],
  [TargetValueType.date]: [
    RuleTypeEnum.gt,
    RuleTypeEnum.lt,
    RuleTypeEnum.relativeExactly,
    RuleTypeEnum.relativeMoreThan,
    RuleTypeEnum.relativeLessThan,
    RuleTypeEnum.isEmpty,
    RuleTypeEnum.isNotEmpty,
  ],
  [TargetValueType.stringArray]: [
    RuleTypeEnum.any,
    RuleTypeEnum.all,
    RuleTypeEnum.only,
    RuleTypeEnum.none,
    RuleTypeEnum.isEmpty,
    RuleTypeEnum.isNotEmpty,
  ],
  [TargetValueType.audience]: [RuleTypeEnum.equals, RuleTypeEnum.notEquals],
};

export function checkValueTypeSupportsOperator(
  valueType: AttributeRule['valueType'] | NpsSurveyTargetRule['valueType'],
  operator: AttributeRule['ruleType']
): boolean {
  return !!valueTypeOperatorsMap[valueType]?.includes(operator);
}

/**
 *
 * @param param0.onChecked Callback to report back on the values analyzed
 */
export function checkIsRuleSatisfied({
  rule,
  attributes,
  extraAttributes = {},
  onChecked,
}: Args) {
  const {
    templates = [],
    branchingSelections = [],
    audiences = {},
    attrType = AttributeType.account,
  } = extraAttributes;
  const { attribute, ruleType, valueType, value } = rule;

  if (logger.isDebugEnabled()) {
    logger.debug(`CHECKING RULE ${JSON.stringify(rule)}`);
  }

  if (!checkValueTypeSupportsOperator(valueType, ruleType)) {
    throw new Error(
      `Operator "${ruleType}" not supported by valueType "${valueType}"`
    );
  }

  /** For individual audience results */
  let innerMatchResults: RuleMatchLog | null = null;

  /** The value we specify in the rules we want to match against */
  let valueToCompare: number | string | boolean | Date | string[];
  /** The value of the current user/account */
  let attrValue: DynamicAttributes[keyof DynamicAttributes];
  switch (valueType) {
    case TargetValueType.number:
    case TargetValueType.text:
    case TargetValueType.boolean:
      valueToCompare = value as number | string | boolean;
      attrValue = attributes[attribute];
      break;
    case TargetValueType.stringArray:
      valueToCompare = value as string[];
      attrValue =
        ((Array.isArray(attributes[attribute])
          ? attributes[attribute]
          : [attributes[attribute]]) as string[]) || [];
      break;
    case TargetValueType.date:
      isRelativeDateTargeting(ruleType)
        ? (valueToCompare = value as number)
        : (valueToCompare = new Date(value as string | Date) as Date);

      attrValue = attributes[attribute]
        ? new Date(attributes[attribute] as string)
        : undefined;
      break;
    case TargetValueType.template:
      valueToCompare = value as string;

      const template = templates.find(
        ({ templateEntityId, completed }) =>
          // Template ID matches
          templateEntityId === valueToCompare &&
          // We're only interested in templates received...
          (attribute === TemplateAttribute.TemplateReceived ||
            // ...or we are looking for complete templates, and the template is complete
            (attribute === TemplateAttribute.TemplateCompleted && completed))
      );

      attrValue = template?.templateEntityId;

      break;
    case TargetValueType.branchingPath:
      valueToCompare = value as string;
      attrValue =
        branchingSelections[branchingSelections.indexOf(valueToCompare)];
      break;
    case TargetValueType.audience:
      /** The entityID of the audience we're looking at */
      valueToCompare = value as string;

      const targetedAudience = audiences[valueToCompare];

      if (!targetedAudience) {
        attrValue = undefined;
        break;
      }

      const segment =
        attrType === AttributeType.account
          ? targetedAudience.account
          : targetedAudience.accountUser;

      if (!segment.groups || segment.type === TargetingType.all) {
        attrValue = valueToCompare;
        break;
      }

      const matchResults: RuleMatchLog = {
        matchedRules: [] as any[],
        failedRules: [] as any[],
      };

      const matched = segment.groups.some((g) =>
        g.rules.every((rule) =>
          checkIsRuleSatisfied({
            rule,
            extraAttributes,
            attributes,
            onChecked: (matched, results) =>
              addResultToMatchLog(matched, results, matchResults),
          })
        )
      );

      innerMatchResults = matchResults;

      if (matched) attrValue = valueToCompare;
      break;
    default:
      throw new Error(`Unrecognized valueType for rule: ${valueType}`);
  }

  let isRuleSatisfied: boolean;
  switch (ruleType) {
    case RuleTypeEnum.isEmpty:
      isRuleSatisfied = attrValue === null || attrValue === undefined;
      break;
    case RuleTypeEnum.isNotEmpty:
      isRuleSatisfied = attrValue !== null && attrValue !== undefined;
      break;
    case RuleTypeEnum.lte:
      isRuleSatisfied = attrValue != null && attrValue <= valueToCompare;
      break;
    case RuleTypeEnum.lt:
      isRuleSatisfied = attrValue != null && attrValue < valueToCompare;
      break;
    case RuleTypeEnum.equals:
      isRuleSatisfied = attrValue === valueToCompare;
      break;
    case RuleTypeEnum.notEquals:
      isRuleSatisfied = attrValue !== valueToCompare;
      break;
    case RuleTypeEnum.gte:
      isRuleSatisfied = attrValue != null && attrValue >= valueToCompare;
      break;
    case RuleTypeEnum.gt:
      isRuleSatisfied = attrValue != null && attrValue > valueToCompare;
      break;
    case RuleTypeEnum.all:
      isRuleSatisfied = (valueToCompare as string[]).every((expectedValue) =>
        (attrValue as string[]).includes(expectedValue)
      );
      break;
    case RuleTypeEnum.any:
      isRuleSatisfied = (valueToCompare as string[]).some((expectedValue) =>
        (attrValue as string[]).includes(expectedValue)
      );
      break;
    case RuleTypeEnum.only:
      isRuleSatisfied =
        (valueToCompare as string[]).length ===
          (attrValue as string[]).length &&
        (valueToCompare as string[]).every((expectedValue) =>
          (attrValue as string[]).includes(expectedValue)
        );
      break;
    case RuleTypeEnum.none:
      isRuleSatisfied = !(valueToCompare as string[]).some((expectedValue) =>
        (attrValue as string[]).includes(expectedValue)
      );
      break;
    case RuleTypeEnum.relativeExactly: {
      /* Date is exactly n days ago */
      const daysAgo = differenceInDays(new Date(), attrValue as Date);
      isRuleSatisfied = daysAgo === valueToCompare;
      break;
    }
    case RuleTypeEnum.relativeMoreThan: {
      /* Date is more than n days ago */
      const daysAgo = differenceInDays(new Date(), attrValue as Date);
      isRuleSatisfied = daysAgo >= valueToCompare;
      break;
    }
    case RuleTypeEnum.relativeLessThan: {
      const now = new Date();

      /* Date is less than n days ago */
      const daysAgo = differenceInDays(now, attrValue as Date);
      const millisecondsAgo = differenceInMilliseconds(now, attrValue as Date);

      /**
       * To protect against comparing future dates (and therefore negative values),
       * we check that there's at least 1 millisecond positive difference between the dates.
       */
      isRuleSatisfied = millisecondsAgo > 0 && daysAgo < valueToCompare;
      break;
    }
    case RuleTypeEnum.stringContains:
      isRuleSatisfied =
        attrValue != null &&
        (attrValue as string)
          .toLowerCase()
          .includes((valueToCompare as string).toLowerCase());
      break;
    case RuleTypeEnum.stringDoesNotContain:
      isRuleSatisfied =
        attrValue == null ||
        !(attrValue as string)
          .toLowerCase()
          .includes((valueToCompare as string).toLowerCase());
      break;
    default:
      throw new Error(`Unrecognized ruleType for rule: ${ruleType}`);
  }

  if (logger.isDebugEnabled()) {
    logger.debug(
      `Checked if rule was satisfied: ${JSON.stringify({
        valueToCompare,
        attrValue: Array.isArray(attrValue) ? attrValue : String(attrValue),
        ruleType,
        isRuleSatisfied,
      })}`
    );
  }

  /** Surface only rules relevant to the result we have achieved */
  onChecked?.(isRuleSatisfied, [
    {
      ruleType,
      ruleValue: valueToCompare,
      attrValue,
      attribute,
      valueType,
    },
    ...(innerMatchResults
      ? isRuleSatisfied
        ? innerMatchResults.matchedRules
        : innerMatchResults.failedRules
      : []),
  ]);

  return isRuleSatisfied;
}
