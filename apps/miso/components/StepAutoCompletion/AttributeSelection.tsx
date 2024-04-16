import React, { useCallback, useMemo, useRef } from 'react';
import { useFormikContext } from 'formik';
import debounce from 'lodash/debounce';
import { AttributeType } from 'bento-common/types';

import Box from 'system/Box';
import Input from 'system/Input';
import Select from 'system/Select';

import {
  getRuleConditions,
  attributesFilter,
  BOOLEAN_OPTIONS,
  ATTRIBUTE_VALUE_TYPE_OPTIONS,
  formatAttributePropertyName,
  sanitizeAttributePropertyName,
} from './helpers';
import RuleAttributeValueSelect from '../GuideAutoLaunchModal/RuleAttributeValueSelect';

import { useAttributes } from 'providers/AttributesProvider';
import DatePicker from 'components/DatePicker';
import { QUERY_DEBOUNCE_DELAY } from 'helpers/constants';

interface AttributeSelectionProps {
  formKey: string;
  disabled?: boolean;
  attribute: any;
  attributeType: AttributeType | null | undefined;
  onAttributeSelected?: (type: AttributeType) => void;
}

const formatDateValue = (dateValue) => {
  let result = dateValue;

  if (typeof dateValue === 'string' && dateValue !== '') {
    result = new Date(dateValue);
  }

  return result;
};

const AttributeSelection = (props: AttributeSelectionProps) => {
  const { formKey, disabled, attribute, onAttributeSelected, attributeType } =
    props;

  const { attributes } = useAttributes();
  const attributeOptions = useMemo(
    () => attributesFilter(attributes as any[], null, true),
    [attributes]
  );
  const { setFieldValue } = useFormikContext();

  const attributeValueType = attribute?.valueType || '';
  const attributeValue = attribute?.[`${attributeValueType}Value`];
  const attributeValueKey = `${formKey}.[${attributeValueType}Value]`;
  const ruleOptions = useMemo(
    () => getRuleConditions(attributeValueType),
    [attributeValueType]
  );
  const keyRef = useRef(0);

  const noAttributeOptionsMessage = `No attributes found`;

  const handleAttributeValueChange = (value) => {
    let _value = value;

    if (attributeValueType === 'number') {
      _value = Number(value);
    }

    setFieldValue(attributeValueKey, _value);
  };

  const valueRuleWidth = () => {
    if (attributeValueType === 'date') return 1;
    if (attributeValueType === 'number') return 2;
    if (attributeValueType === 'text' || attributeValueType === 'boolean')
      return 0.8;
    return 0.6;
  };

  const valueFieldWidth = () => {
    if (attributeValueType === 'date') return 1;
    if (attributeValueType === 'number') return 0.6;
    if (attributeValueType === 'text' || attributeValueType === 'boolean')
      return 2;
    return 2;
  };

  const debouncedInputValueChange = useCallback(
    debounce((newValue: string) => {
      handleAttributeValueChange(newValue);
    }, QUERY_DEBOUNCE_DELAY),
    [attributeValueType]
  );

  return (
    <Box key={keyRef.current}>
      <Box display="flex" flexFlow="column" style={{ gap: '8px' }}>
        <Box display="flex" style={{ gap: '8px' }}>
          <Box flex={2}>
            <Select
              defaultValue={(attributeOptions || []).find(
                (option) =>
                  option.value ===
                  formatAttributePropertyName(
                    attribute?.propertyName,
                    attributeType
                  )
              )}
              isDisabled={disabled}
              noOptionsMessage={() => noAttributeOptionsMessage}
              onChange={({ value, valueType, type }) => {
                setFieldValue(formKey, {
                  valueType,
                  ruleType:
                    valueType === 'text' || valueType === 'boolean'
                      ? 'eq'
                      : null,
                  propertyName: sanitizeAttributePropertyName(value),
                });
                ATTRIBUTE_VALUE_TYPE_OPTIONS.forEach((option) =>
                  setFieldValue(`${formKey}.[${option.value}Value]`, null)
                );
                onAttributeSelected?.(type);
                keyRef.current = Math.random();
              }}
              options={attributeOptions}
              styles={{
                container: (provided) => ({
                  whiteSpace: 'pre',
                  ...provided,
                }),
              }}
              placeholder="Type to search..."
            />
          </Box>
          <Box width="150px" flex={valueRuleWidth()}>
            <Select
              isSearchable={false}
              defaultValue={(ruleOptions || []).find(
                (option) => option.value === attribute?.ruleType
              )}
              onChange={(selectedOption) =>
                setFieldValue(`${formKey}.ruleType`, selectedOption.value)
              }
              options={ruleOptions}
              isDisabled={!attribute || disabled}
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '100%',
                }),
              }}
            />
          </Box>
          <Box display="flex" flex={valueFieldWidth()}>
            {{
              date: (
                <DatePicker
                  disabled={!attribute || disabled}
                  selectedDate={formatDateValue(attributeValue)}
                  onChange={(date) => handleAttributeValueChange(date)}
                />
              ),
              number: (
                <Input
                  isDisabled={!attribute || disabled}
                  defaultValue={attributeValue}
                  onChange={(e) => debouncedInputValueChange(e.target.value)}
                  type="number"
                />
              ),
              boolean: (
                <Select
                  isSearchable={false}
                  value={BOOLEAN_OPTIONS.find(
                    (option) =>
                      option.value === attribute?.[`${attributeValueType}Value`]
                  )}
                  isDisabled={!attribute || disabled}
                  onChange={(selectedOption) =>
                    handleAttributeValueChange(selectedOption.value)
                  }
                  options={BOOLEAN_OPTIONS}
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      width: '100%',
                    }),
                  }}
                />
              ),
            }[attributeValueType] || (
              <RuleAttributeValueSelect
                attributeName={attribute?.propertyName}
                attributeType={attributeType}
                defaultValue={attribute?.[`${attributeValueType}Value`]}
                placeholder="Type to search..."
                isDisabled={!attribute || disabled}
                onChange={(selectedOption) =>
                  handleAttributeValueChange(selectedOption.value)
                }
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '100%',
                  }),
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AttributeSelection;
