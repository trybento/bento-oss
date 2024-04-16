import { addMinutes } from 'date-fns';

import {
  AttributeRuleArgs,
  RuleTypeEnum,
  TargetingType,
  TargetValueType,
} from 'bento-common/types';
import { isRelativeDateTargeting } from 'bento-common/data/helpers';
import { Audience } from 'src/data/models/Audience.model';
import { AttributeRule } from './types';

/**
 * Attempts to create a sample attribute set that'll match the given audience
 */
export default async function createSampleAttributeSet(audience: Audience) {
  const accountAttributes = {};
  const accountUserAttributes = {};

  audience.autoLaunchRules[0] &&
    iterateRules(
      accountAttributes,
      audience.autoLaunchRules[0].ruleType,
      audience.autoLaunchRules[0].rules
    );
  audience.targets[0] &&
    iterateRules(
      accountUserAttributes,
      audience.targets[0].targetType,
      audience.targets[0].rules
    );
}

/**
 * Read each rule and add an attribute to the hash that'll match that rule
 */
const iterateRules = (
  attributes: Record<string, any>,
  type: TargetingType,
  rules: AttributeRule[]
) => {
  /* No need to iterate if all */
  if (type === 'all') return attributes;

  rules.forEach((rule) => {
    const value =
      rule.value ||
      rule[
        `${
          isRelativeDateTargeting(rule.ruleType) ? 'number' : rule.valueType
        }Value`
      ];

    switch (rule.valueType) {
      case TargetValueType.boolean:
        switch (rule.ruleType) {
          case RuleTypeEnum.equals:
            attributes[rule.attribute] = value;
          default:
            attributes[rule.attribute] = !value;
        }
        break;
      case TargetValueType.date:
        switch (rule.ruleType) {
          case RuleTypeEnum.equals:
          case RuleTypeEnum.gte:
          case RuleTypeEnum.lte:
            attributes[rule.attribute] = value;
            break;
          case RuleTypeEnum.notEquals:
          case RuleTypeEnum.gt:
            attributes[rule.attribute] = addMinutes(
              new Date(value as string),
              1
            ).toISOString();
            break;
          case RuleTypeEnum.lt:
            attributes[rule.attribute] = addMinutes(
              new Date(value as string),
              -1
            ).toISOString();
          default:
        }
        break;
      case TargetValueType.number:
        switch (rule.ruleType) {
          case RuleTypeEnum.equals:
          case RuleTypeEnum.gte:
          case RuleTypeEnum.lte:
            attributes[rule.attribute] = value;
            break;
          case RuleTypeEnum.notEquals:
          case RuleTypeEnum.gt:
            attributes[rule.attribute] = (value as number) + 1;
            break;
          case RuleTypeEnum.lt:
            attributes[rule.attribute] = (value as number) - 1;
            break;
          default:
        }
        break;
      case TargetValueType.text:
        switch (rule.ruleType) {
          case RuleTypeEnum.stringContains:
          case RuleTypeEnum.equals:
            attributes[rule.attribute] = value;
            break;
          case RuleTypeEnum.stringDoesNotContain:
          default:
            attributes[rule.attribute] = 'something else';
        }
        break;
      case TargetValueType.branchingPath:
      case TargetValueType.template:
      // TODO: Support these by returning the value so we can "fake" it in the rule tester.
      default:
    }
  });
};
