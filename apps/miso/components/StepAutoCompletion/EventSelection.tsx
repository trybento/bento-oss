import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash/debounce';
import { useFormikContext } from 'formik';
import { FormLabel } from '@chakra-ui/react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import Box from 'system/Box';
import Input from 'system/Input';
import Select, { SelectOptions } from 'system/Select';
import {
  getRuleConditions,
  BOOLEAN_OPTIONS,
  ATTRIBUTE_VALUE_TYPE_OPTIONS,
  getIsRuleIncomplete,
} from './helpers';
import DatePicker from 'components/DatePicker';
import { CustomApiEventTypes } from 'types';
import { StepCompletionFormValues } from 'components/GuideForm/SelectedStep/StepCompletionModal';
import SeparatorBox from 'components/EditorCommon/SeparatorBox';
import { QUERY_DEBOUNCE_DELAY } from 'helpers/constants';

interface AttributeSelectionProps {
  index: number;
  formKey: string;
  onDeleteProperty?: (index: number) => void;
  createNewOption: (newOpt: string, type: CustomApiEventTypes) => void;
  existingOptions: SelectOptions[];
  disabled?: boolean;
  attribute: any;
}

const formatDateValue = (dateValue) => {
  let result = dateValue;

  if (typeof dateValue === 'string' && dateValue !== '') {
    result = new Date(dateValue);
  }

  return result;
};

const EventSelection = (props: AttributeSelectionProps) => {
  const {
    index,
    formKey,
    onDeleteProperty,
    disabled,
    attribute,
    createNewOption,
    existingOptions,
  } = props;

  const { setFieldValue, isSubmitting } =
    useFormikContext<StepCompletionFormValues>();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const keyRef = useRef(0);

  const [isAnyFieldEmpty, setIsAnyFieldEmtpy] = useState<boolean>(false);
  const attributeValueType = attribute?.valueType || '';
  const attributeValue = attribute?.[`${attributeValueType}Value`];
  const attributeValueKey = `${formKey}.[${attributeValueType}Value]`;
  const ruleOptions = useMemo(
    () => getRuleConditions(attributeValueType),
    [attributeValueType]
  );

  const handleAttributeValueChange = (value) => {
    if (!attributeValueType) return;

    let _value = value;

    if (attributeValueType === 'number') {
      _value = Number(value);
    }

    setFieldValue(attributeValueKey, _value);
  };

  const handleResetAttribute = (selectedValueType) => {
    setFieldValue(
      `${formKey}.ruleType`,
      selectedValueType === 'text' || selectedValueType === 'boolean'
        ? 'eq'
        : null
    );

    ATTRIBUTE_VALUE_TYPE_OPTIONS.forEach((option) => {
      setFieldValue(`${formKey}.${option.value}Value`, null);
    });
  };

  const handleDeleteProperty = () => {
    if (onDeleteProperty) {
      onDeleteProperty(index);
    }
  };

  const debouncedPropertyNameChange = useCallback(
    debounce((newValue: string) => {
      setFieldValue(`${formKey}.propertyName`, newValue);
    }, QUERY_DEBOUNCE_DELAY),
    []
  );

  const debouncedInputValueChange = useCallback(
    debounce((newValue: string) => {
      handleAttributeValueChange(newValue);
    }, QUERY_DEBOUNCE_DELAY),
    [attributeValueType]
  );

  useEffect(() => {
    if (isSubmitting && attribute) {
      setIsAnyFieldEmtpy(getIsRuleIncomplete(attribute));
    }
  }, [isSubmitting]);

  return (
    <SeparatorBox
      key={keyRef.current}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="secondary"
      display="block"
    >
      <Box display="flex" flexFlow="column" gridGap="2">
        <Box display="flex" gridGap="2">
          <Box flex="1">
            <Box mb="1" display="flex">
              <FormLabel variant="secondary">Property name</FormLabel>
              <Box width="20px" height="20px" ml="auto">
                {isHovered && !disabled ? (
                  <Box
                    color="gray.600"
                    opacity=".4"
                    _hover={{ opacity: '.8' }}
                    cursor="pointer"
                    onClick={() => (disabled ? null : handleDeleteProperty())}
                  >
                    <DeleteIcon />
                  </Box>
                ) : null}
              </Box>
            </Box>
            <Select
              defaultValue={existingOptions.find(
                (opt) => opt.value === attribute?.propertyName
              )}
              noOptionsMessage={() => 'No existing attributes'}
              onChange={({ value }) => {
                debouncedPropertyNameChange(value);
              }}
              isDisabled={disabled}
              options={existingOptions || []}
              onCreateOption={(o) => {
                createNewOption(o, CustomApiEventTypes.EventProperty);
                setFieldValue(`${formKey}.propertyName`, o);
              }}
              placeholder="Type to search or create..."
              isCreatable
            />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" gridGap="2">
            <Box flex="1">
              <FormLabel variant="secondary">Type</FormLabel>
              <Select
                isSearchable={false}
                value={ATTRIBUTE_VALUE_TYPE_OPTIONS.find(
                  (option) => option.value === attributeValueType
                )}
                isDisabled={!attribute || disabled}
                onChange={(selectedOption) => {
                  handleResetAttribute(selectedOption.value);
                  setFieldValue(`${formKey}.valueType`, selectedOption.value);
                  keyRef.current = Math.random();
                }}
                options={ATTRIBUTE_VALUE_TYPE_OPTIONS}
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '100%',
                  }),
                }}
              />
            </Box>
            <Box width="150px" flex="1">
              <FormLabel variant="secondary">Condition</FormLabel>
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
            <Box display="flex" flexDir="column" flex="1.5">
              <FormLabel variant="secondary">Value</FormLabel>
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
                        option.value ===
                        attribute?.[`${attributeValueType}Value`]
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
                <Input
                  isDisabled={!attribute || disabled || !attributeValueType}
                  defaultValue={attributeValue}
                  onChange={(e) => debouncedInputValueChange(e.target.value)}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {isAnyFieldEmpty && (
        <Box color="red.500" mt="1">
          Property values cannot be empty
        </Box>
      )}
    </SeparatorBox>
  );
};

export default EventSelection;
