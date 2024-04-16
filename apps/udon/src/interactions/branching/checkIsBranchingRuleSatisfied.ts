import { BranchingPathRule } from 'src/data/models/BranchingPath.model';

import { AccountAttributes } from 'src/interactions/targeting/fetchAttributesForAccount';
import { AccountUserAttributes } from 'src/interactions/targeting/fetchAttributesForAccountUser';
import { logger } from 'src/utils/logger';

/** May be deprecated, duplicate name */
export function checkIsBranchingRuleSatisfied({
  rule,
  accountAttributes,
  accountUserAttributes,
}: {
  rule: BranchingPathRule;
  accountAttributes: AccountAttributes;
  accountUserAttributes: AccountUserAttributes;
}) {
  const { attribute, attributeLevel, ruleType, valueType, value } = rule;

  const attrsToCompare =
    attributeLevel === 'account' ? accountAttributes : accountUserAttributes;

  let valueToCompare: number | string | boolean | Date;
  let attrValue: number | string | boolean | Date | null | undefined;
  switch (valueType) {
    case 'number':
      valueToCompare = value as number;
      attrValue = attrsToCompare[attribute] as number;
      break;
    case 'text':
      valueToCompare = value as string;
      attrValue = attrsToCompare[attribute] as string;
      break;
    case 'boolean':
      valueToCompare = value as boolean;
      attrValue = attrsToCompare[attribute] as boolean;
      break;
    case 'date':
      valueToCompare = new Date(value as string) as Date;
      attrValue = attrsToCompare[attribute]
        ? new Date(attrsToCompare[attribute] as string)
        : null;
      break;
    default:
      throw new Error(`Unrecognized valueType for rule: ${valueType}`);
  }

  if (attrValue == null) return false;

  let isRuleSatisfied: boolean;
  switch (ruleType) {
    case 'lte':
      isRuleSatisfied = attrValue <= valueToCompare;
      break;
    case 'lt':
      isRuleSatisfied = attrValue < valueToCompare;
      break;
    case 'eq':
      isRuleSatisfied = attrValue === valueToCompare;
      break;
    case 'gte':
      isRuleSatisfied = attrValue >= valueToCompare;
      break;
    case 'gt':
      isRuleSatisfied = attrValue > valueToCompare;
      break;
    default:
      throw new Error(`Unrecognize ruleType for rule: ${ruleType}`);
  }

  if (logger.isDebugEnabled()) {
    logger.debug('Checked if rule was satisfied', {
      valueToCompare,
      attrValue,
      ruleType,
      isRuleSatisfied,
    });
  }

  return isRuleSatisfied;
}
