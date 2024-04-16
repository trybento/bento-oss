import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Box from 'system/Box';
import {
  ExtendedSelectOptions,
  OptionWithSubLabel,
  SelectOptions,
} from 'system/Select';
import useToast from 'hooks/useToast';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import {
  StepAutoCompleteBaseOn,
  StepCompletion,
  Interval,
  StepEventMappingInput,
  VisualBuilderSessionType,
  GuideFormFactor,
} from 'bento-common/types';
import { AutoCompleteInteractionType } from 'bento-common/types/stepAutoComplete';
import { isFlowGuide } from 'bento-common/utils/formFactor';

import {
  BASED_ON_OPTIONS,
  breakApartCustomEvents,
  createNewExistingOption,
  getBasedOnOption,
} from './helpers';
import { CustomApiEventTypes } from 'types';
import ConditionFields from './ConditionFields';
import { StepCompletionFormValues } from 'components/GuideForm/SelectedStep/StepCompletionModal';
import { useCustomApiEvents } from 'providers/CustomApiEventsProvider';
import RadioGroupField from 'components/common/InputFields/RadioGroupField';
import SwitchField from 'components/common/InputFields/SwitchField';
import GuideSelection from './GuideSelection';
import { Button, Flex } from '@chakra-ui/react';
import { COMPLETION_OPTIONS } from 'helpers/constants';
import useSuccessfulInstallation from 'queries/OrgSuccessfulInstallation';
import { WysiwygEditorAction } from 'components/WysiwygEditor/utils';
import pick from 'lodash/pick';
import { WYSIWYG_EDITOR_GUIDE_CONFIRMATION } from 'components/WysiwygEditor/constants';
import EditSettings from 'components/GuideForm/SelectedStep/EditSettings';
import ButtonInteractionDetails from 'components/GuideForm/SelectedStep/ButtonInteractionDetails';
import SelectField from 'components/common/InputFields/SelectField';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import ExtensionRequiredTooltip from 'components/WysiwygEditor/ExtensionRequiredTooltip';
import { useVisualBuilder } from 'providers/VisualBuilderProvider';

export interface ExistingOptionsSorted {
  events: SelectOptions[];
  properties: SelectOptions[];
}

const defaultAutoCompleteEvent: StepEventMappingInput = {
  eventName: '',
  rules: [],
  completeForWholeAccount: false,
};

interface StepAutoCompletionProps {
  disabled?: boolean;
  defaultNewUrl?: string;
  /** Which form factor this should affect */
  formFactor: GuideFormFactor;
}

