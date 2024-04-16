import { AttributeRuleArgs } from 'bento-common/types';

import { getAttributeValueFieldName } from 'src/utils/helpers';

/**
 * Converts client's rule format (${attribute}Type) to value
 */
export const formatTargetRulesFromArgs = (
  unformattedRules: AttributeRuleArgs[] | undefined
) => {
  return (unformattedRules || []).map((rule) => {
    const { attribute, ruleType, valueType } = rule;

    let value;
    if (rule.value != null) {
      value = rule.value;
    } else {
      value = rule[getAttributeValueFieldName(rule.valueType)];
    }

    return {
      attribute,
      ruleType,
      valueType,
      value,
    };
  });
};
