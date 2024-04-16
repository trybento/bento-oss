import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useFormikContext } from 'formik';
import {
  AttributeType,
  BentoEvents,
  StepAutoCompleteBaseOn,
  StepEventMappingInput,
} from 'bento-common/types';

import AttributeSelection from './AttributeSelection';
import EventSelection from './EventSelection';
import Box from 'system/Box';
import { CustomApiEventTypes } from 'types';
import { StepCompletionFormValues } from 'components/GuideForm/SelectedStep/StepCompletionModal';
import { creatableStylingProps, SelectOptions } from 'system/Select';

import { ExistingOptionsSorted } from '.';
import SelectField from 'components/common/InputFields/SelectField';
import { Button, Flex } from '@chakra-ui/react';

interface Props {
  formKey: string;
  basedOn: StepAutoCompleteBaseOn;
  disabled: boolean;
  eventMapping: StepEventMappingInput;
  existingOptions: ExistingOptionsSorted;
  createNewOption: (newOpt: string, type: CustomApiEventTypes) => void;
}

/** Form for creating auto-complete rules */
const ConditionFields = (props: Props) => {
  const {
    basedOn,
    formKey,
    eventMapping,
    disabled,
    existingOptions,
    createNewOption, // TODO: Clean createNewOption since it's deprecated.
  } = props;

  const { eventName, rules, completeForWholeAccount } = eventMapping;
  const eventSelectionKey = useRef(0);

  const { setFieldValue } = useFormikContext<StepCompletionFormValues>();

  const [eventPropertiesCount, setEventPropertiesCount] = useState<number>(
    rules?.length || 0
  );

  useEffect(() => {
    setEventPropertiesCount(rules?.length || 0);
  }, [rules]);

  const selectedEventName = useMemo(
    () =>
      (existingOptions.events || []).find(
        (option) => option.value === eventName
      ),
    [existingOptions, eventName, completeForWholeAccount]
  );

  const handleEventNameChange = useCallback(
    ({ value }: SelectOptions) => {
      setFieldValue(`${formKey}.eventName`, value);
      /**
       * Note: There doesn't seem to be a way to determine
       * if the event is account/accountUser. Trigger is based
       * on the guide type.
       */
      setFieldValue('completeForWholeAccount', false);
    },
    [setFieldValue, formKey]
  );

  const handleDeleteEventPropertyLocal = useCallback(
    (index: number) => {
      setFieldValue(
        `${formKey}.rules`,
        eventMapping.rules.filter((_rule, idx) => idx !== index)
      );

      setEventPropertiesCount(eventPropertiesCount - 1);
      eventSelectionKey.current = Math.random();
    },
    [setFieldValue, formKey, eventPropertiesCount]
  );

  const handleAttributeSelected = useCallback(
    (type: AttributeType) => {
      setFieldValue(
        `${formKey}.eventName`,
        type === AttributeType.account ? BentoEvents.account : BentoEvents.user
      );
      setFieldValue(
        `${formKey}.completeForWholeAccount`,
        type === AttributeType.account
      );
    },
    [setFieldValue, formKey]
  );

  let component = <div />;
  switch (basedOn) {
    case StepAutoCompleteBaseOn.attribute:
      {
        const valueType = rules?.[0]?.valueType || '';
        const attributeType =
          eventName === BentoEvents.account
            ? AttributeType.account
            : AttributeType.accountUser;

        const attribute = {
          propertyName: rules?.[0]?.propertyName,
          ruleType: rules?.[0]?.ruleType,
          valueType,
          [`${valueType}Value`]: rules?.[0]?.[`${valueType}Value`],
        };
        component = (
          <AttributeSelection
            attribute={attribute}
            attributeType={attributeType}
            formKey={`${formKey}.rules[0]`}
            onAttributeSelected={handleAttributeSelected}
          />
        );
      }
      break;

    case StepAutoCompleteBaseOn.event:
      component = (
        <Flex flexDir="column" gap="2" key={eventSelectionKey.current}>
          <Box key={eventName}>
            <SelectField
              {...creatableStylingProps}
              label="When this event is fired"
              variant="secondary"
              defaultValue={selectedEventName?.value}
              noOptionsMessage={() => 'No existing events'}
              onChange={handleEventNameChange}
              disabled={disabled}
              options={existingOptions.events || []}
              placeholder="Type to search..."
              isSearchable
            />
          </Box>

          {[...Array(eventPropertiesCount)].map((_noop, idx) => {
            const valueType = rules?.[idx]?.valueType || '';

            const attribute = {
              propertyName: rules?.[idx]?.propertyName,
              ruleType: rules?.[idx]?.ruleType,
              valueType,
              [`${valueType}Value`]: rules?.[idx]?.[`${valueType}Value`],
            };

            return (
              <EventSelection
                index={idx}
                attribute={attribute}
                onDeleteProperty={handleDeleteEventPropertyLocal}
                formKey={`${formKey}.rules[${idx}]`}
                createNewOption={createNewOption}
                existingOptions={existingOptions.properties || []}
              />
            );
          })}
          <Button
            onClick={() => setEventPropertiesCount(eventPropertiesCount + 1)}
            fontSize="sm"
            mr="auto"
            variant="link"
          >
            Add event property
          </Button>
        </Flex>
      );
      break;

    default:
      break;
  }

  return component;
};

export default ConditionFields;