const StepAutoCompletion = ({
  disabled,
  defaultNewUrl,
  formFactor,
}: StepAutoCompletionProps) => {
  const { launchVisualBuilderSession } = useVisualBuilder();
  const successfulInstallation = useSuccessfulInstallation();
  const toast = useToast();
  const autoCompleteInteractionSaveInterval = useRef<Interval>();
  const extension = useChromeExtensionInstalled();
  const isFlow = isFlowGuide(formFactor);

  const {
    values: {
      eventMappings,
      existingEventNames,
      manualCompletionDisabled,
      autoCompleteInteractions,
      autoCompleteInteraction,
      stepCompletionType,
    },
    setFieldValue,
  } = useFormikContext<StepCompletionFormValues>();

  const options = useMemo(
    () =>
      !successfulInstallation
        ? COMPLETION_OPTIONS.map((opt) =>
            opt.value === StepCompletion.autoInteraction
              ? { ...opt, isDisabled: true }
              : opt
          )
        : COMPLETION_OPTIONS,
    [successfulInstallation]
  );

  const selectedStepCompletionOption = useMemo<ExtendedSelectOptions>(
    () => COMPLETION_OPTIONS.find((o) => o.value === stepCompletionType),
    [stepCompletionType]
  );

  const { trackCreatedApiEvent } = useCustomApiEvents();

  /** Needs to include what we have selected if it's not in the server response */
  const existingEventNamesOptions = useMemo(() => {
    const existing =
      existingEventNames?.map((v) => ({
        label: v.name,
        value: v.name,
        type: v.type,
      })) ?? [];

    return (eventMappings || []).reduce((acc, eventMapping) => {
      if (
        eventMapping.eventName &&
        !acc.some((option) => option.value === eventMapping.eventName)
      ) {
        acc = [
          { label: eventMapping.eventName, value: eventMapping.eventName },
          ...acc,
        ];
      }
      return acc;
    }, existing as SelectOptions[]);
  }, [existingEventNames, eventMappings]);

  const [selectedBasedOn, setSelectedBasedOn] = useState<
    StepAutoCompleteBaseOn | undefined
  >(() => {
    const eventBasedOption = getBasedOnOption(eventMappings?.[0]?.eventName);
    if (!eventBasedOption) {
      return autoCompleteInteractions?.length
        ? StepAutoCompleteBaseOn.guide
        : undefined;
    }
    return eventBasedOption;
  });

  const [existingOptions, setExistingOptions] = useState<ExistingOptionsSorted>(
    breakApartCustomEvents(existingEventNamesOptions)
  );

  const handleBasedOnChange = useCallback(
    (selectedOption: StepAutoCompleteBaseOn) => {
      setSelectedBasedOn(selectedOption);
      switch (selectedOption) {
        case StepAutoCompleteBaseOn.guide:
          setFieldValue('eventMappings', []);
          break;

        default:
          setFieldValue('eventMappings', [defaultAutoCompleteEvent]);
          setFieldValue('autoCompleteInteractions', []);
          break;
      }
    },
    [setFieldValue]
  );

  const addEvent = useCallback(
    (push: FieldArrayRenderProps['push']) => () => {
      push(defaultAutoCompleteEvent);
    },
    []
  );

  const deleteEvent = useCallback(
    (remove: FieldArrayRenderProps['remove'], idx: number) => () => {
      remove(idx);
    },
    []
  );

  const createNewOption = useCallback(
    (newOption: string, type: CustomApiEventTypes) => {
      const newExistingOptions = createNewExistingOption(
        newOption,
        existingOptions,
        type
      );

      trackCreatedApiEvent(newOption, type);
      setExistingOptions(newExistingOptions);
    },
    [existingOptions]
  );

  const handleGuideSelected = useCallback(
    ({ value: templateEntityId }: SelectOptions) => {
      setFieldValue(`autoCompleteInteractions[0]`, {
        interactionType: AutoCompleteInteractionType.guideCompletion,
        templateEntityId,
      });
    },
    [setFieldValue]
  );

  const handleStepCompletionChange = useCallback(
    ({ value }: SelectOptions<StepCompletion>) => {
      setFieldValue('stepCompletionType', value);
      switch (value) {
        case StepCompletion.auto: {
          // Show events UI.
          break;
        }

        case StepCompletion.autoInteraction: {
          // Show wysiwyg editor and UI.
          break;
        }

        default: {
          // Show maual UI. Reset step data.
          break;
        }
      }
    },
    []
  );

  const openAutoCompleteInteractionEditor = useCallback(async () => {
    const action = autoCompleteInteraction?.url
      ? WysiwygEditorAction.edit
      : WysiwygEditorAction.create;

    const progressData = await launchVisualBuilderSession({
      type: VisualBuilderSessionType.Autocomplete,
      baseUrl: `/autocomplete-element/${action}`,
      initialData: autoCompleteInteraction?.url
        ? autoCompleteInteraction
        : { url: defaultNewUrl },
    });

    if (progressData) {
      setFieldValue('autoCompleteInteraction', {
        ...pick(progressData, [
          'url',
          'wildcardUrl',
          'elementSelector',
          'elementText',
          'elementHtml',
        ]),
        type: progressData.data.type,
      });
      toast({
        title: WYSIWYG_EDITOR_GUIDE_CONFIRMATION,
        isClosable: true,
        status: 'info',
        duration: 7000,
      });
    }
  }, [autoCompleteInteraction, defaultNewUrl]);

  useEffect(() => {
    return () => {
      // clear the interval if one still exists
      autoCompleteInteractionSaveInterval.current &&
        clearInterval(autoCompleteInteractionSaveInterval.current);
    };
  }, []);

  return (
    <Flex flexDir="column">
      <SelectField
        isSearchable={false}
        label="Step completion"
        variant="secondary"
        options={options}
        defaultValue={selectedStepCompletionOption?.value}
        disabled={disabled}
        onChange={handleStepCompletionChange}
        components={{ Option: OptionWithSubLabel() }}
      />
      {selectedStepCompletionOption?.value &&
        selectedStepCompletionOption.value !== StepCompletion.manual &&
        !isFlow && (
          <SwitchField
            name="manualCompletionDisabled"
            my="4"
            defaultValue={manualCompletionDisabled}
            checkedOption={{
              value: false,
              label: 'Allow users to manually complete/uncomplete',
            }}
            uncheckedOption={{
              value: true,
            }}
            as="checkbox"
          />
        )}
      {selectedStepCompletionOption?.value ===
        StepCompletion.autoInteraction && (
        <Flex bg="gray.50" p="4" mt="4">
          {autoCompleteInteraction ? (
            <EditSettings
              label="Button definition"
              editLabel="Edit in app"
              isDisabled={disabled}
              onEdit={openAutoCompleteInteractionEditor}
              w="full"
              requiresChromeExtension={true}
            >
              <ButtonInteractionDetails
                autoCompleteInteraction={autoCompleteInteraction}
              />
            </EditSettings>
          ) : (
            <ExtensionRequiredTooltip
              isDisabled={extension.installed}
              withPortal={false}
            >
              <Button
                variant="link"
                display="flex"
                size="sm"
                onClick={openAutoCompleteInteractionEditor}
                isDisabled={!extension.installed}
              >
                <OpenInNew fontSize="small" />{' '}
                <Box ml="1">Set button definition in your app</Box>
              </Button>
            </ExtensionRequiredTooltip>
          )}
        </Flex>
      )}
      {selectedStepCompletionOption?.value === StepCompletion.auto && (
        <>
          <RadioGroupField
            alignment="horizontal"
            name="basedOn"
            variant="secondary"
            fontSize="sm"
            my="4"
            defaultValue={selectedBasedOn}
            label="Complete step based on:"
            onChange={handleBasedOnChange}
            options={BASED_ON_OPTIONS}
          />
          <FieldArray
            name="eventMappings"
            render={({ push, remove }) => (
              <Box display="flex" flexDir="column" gridGap="4">
                {(eventMappings || []).map((eventMapping, idx) => (
                  <React.Fragment key={`event-mappins-item-${idx}`}>
                    {idx !== 0 && (
                      <Box display="flex" gridGap="4">
                        <Box fontSize="md" fontWeight="bold">
                          OR
                        </Box>
                        <Box
                          borderTop="1px solid"
                          my="auto"
                          borderColor="gray.200"
                          w="full"
                        />
                      </Box>
                    )}
                    <Box
                      mt={2}
                      display="flex"
                      flexFlow="column"
                      style={{ gap: '8px' }}
                    >
                      <Box display="flex" style={{ gap: '8px' }}>
                        <Box flex={1.5}>
                          <Box className="hoverable-row" position="relative">
                            <ConditionFields
                              formKey={`eventMappings[${idx}]`}
                              eventMapping={eventMapping}
                              basedOn={selectedBasedOn}
                              disabled={disabled}
                              existingOptions={{
                                events: existingOptions.events,
                                properties: existingOptions.properties,
                              }}
                              createNewOption={createNewOption}
                            />
                            {eventMappings.length > 1 && (
                              <Box
                                className="hoverable-row-hidden"
                                width="20px"
                                height="20px"
                                ml="auto"
                                position="absolute"
                                top="0"
                                right="0"
                              >
                                <Box
                                  color="gray.600"
                                  opacity=".4"
                                  _hover={{ opacity: '.8' }}
                                  cursor="pointer"
                                  onClick={deleteEvent(remove, idx)}
                                >
                                  <DeleteIcon />
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </React.Fragment>
                ))}
                {selectedBasedOn === StepAutoCompleteBaseOn.event && (
                  <Flex>
                    <Button mt="4" variant="secondary" onClick={addEvent(push)}>
                      Add event
                    </Button>
                  </Flex>
                )}
              </Box>
            )}
          />

          {selectedBasedOn === StepAutoCompleteBaseOn.guide && (
            <GuideSelection onChange={handleGuideSelected} />
          )}
        </>
      )}
    </Flex>
  );
};

export default StepAutoCompletion;
