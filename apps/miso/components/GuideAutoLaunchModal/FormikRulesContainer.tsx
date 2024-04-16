import React, { useMemo, useState } from 'react';
import get from 'lodash/get';
import { useFormikContext, FieldArray } from 'formik';
import { BoxProps, Flex } from '@chakra-ui/react';
import {
  AttributeType,
  RuleTypeEnum,
  TargetValueType,
} from 'bento-common/types';

import Box from 'system/Box';
import Select from 'system/Select';
import {
  getRuleConditions,
  NEW_ACCOUNT_RULE,
  NEW_ACCOUNT_USER_RULE,
  Rule,
  getDefaultRuleCondition,
} from '../EditorCommon/targeting.helpers';
import AddButton from 'components/AddButton';
import DeleteButton from 'system/DeleteButton';
import TargetingRuleValueSelect from '../EditorCommon/TargetingRuleValueSelect';
import { snakeToCamelCase } from 'bento-common/utils/strings';
import { isEmptyCheckTargeting } from 'bento-common/data/helpers';

interface Props extends Omit<BoxProps, 'onChange' | 'rules'> {
  formKey: string;
  fieldKeys?: { array: string; targetRule: string };
  attributeType: AttributeType;
  attributeOptions: { label: string; value: string; type: TargetValueType }[];
  disabled?: boolean;
  addDisabled?: boolean;
  deleteLastDisabled?: boolean;
  setFieldValueWithHook?: (formKey: string, value: any) => void;
}

const RulesContainer = ({
  attributeType,
  disabled = false,
  attributeOptions,
  addDisabled,
  deleteLastDisabled,
  formKey,
  fieldKeys: passedFieldKeys,
  setFieldValueWithHook,
  ...boxProps
}: Props) => {
  const { values, setFieldValue: _setFieldValue } = useFormikContext();

  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);

  const setFieldValue = setFieldValueWithHook || _setFieldValue;

  const defaultRule = useMemo(
    () =>
      attributeType === AttributeType.account
        ? NEW_ACCOUNT_RULE
        : NEW_ACCOUNT_USER_RULE,
    [attributeType]
  );

  const fieldKeys = useMemo(() => {
    const camelCasedAttributeType = snakeToCamelCase(attributeType);
    return (
      passedFieldKeys || {
        array: `${formKey}.${camelCasedAttributeType}Rules`,
        targetRule: `${formKey}.${camelCasedAttributeType}TargetType`,
      }
    );
  }, [passedFieldKeys, formKey, attributeType]);

  const existingRules: Rule[] = get(values, fieldKeys.array);
  const rules: Rule[] = existingRules?.length ? existingRules : [defaultRule];

  const _addDisabled = useMemo(
    () => addDisabled || disabled,
    [addDisabled, disabled]
  );

  const deleteDisabled = useMemo(
    () => disabled || (deleteLastDisabled && rules.length === 1),
    [disabled, deleteLastDisabled, rules.length]
  );

  const noAttributeOptionsMessage = `No ${
    attributeType === AttributeType.accountUser ? 'user' : attributeType
  } attributes found`;

  return (
    <>
      <FieldArray
        name={fieldKeys.array}
        render={({ push, remove }) => {
          const removeRule = (idx: number) => {
            if (rules.length === 1) {
              setFieldValue(fieldKeys.targetRule, 'all');
            } else {
              remove(idx);
            }
          };

          return (
            <Box {...boxProps}>
              <Flex direction="column" gap="2" alignItems="stretch">
                {rules.map((rule, idx) => {
                  const { attribute, condition, value } = rule;
                  const valueType = attribute?.valueType;
                  const rowKey = `${fieldKeys.array}[${idx}]`;
                  const ruleType =
                    typeof condition === 'string' ? condition : condition.value;
                  const isEmptyCheck = isEmptyCheckTargeting(
                    ruleType as RuleTypeEnum
                  );

                  return (
                    <Flex
                      key={`${attributeType}-attribute-rule-${idx}`}
                      gap="2"
                      alignItems="start"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(-1)}
                    >
                      <Box flex="0 0 284px">
                        <Select
                          value={attribute}
                          isDisabled={disabled}
                          noOptionsMessage={() => noAttributeOptionsMessage}
                          onChange={(selectedOption: {
                            value: string;
                            label: string;
                            type: AttributeType;
                            valueType: TargetValueType;
                          }) => {
                            setFieldValue(`${rowKey}`, {
                              attribute: selectedOption,
                              attributeType: selectedOption.type,
                              condition: getDefaultRuleCondition(
                                selectedOption.valueType
                              ),
                              value: '',
                            });
                          }}
                          options={attributeOptions}
                        />
                      </Box>
                      <Box flex={isEmptyCheck ? '0 0 422px' : '0 0 130px'}>
                        <Select
                          isSearchable={false}
                          value={condition}
                          isDisabled={!attribute || disabled}
                          onChange={(selectedOption) =>
                            setFieldValue(`${rowKey}.condition`, selectedOption)
                          }
                          options={getRuleConditions(valueType)}
                        />
                      </Box>
                      {!isEmptyCheck && (
                        <Box flex="0 0 284px">
                          <TargetingRuleValueSelect
                            attribute={attribute}
                            disabled={disabled}
                            condition={
                              (typeof condition === 'object'
                                ? condition.value
                                : condition) as RuleTypeEnum
                            }
                            value={value}
                            index={idx}
                            onChange={(value) =>
                              setFieldValue(`${rowKey}.value`, value)
                            }
                          />
                        </Box>
                      )}
                      <Box alignSelf="center" flex="0 0 30px">
                        {!deleteDisabled && hoveredIdx === idx && (
                          <DeleteButton
                            onClick={() => removeRule(idx)}
                            tooltip="Delete rule"
                            tooltipPlacement="top"
                            opacity={0.4}
                            _hover={{ opacity: 0.8 }}
                          />
                        )}
                      </Box>
                    </Flex>
                  );
                })}
              </Flex>
              {!_addDisabled && (
                <Box display="inline-block" mt={2}>
                  <AddButton
                    onClick={() => (disabled ? null : push(defaultRule))}
                    fontSize="xs"
                    iconSize="sm"
                  >
                    Add rule
                  </AddButton>
                </Box>
              )}
            </Box>
          );
        }}
      />
    </>
  );
};

export default RulesContainer;
