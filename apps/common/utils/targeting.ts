import { groupBy } from './lodash';

import { isEmptyCheckTargeting } from '../data/helpers';
import {
  GroupTargeting,
  GroupTargetingSegment,
  RawRule,
  RuleTypeEnum,
  TargetingRuleRow,
  TargetingType,
  TargetValueType,
} from '../types/targeting';
import { pick } from 'lodash';

export function getTargetValueColumnName(valueType: TargetValueType) {
  if (valueType === TargetValueType.stringArray) {
    return 'textValues';
  }

  return `${valueType}Value`;
}

export const getRuleValue: any = (rule: any) =>
  (rule?.valueType === 'boolean' || rule?.valueType === 'number') &&
  rule?.value !== undefined
    ? rule?.value
    : rule?.value || rule?.[getTargetValueColumnName(rule.valueType)];

/**
 * Simple casting, primarily for externally inputted variables that
 * need to transform to a supported type of attribute value
 */
export const castOrTransformByValueType = (
  val: string,
  valueType: TargetValueType
) => {
  switch (valueType) {
    case TargetValueType.boolean:
      return typeof val === 'boolean' ? val : val === 'true' ? true : false;
    case TargetValueType.number:
      return typeof val === 'number' ? val : !isNaN(+val) ? Number(val) : 0;
    case TargetValueType.stringArray:
      return Array.isArray(val) ? val : [val];
    default:
      return val;
  }
};

/**
 * Runs a callback on each rule in a targeting set.
 * Modifies the original object.
 */
export const iterateRules = <T = RawRule>(
  targeting: GroupTargeting<T>,
  cb: (rule: T) => void
) => {
  Object.keys(targeting).forEach((type) => {
    targeting[type as keyof typeof targeting]?.groups?.forEach((group) => {
      group.rules = group.rules.map((rule) => {
        cb(rule);
        return rule;
      });
    });
  });
};

export const countRules = (targeting: GroupTargeting) =>
  countRulesInSegment(targeting.account) +
  countRulesInSegment(targeting.accountUser);

/**
 * Counts "all" type as a single rule
 */
export const countRulesInSegment = (targeting: GroupTargetingSegment) =>
  targeting.type === TargetingType.attributeRules
    ? (targeting.groups ?? []).reduce<number>((a, g) => {
        return a + g.rules.length;
      }, 0)
    : 1;

/**
 * Transforms database-friendly format to JSON format
 */
export const targetingRuleRowsToTargetingSegment = (
  rows: TargetingRuleRow[]
): GroupTargetingSegment => {
  if (rows.length === 0)
    return {
      type: TargetingType.all,
    };

  const groups = groupBy(rows, 'groupIndex');

  return {
    type: TargetingType.attributeRules,
    groups: Object.values(groups).map((list) => ({
      rules: list.map(({ groupIndex, ...ruleInfo }) => ruleInfo),
    })),
  };
};

/**
 * Transforms JSON format to database-friendly format
 */
export const targetingSegmentToTargetingRuleRows = (
  targetingSegment: GroupTargetingSegment
): TargetingRuleRow[] => {
  if (
    targetingSegment.type === TargetingType.all ||
    !targetingSegment.groups ||
    targetingSegment.groups.length === 0
  )
    return [];

  return targetingSegment.groups.flatMap((group, groupIndex) =>
    group.rules.map((rule) => ({
      ...rule,
      groupIndex,
    }))
  );
};

export const emptyTargeting: GroupTargeting = {
  account: {
    type: TargetingType.all,
  },
  accountUser: {
    type: TargetingType.all,
  },
};

/** Check if each attribute has a value and condition to match */
export const isRuleIncomplete = (rule: RawRule) => {
  const { attribute, ruleType, valueType, value } = rule;

  /** only enforce non-value fields */
  if (isEmptyCheckTargeting(ruleType))
    return !(attribute && ruleType && valueType);

  const valid = !!(
    attribute &&
    ruleType &&
    valueType &&
    value !== undefined &&
    value !== null &&
    value !== 0 &&
    value !== '' &&
    (Array.isArray(value) ? value.length > 0 : true)
  );

  return !valid;
};

/** Checks for empty rules */
export const isTargetingIncomplete = (targets: GroupTargeting) => {
  const { account, accountUser } = targets;
  return (
    (account.type === 'attribute_rules' &&
      (!account.groups ||
        !!account.groups?.find((group) =>
          group.rules.find((rule) => isRuleIncomplete(rule))
        ))) ||
    (accountUser.type === 'attribute_rules' &&
      (!accountUser.groups ||
        !!accountUser.groups?.find((group) =>
          group.rules.find((rule) => isRuleIncomplete(rule))
        )))
  );
};

/**
 * For v2.0 we'll construct a simple equality rule for audiences
 */
export const audienceToAudienceRule = (
  audienceEntityId: string
): GroupTargetingSegment => ({
  type: TargetingType.attributeRules,
  groups: [
    {
      rules: [
        {
          attribute: AUDIENCE_ATTR_NAME,
          value: audienceEntityId,
          valueType: TargetValueType.audience,
          ruleType: RuleTypeEnum.equals,
        },
      ],
    },
  ],
});

/**
 * For v2.0 when rules only support one audience.
 */
export const audienceRuleToAudience = (segment: GroupTargetingSegment) =>
  segment?.groups?.[0].rules?.[0].value as string;

export const AUDIENCE_ATTR_NAME = 'Bento: Audience';

/** Cached items from the targeting modal have ___Value keys instead of value */
export const turnEverythingIntoValue = (
  /** @todo type. currently used in autocomplete rules too which breaks AttributeRuleArgs */
  rule
) => ({
  ...pick(rule, ['attribute', 'ruleType', 'valueType']),
  value: rule.value || getRuleValue(rule),
});

type LegacyRuleRow = {
  ruleType?: TargetingType;
  targetType?: TargetingType;
  rules: RawRule[];
};

/** Formats from legacy database shape to GroupTargetingSegment */
export const formatTargetingSegment = (
  rules: LegacyRuleRow[],
  transformLegacy = false
): GroupTargetingSegment => {
  const type: TargetingType = (rules[0]?.ruleType ?? rules[0]?.targetType)!;

  if (!type) return { type: TargetingType.all };

  return rules.length > 0
    ? {
        type,
        groups:
          type === TargetingType.attributeRules
            ? rules.map((rule) => ({
                rules: transformLegacy
                  ? rule.rules.map((r) => turnEverythingIntoValue(r))
                  : rule.rules,
              }))
            : undefined,
      }
    : { type: TargetingType.all };
};
