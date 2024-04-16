import { LongRuleTypeEnum } from 'bento-common/types';

import { StepEventMappingRule } from 'src/data/models/StepEventMappingRule.model';
import { logger } from 'src/utils/logger';
import { Attributes } from '../recordEvents/recordEvents.helpers';

export type EventProperties = {
  [propertyName: string]: object | number | string | boolean;
};

/** For testing against step autocomplete rules */
export default function checkStepEventMappingRulesSatisfied(
  rule: StepEventMappingRule,
  eventProperties: EventProperties | Attributes
) {
  const { propertyName, valueType, ruleType } = rule;

  let valueToCompare: number | string | boolean | Date;
  let eventPropertiesValue: number | string | boolean | Date;
  switch (valueType) {
    case 'number':
      valueToCompare = rule.numberValue as number;
      eventPropertiesValue = eventProperties[propertyName] as number;
      break;
    case 'text':
      valueToCompare = rule.textValue as string;
      eventPropertiesValue = eventProperties[propertyName] as string;
      break;
    case 'boolean':
      valueToCompare = rule.booleanValue as boolean;
      eventPropertiesValue = eventProperties[propertyName] as boolean;
      break;
    case 'date':
      valueToCompare = rule.dateValue as Date;
      eventPropertiesValue = new Date(eventProperties[propertyName] as string);
      break;
    default:
      throw new Error(`Unrecognized valueType for rule: ${valueType}`);
  }

  let isRuleSatisfied: boolean;
  switch (ruleType) {
    case LongRuleTypeEnum.lte:
      isRuleSatisfied = eventPropertiesValue <= valueToCompare;
      break;
    case LongRuleTypeEnum.lt:
      isRuleSatisfied = eventPropertiesValue < valueToCompare;
      break;
    case LongRuleTypeEnum.equals:
      isRuleSatisfied = eventPropertiesValue === valueToCompare;
      break;
    case LongRuleTypeEnum.gte:
      isRuleSatisfied = eventPropertiesValue >= valueToCompare;
      break;
    case LongRuleTypeEnum.gt:
      isRuleSatisfied = eventPropertiesValue > valueToCompare;
      break;
    default:
      throw new Error(`Unrecognize ruleType for rule: ${rule.ruleType}`);
  }

  logger.debug('Checked if rule was satisfied', {
    valueToCompare,
    eventPropertiesValue,
    ruleType,
    isRuleSatisfied,
  });

  return isRuleSatisfied;
}
