import { isBentoEvent } from 'bento-common/data/helpers';
import {
  AtLeast,
  AttributeType,
  RuleTypeEnum,
  StepAutoCompleteBaseOn,
  TargetValueType,
} from 'bento-common/types';

import { RULE_CONDITIONS_BY_TYPE } from '../EditorCommon/targeting.helpers';
import { StepEventMappingRuleRuleType } from 'relay-types/EditTemplateMutation.graphql';
import { SelectOptions } from 'system/Select';
import { CustomApiEventTypes } from 'types';
import { ExistingOptionsSorted } from '.';

/**
 * TODO: Update 'value' type since it is being used in
 * different mutations. Some support 'notEquals' and others
 * don't.
 */
export interface RuleType {
  label: string;
  value: StepEventMappingRuleRuleType;
}

export const ATTRIBUTE_VALUE_TYPE_OPTIONS: SelectOptions[] = [
  {
    label: 'String',
    value: 'text',
  },
  {
    label: 'Boolean',
    value: 'boolean',
  },
  {
    label: 'Number',
    value: 'number',
  },
  {
    label: 'Date',
    value: 'date',
  },
];

export const BASED_ON_OPTIONS: SelectOptions[] = [
  {
    label: 'Event',
    value: StepAutoCompleteBaseOn.event,
  },
  {
    label: 'Attribute',
    value: StepAutoCompleteBaseOn.attribute,
  },
  {
    label: "Another guide's completion",
    value: StepAutoCompleteBaseOn.guide,
  },
];

export const getBasedOnOption = (
  eventName: string | undefined
): StepAutoCompleteBaseOn | undefined => {
  const _eventName = isBentoEvent(eventName)
    ? StepAutoCompleteBaseOn.attribute
    : eventName
    ? StepAutoCompleteBaseOn.event
    : '';

  return BASED_ON_OPTIONS.find((option) => option.value === _eventName)
    ?.value as StepAutoCompleteBaseOn | undefined;
};

export const BOOLEAN_OPTIONS = [
  {
    label: 'TRUE',
    value: true,
  },
  {
    label: 'FALSE',
    value: false,
  },
];

export const formatAttributePropertyName = (
  name: string,
  type: AttributeType
): string => {
  if (!name) return name;
  const displayType = type === AttributeType.accountUser ? 'user' : type;
  return `${displayType}:${name}`;
};

export const sanitizeAttributePropertyName = (name: string): string =>
  name ? name.replace(/account:|user:/gi, (_match) => '') : name;

export function attributesFilter(
  attributes: any[],
  typeFilter: string | null,
  matchLabelWithValue = false
) {
  return (attributes || []).reduce((acc, attribute) => {
    if (!typeFilter || (typeFilter && attribute.type === typeFilter)) {
      const { type, name } = attribute;
      const label = formatAttributePropertyName(name, type);

      acc.push({
        ...attribute,
        value: matchLabelWithValue ? label : name,
        label,
      });
    }
    return acc;
  }, []);
}

/** TODO: Remove filter. See 'RuleType' note. */
export function getRuleConditions(
  ruleType: TargetValueType,
  /**
   *
   * @default [ne,c,nc]
   */
  exclude: RuleTypeEnum[] = [
    RuleTypeEnum.notEquals,
    RuleTypeEnum.stringContains,
    RuleTypeEnum.stringDoesNotContain,
  ]
): RuleType[] {
  const ruleConditions = RULE_CONDITIONS_BY_TYPE[ruleType] || [];

  return (
    exclude.length
      ? ruleConditions.filter((c) => !exclude.includes(c.value as any))
      : ruleConditions
  ) as RuleType[];
}

export function getIsAnyStepAutoCompleteRuleIncomplete(
  stepPrototypes: AtLeast<{ eventMappings?: any[] }, 'eventMappings'>[]
) {
  const isInvalid = !!stepPrototypes.find((stepPrototype) => {
    return (stepPrototype.eventMappings || []).find((eventMapping) => {
      // Validate empty eventName.
      const mappingRules = eventMapping?.rules || [];

      if (!eventMapping?.eventName && mappingRules.length > 0) return true;

      // Allow events without properties.
      const firstRule = mappingRules?.[0] || {};
      const isEventWithoutProperties =
        mappingRules.length <= 1 && Object.keys(firstRule).length === 0;

      if (isEventWithoutProperties) return false;

      return (
        mappingRules.findIndex((rule) => {
          return getIsRuleIncomplete(rule);
        }) !== -1
      );
    });
  });

  return isInvalid;
}

/** Do we still need this, is it distinct from targeting's version? */
export function getIsRuleIncomplete(rule) {
  return (
    !rule ||
    !rule.propertyName ||
    !rule.valueType ||
    !rule.ruleType ||
    (rule.valueType === 'text' && !rule.textValue) ||
    (rule.valueType === 'number' &&
      (rule.numberValue === null || rule.numberValue === undefined)) ||
    (rule.valueType === 'date' && !rule.dateValue) ||
    (rule.valueType === 'boolean' &&
      (rule.booleanValue === null || rule.booleanValue === undefined))
  ); // NOTE: DB migration needed to allow NULL booleanValue
}

/** Append new clientside only opts to existing list so it can be selected */
export function createNewExistingOption(
  newOption: string,
  existingOptions: ExistingOptionsSorted,
  type: CustomApiEventTypes
) {
  const newOpt = {
    value: newOption,
    label: newOption,
  };

  let newExistingOptions: ExistingOptionsSorted;

  if (type === CustomApiEventTypes.Event) {
    newExistingOptions = {
      events: [...existingOptions.events, newOpt],
      properties: [...existingOptions.properties],
    };
  } else {
    newExistingOptions = {
      events: [...existingOptions.events],
      properties: [...existingOptions.properties, newOpt],
    };
  }

  return newExistingOptions;
}

/** Sort events into their types */
export function breakApartCustomEvents(list) {
  const ret: ExistingOptionsSorted = {
    events: [],
    properties: [],
  };
  list.forEach((e) => {
    if (e.type === CustomApiEventTypes.Event) {
      ret.events.push(e);
    } else {
      ret.properties.push(e);
    }
  });

  return ret;
}
