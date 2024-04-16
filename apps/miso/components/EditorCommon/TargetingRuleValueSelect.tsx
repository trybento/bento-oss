import { useCallback, useEffect, useMemo, useState } from 'react';
import { RuleTypeEnum, TargetValueType } from 'bento-common/types';
import { BOOLEAN_OPTIONS } from './targeting.helpers';
import Select from 'system/Select';
import DatePicker from 'components/DatePicker';
import TemplateSelect from '../GuideAutoLaunchModal/TemplateSelect';
import Input from 'system/Input';
import RuleAttributeValueSelect from '../GuideAutoLaunchModal/RuleAttributeValueSelect';
import Text from 'system/Text';
import { HStack } from '@chakra-ui/react';
import {
  isRelativeDateTargeting,
  isStringSearchTargeting,
  isStringArrayTargeting,
  isEmptyCheckTargeting,
} from 'bento-common/data/helpers';
import usePrevious from 'bento-common/hooks/usePrevious';
import { TemplateOverflowMenuButton_template$data } from 'relay-types/TemplateOverflowMenuButton_template.graphql';

type ValueSelectProps<V> = {
  attribute: any;
  disabled?: boolean;
  condition?: RuleTypeEnum;
  value: V;
  index: number;
  onChange: (v: V) => void;
  template?: TemplateOverflowMenuButton_template$data;
};

function formatDateValue(dateValue: string | Date | null | undefined): Date {
  return typeof dateValue === 'string' && dateValue !== ''
    ? new Date(dateValue)
    : (dateValue as Date);
}

/** Types we expect to show a <Select> component for */
const SELECT_TYPES = [
  TargetValueType.boolean,
  TargetValueType.template,
  TargetValueType.text,
];

/** Rules we allow multi-select for */
const ARRAY_RULE_TYPES = [
  RuleTypeEnum.all,
  RuleTypeEnum.any,
  RuleTypeEnum.none,
  RuleTypeEnum.only,
];

export default function TargetingRuleValueSelect<V>({
  attribute,
  disabled,
  value,
  index,
  onChange,
  condition,
  template,
  ...rest
}: ValueSelectProps<V>) {
  const type = attribute?.valueType as TargetValueType;
  const prevCondition = usePrevious(condition);
  const [ranKey, setRanKey] = useState(0);

  /* Determine if we're using an input component */
  const isInputFieldValue = useMemo(() => {
    if (type === TargetValueType.number) return true;

    /* Because "3 days ago" is not a calendar date but a number */
    if (type === TargetValueType.date && isRelativeDateTargeting(condition))
      return true;

    /* Partial text needs to allow for free entry */
    if (type === TargetValueType.text && isStringSearchTargeting(condition))
      return true;

    return false;
  }, [type, condition]);

  const handleChange = useCallback(
    (value: any) => {
      onChange(
        isInputFieldValue
          ? value.target.value
          : type === TargetValueType.branchingPath
          ? value.id
          : Array.isArray(value)
          ? (value || []).map((v) => v.value)
          : SELECT_TYPES.includes(type)
          ? value.value
          : value
      );
    },
    [type, isInputFieldValue]
  );

  const resetField = useCallback(() => {
    onChange(undefined);
    setRanKey(Math.random());
  }, []);

  /** Clean incompatible values when switching types */
  useEffect(() => {
    /* ignore first load */
    if (!prevCondition || !condition) return;

    if (
      (type === TargetValueType.date &&
        isRelativeDateTargeting(condition) !==
          isRelativeDateTargeting(prevCondition)) ||
      (type === TargetValueType.text &&
        isStringSearchTargeting(condition) !==
          isStringSearchTargeting(prevCondition)) ||
      isStringArrayTargeting(condition) !==
        isStringArrayTargeting(prevCondition)
    ) {
      resetField();
    }
  }, [condition, prevCondition, type]);

  return type === TargetValueType.boolean ? (
    <Select
      isSearchable={false}
      value={BOOLEAN_OPTIONS.find((option) => option.value === value)}
      isDisabled={!attribute || disabled}
      onChange={handleChange}
      options={BOOLEAN_OPTIONS}
      styles={{
        container: (provided) => ({
          ...provided,
          width: '100%',
        }),
      }}
      {...rest}
    />
  ) : type === TargetValueType.date ? (
    isEmptyCheckTargeting(condition) ? null : isRelativeDateTargeting(
        condition
      ) ? (
      <HStack>
        <Input
          isDisabled={!attribute || disabled}
          value={value as number}
          onChange={handleChange}
          type="number"
          width="50%"
        />
        <Text>days ago</Text>
      </HStack>
    ) : (
      <DatePicker
        disabled={!attribute || disabled}
        selectedDate={formatDateValue(value as string | Date)}
        onChange={handleChange}
      />
    )
  ) : type === TargetValueType.template ? (
    <TemplateSelect
      isDisabled={!attribute || disabled}
      value={value as string}
      onChange={handleChange}
      currentTemplate={template}
    />
  ) : type === TargetValueType.number ? (
    <Input
      isDisabled={!attribute || disabled}
      value={value as number}
      onChange={handleChange}
      type="number"
    />
  ) : type === TargetValueType.branchingPath ? (
    <Select
      value={attribute?.choices?.find((choice) => choice.id === value)}
      options={attribute?.choices}
      onChange={handleChange}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
        }),
      }}
    />
  ) : type === TargetValueType.text && isStringSearchTargeting(condition) ? (
    <Input
      isDisabled={!attribute || disabled}
      /**
       * We need to set a default value of empty string
       * if value is undefined, otherwise the component
       * will switch between controlled/uncontrolled and
       * error out.
       */
      value={(value as string | undefined) || ''}
      onChange={handleChange}
      type="text"
    />
  ) : (
    <RuleAttributeValueSelect
      key={ranKey}
      attributeName={attribute?.name}
      attributeType={attribute?.type}
      value={value as string | string[]}
      selectKey={`${attribute?.label}-attribute-rule-${index}`}
      isDisabled={!attribute || disabled}
      onChange={handleChange}
      styles={{
        container: (provided) => ({
          ...provided,
          width: '100%',
        }),
        input: (provided) => ({
          ...provided,
          maxWidth: '238px',
        }),
      }}
      isMulti={ARRAY_RULE_TYPES.includes(condition)}
    />
  );
}
