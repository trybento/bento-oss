import React, { useMemo, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import {
  AttributeType,
  RuleTypeEnum,
  TargetValueType,
} from 'bento-common/types';
import Box from 'system/Box';
import Select from 'system/Select';
import {
  getRuleConditions,
  Rule,
  getDefaultRuleCondition,
} from './targeting.helpers';
import AddButton from 'components/AddButton';
import DeleteButton from 'system/DeleteButton';
import TargetingRuleValueSelect from 'components/EditorCommon/TargetingRuleValueSelect';
import Text from 'system/Text';
import { RawRule } from 'bento-common/types/targeting';
import { FieldArray, useFormikContext } from 'formik';
import { TargetingForm } from './GroupTargetingEditor.helpers';
import { getRuleValue } from 'bento-common/utils/targeting';
import { TemplateOverflowMenuButton_template$data } from 'relay-types/TemplateOverflowMenuButton_template.graphql';
import { isEmptyCheckTargeting } from 'bento-common/data/helpers';

type AttributeOption = { label: string; value: string; type: AttributeType };

interface Props {
  groupIdx: number;
  attributeType: AttributeType;
  attributeOptions: AttributeOption[];
  disabled?: boolean;
  targetingPath: 'account' | 'accountUser';
  removeGroup: () => void;
  template: TemplateOverflowMenuButton_template$data;
}

const DEFAULT_RULE: RawRule = {
  attribute: '',
  ruleType: RuleTypeEnum.equals,
  value: '',
  valueType: TargetValueType.text,
};

const prepareRuleForForm = (
  rule: RawRule,
  attributeType: AttributeType,
  attributeOptions: any[]
): Rule => {
  let attribute: any = undefined;

  if (rule.valueType === 'branchingPath') {
    attribute = attributeOptions.find((option) =>
      option.choices?.some((c) => c.id === rule?.value)
    ) || {
      label: '<Unknown branching question>',
      // It doesn't matter what type this default has because it's invalid anyway.
      valueType: 'text',
    };
  }

  attribute = attributeOptions.find((a) => a.value === rule.attribute);

  const condition =
    attribute &&
    getRuleConditions(attribute.valueType).find(
      (condition) => condition.value === rule.ruleType
    );

  const value = getRuleValue(rule);

  return {
    attribute,
    attributeType,
    condition,
    value,
  };
};

const GroupRulesContainer: React.FC<Props> = ({
  groupIdx,
  attributeType,
  attributeOptions,
  targetingPath,
  removeGroup,
  template,
}) => {
  const { setFieldValue, values } = useFormikContext<TargetingForm>();
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);

  const rules = useMemo(
    () =>
      values.targeting[targetingPath].groups[groupIdx].rules.map((rule) =>
        prepareRuleForForm(rule, attributeType, attributeOptions)
      ),
    [values, attributeType, attributeOptions]
  );

  const noAttributeOptionsMessage = `No ${
    attributeType === AttributeType.accountUser ? 'user' : attributeType
  } attributes found`;

  const rulesPath = useMemo(
    () => `targeting.${targetingPath}.groups[${groupIdx}].rules`,
    [targetingPath, groupIdx]
  );

  return (
    <FieldArray
      name={rulesPath}
      render={({ push, remove }) => {
        const removeRule = (idx: number) => {
          if (rules.length === 1) {
            removeGroup();
          } else {
            remove(idx);
          }
        };

        return (
          <Box
            backgroundColor="white"
            p="3"
            borderRadius={8}
            borderStyle="solid"
            borderWidth={1}
            borderColor="gray.200"
          >
            <Flex direction="column" gap="2" alignItems="stretch">
              {rules.map((rule, idx) => {
                const rulePath = `${rulesPath}[${idx}]`;
                const { attribute, condition, value } = rule;
                const attributeValueType = attribute?.valueType;

                const ruleType =
                  typeof condition === 'string' ? condition : condition?.value;
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
                    <Box alignSelf="center" flex="0 0 7%">
                      <Text p="1" align="center">
                        {idx === 0 ? 'Where' : 'And'}
                      </Text>
                    </Box>
                    <Box flex="0 0 31%">
                      <Select
                        value={attribute}
                        noOptionsMessage={() => noAttributeOptionsMessage}
                        onChange={(selectedOption: {
                          value: string;
                          label: string;
                          type: AttributeType;
                          valueType: TargetValueType;
                        }) => {
                          const defaultRule = getDefaultRuleCondition(
                            selectedOption.valueType
                          );

                          setFieldValue(rulePath, {
                            attribute: selectedOption.value,
                            ruleType: defaultRule.value,
                            valueType: defaultRule.valueType,
                            value: null,
                          });
                        }}
                        options={attributeOptions}
                      />
                    </Box>
                    <Box flex={isEmptyCheck ? '0 0 54%' : '0 0 20%'}>
                      <Select
                        isSearchable={false}
                        value={condition}
                        isDisabled={!attribute}
                        onChange={(selectedOption) => {
                          setFieldValue(rulePath, {
                            attribute: attribute.value,
                            ruleType: selectedOption.value,
                            valueType: selectedOption.valueType,
                            value,
                          });
                        }}
                        options={getRuleConditions(attributeValueType)}
                      />
                    </Box>
                    {!isEmptyCheck && (
                      <Box flex="0 0 33%">
                        <TargetingRuleValueSelect
                          attribute={attribute}
                          condition={
                            (typeof condition === 'object'
                              ? condition.value
                              : condition) as RuleTypeEnum
                          }
                          value={value}
                          index={idx}
                          onChange={(value) =>
                            setFieldValue(
                              `${rulePath}.value`,
                              value instanceof Date
                                ? value.toISOString()
                                : value
                            )
                          }
                          template={template}
                        />
                      </Box>
                    )}
                    <Box alignSelf="center" flex="0 0 5%">
                      {hoveredIdx === idx && (
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
            <Box pt={4} px={1}>
              <AddButton
                onClick={() => push(DEFAULT_RULE)}
                fontSize="sm"
                iconSize="sm"
              >
                And
              </AddButton>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default GroupRulesContainer;
