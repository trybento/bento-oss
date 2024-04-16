import React, { useCallback, useEffect, useMemo, useState } from 'react';
import get from 'lodash/get';
import { Box, FormLabel } from '@chakra-ui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import {
  DropdownInputVariation,
  StepInputFieldInput,
  StepInputFieldSettings,
  StepInputFieldType,
  StepType,
  TargetValueType,
} from 'bento-common/types';
import Select, {
  ExtendedSelectOptions,
  OptionWithSubLabel,
  SelectOptions,
} from 'system/Select';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { formatAttribute } from 'components/Customers/Customer/CustomerDetails/CustomerDetails';
import EditSettings from './EditSettings';
import StepInputFieldModal from './StepInputFieldModal';
import useRandomKey from 'bento-common/hooks/useRandomKey';
import { isInputStep } from 'bento-common/data/helpers';
import usePrevious from 'bento-common/hooks/usePrevious';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import { Highlight } from 'components/common/Highlight';
import { pluralize } from 'bento-common/utils/pluralize';
import SeparatorBox from 'components/EditorCommon/SeparatorBox';

interface SelectedStepInputFieldsProps {
  formKey: string;
  onCancel?: (stepType: { value: StepType }) => void;
  disabled?: boolean;
  disableRequired?: boolean;
}

export const StepInputFieldSettingLabels: Record<
  keyof StepInputFieldSettings,
  string
> = {
  required: 'Required',
  placeholder: 'Placeholder',
  minValue: 'Min value',
  minLabel: 'Min label',
  maxValue: 'Max value',
  maxLabel: 'Max label',
  helperText: 'Helper text',
  multiSelect: 'Allow multiple selection',
  variation: 'Show options as',
  options: 'Options',
};

export const inputConfigs: Record<
  StepInputFieldType,
  {
    field: Partial<
      Record<
        | Exclude<keyof StepInputFieldInput, 'settings'>
        | keyof StepInputFieldSettings,
        {
          label: string;
          required?: boolean;
          placeholder?: string;
          min?: number;
          max?: number;
        }
      >
    >;
    defaultValues: Omit<StepInputFieldInput, 'entityId'>;
  }
> = {
  [StepInputFieldType.text]: {
    field: {
      label: { label: 'Label', required: true },
      placeholder: { label: StepInputFieldSettingLabels.placeholder },
      helperText: { label: StepInputFieldSettingLabels.helperText },
      required: { label: '', required: true },
    },
    defaultValues: {
      type: StepInputFieldType.text,
      label: '',
      settings: { placeholder: '', required: true },
    },
  },
  [StepInputFieldType.paragraph]: {
    field: {
      label: { label: 'Label', required: true },
      placeholder: { label: StepInputFieldSettingLabels.placeholder },
      helperText: { label: StepInputFieldSettingLabels.helperText },
      required: { label: '', required: true },
    },
    defaultValues: {
      type: StepInputFieldType.paragraph,
      label: '',
      settings: { placeholder: '', required: true },
    },
  },
  [StepInputFieldType.email]: {
    field: {
      label: { label: 'Label', required: true },
      placeholder: { label: StepInputFieldSettingLabels.placeholder },
      helperText: { label: StepInputFieldSettingLabels.helperText },
      required: { label: '', required: true },
    },
    defaultValues: {
      type: StepInputFieldType.email,
      label: 'Email',
      settings: { placeholder: '', required: true },
    },
  },
  [StepInputFieldType.nps]: {
    field: {
      label: { label: 'NPS question' },
      required: { label: '', required: true },
    },
    defaultValues: {
      type: StepInputFieldType.nps,
      label: 'How likely are you to recommend us?',
      settings: { required: true },
    },
  },
  [StepInputFieldType.numberPoll]: {
    field: {
      label: { label: 'Poll question' },
      minLabel: {
        label: StepInputFieldSettingLabels.minLabel,
      },
      maxLabel: {
        label: StepInputFieldSettingLabels.maxLabel,
      },
      minValue: {
        label: StepInputFieldSettingLabels.minValue,
        required: true,
        min: 0,
        max: 9,
      },
      maxValue: {
        label: StepInputFieldSettingLabels.maxValue,
        required: true,
        min: 1,
        max: 10,
      },
      required: { label: '', required: true },
    },
    defaultValues: {
      type: StepInputFieldType.numberPoll,
      label: 'How would you rate the experience?',
      settings: {
        minValue: 0,
        maxValue: 10,
        required: true,
      },
    },
  },
  [StepInputFieldType.dropdown]: {
    field: {
      label: {
        label: 'Label',
        placeholder: 'Which of these features do you want to try?',
      },
      options: { label: '', required: true },
      multiSelect: { label: StepInputFieldSettingLabels.multiSelect },
      variation: {
        label: StepInputFieldSettingLabels.variation,
        required: true,
      },
      required: { label: '', required: true },
    },
    defaultValues: {
      type: StepInputFieldType.dropdown,
      label: '',
      settings: {
        multiSelect: true,
        variation: DropdownInputVariation.dropdown,
        options: [{ label: '', value: '' }],
        required: false,
      },
    },
  },
  [StepInputFieldType.date]: {
    field: {
      label: { label: 'Label', required: true, placeholder: ' ' },
    },
    defaultValues: {
      type: StepInputFieldType.date,
      label: '',
      settings: {
        required: false,
      },
    },
  },
};

export const INPUT_TYPE_OPTIONS: ExtendedSelectOptions[] = [
  {
    label: 'Short text (100 char)',
    value: StepInputFieldType.text,
  },
  {
    label: 'Paragraph',
    value: StepInputFieldType.paragraph,
  },
  {
    label: 'Email',
    value: StepInputFieldType.email,
  },
  {
    label: 'NPS',
    value: StepInputFieldType.nps,
  },
  {
    label: 'Number poll',
    value: StepInputFieldType.numberPoll,
  },
  { label: 'Multiple choice', value: StepInputFieldType.dropdown },
  { label: 'Date', value: StepInputFieldType.date },
];

const InputFieldDetails: React.FC<{
  input: StepInputFieldInput;
}> = ({ input: { entityId, type, label, settings } }) => {
  const ignoredKeys = useMemo(() => ['required'], []);

  return (
    <Box display="flex" flexDir="column" gridGap="4px" fontSize="xs">
      <Box display="flex">
        <Box my="auto" minW="80px">
          Label
        </Box>
        <Highlight>{label || 'none'}</Highlight>
      </Box>
      {settings
        ? Object.keys(settings).map((key) => {
            const settingLabel = StepInputFieldSettingLabels[key];
            const showField = !!inputConfigs[type].field[key];

            if (
              !showField ||
              settings[key] === undefined ||
              settings[key] === null ||
              settings[key] === '' ||
              ignoredKeys.includes(key)
            )
              return null;

            const settingValue = Array.isArray(settings[key])
              ? `${settings[key].length} ${pluralize(
                  settings[key].length,
                  'option'
                )}`
              : formatAttribute(
                  settings[key],
                  typeof settings[key] as TargetValueType
                );

            return (
              <Box
                display="flex"
                key={`input-setting-${entityId}-${key}-${settingValue}`}
              >
                <Box my="auto" minW="80px" mr="1">
                  {settingLabel}
                </Box>
                <Highlight>{settingValue}</Highlight>
              </Box>
            );
          })
        : null}
    </Box>
  );
};

const SelectedStepInputFields: React.FC<SelectedStepInputFieldsProps> = ({
  formKey,
  onCancel,
  disabled,
  disableRequired,
}) => {
  // TODO: Make generic type for reusable components.
  // Main form context.
  const { values, setFieldValue } = useFormikContext<object>();
  const [modalState, setModalState] = useState<{
    input: StepInputFieldInput | null;
    fieldKey: string;
    originalStepType?: StepType;
  }>({ input: null, fieldKey: '' });
  const step = get(values, formKey);
  const modalKey = useRandomKey([modalState]);
  const [shouldShow, setShouldShow] = useState<boolean>(
    isInputStep(step.stepType)
  );

  const handleOpenModal = useCallback(
    (
        input: StepInputFieldInput,
        fieldKey: string,
        originalStepType?: StepType
      ) =>
      () => {
        setModalState({ input, fieldKey, originalStepType });
      },
    []
  );

  const previousStepType = usePrevious(step.stepType);

  useEffect(() => {
    if (
      !step.stepType ||
      !previousStepType ||
      step.stepType === previousStepType
    )
      return;

    const showInputs = isInputStep(step.stepType);

    if (!showInputs) {
      setFieldValue(`${formKey}.inputs`, []);
    } else {
      const newInput = inputConfigs[StepInputFieldType.text].defaultValues;
      handleOpenModal(newInput, `${formKey}.inputs[0]`, previousStepType)();
    }

    setShouldShow(showInputs);
  }, [step.stepType]);

  const selectedTypeOptions = useMemo<Record<number, ExtendedSelectOptions>>(
    () =>
      (step.inputs || []).reduce((acc, input, idx) => {
        acc[idx] = INPUT_TYPE_OPTIONS.find((o) => o.value === input.type);
        return acc;
      }, {}),
    [step.inputs]
  );

  const handleCloseModal = useCallback(
    (shouldReset: boolean) => {
      if (shouldReset && modalState.originalStepType) {
        onCancel?.({ value: modalState.originalStepType });
      }
      setModalState({ input: null, fieldKey: '' });
    },
    [setFieldValue, modalState, onCancel]
  );

  const handleTypeChange = useCallback(
    ({ entityId, label }: StepInputFieldInput, fieldKey: string) =>
      ({ value }: SelectOptions) => {
        setFieldValue(fieldKey, {
          entityId,
          ...inputConfigs[value as StepInputFieldType].defaultValues,
          ...(label ? { label } : {}),
        });
      },
    [step.inputs]
  );

  const handleCreateInputField = useCallback(() => {
    const newInput = inputConfigs[StepInputFieldType.text].defaultValues;
    const newIdx = step?.inputs?.length || 0;
    handleOpenModal(newInput, `${formKey}.inputs[${newIdx}]`)();
  }, [step.inputs, formKey]);

  const handleDelete = useCallback(
    (remove: FieldArrayRenderProps['remove'], idx: number) =>
      step.inputs?.length > 1
        ? () => {
            remove(idx);
          }
        : undefined,
    [step.inputs]
  );

  if (!shouldShow) return null;

  return (
    <>
      <FieldArray
        name={`${formKey}.inputs`}
        render={({ remove }) => (
          <SeparatorBox flexDir="column" gap="2">
            {(step.inputs || []).map((input: StepInputFieldInput, idx) => {
              const fieldKey = `${formKey}.inputs[${idx}]`;
              const editSettingsLabel = input.settings?.required
                ? 'Required input'
                : 'Optional input';
              const deleteAction = disabled
                ? undefined
                : handleDelete(remove, idx);

              return (
                <Box
                  key={fieldKey}
                  className="row-container"
                  position="relative"
                >
                  <Box display="flex" flexDir="column">
                    <Box display="flex" flexDir="row">
                      <FormLabel my="auto" variant="secondary">
                        Input (shows at the end of the step)
                      </FormLabel>
                      <Box ml="auto" my="auto" w="230px">
                        <Select
                          isSearchable={false}
                          isDisabled={disabled}
                          options={INPUT_TYPE_OPTIONS}
                          value={selectedTypeOptions[idx]}
                          menuPortalTarget={document.body}
                          menuPlacement="auto"
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              width: '350px',
                              right: 0,
                            }),
                          }}
                          onChange={handleTypeChange(input, fieldKey)}
                          components={{
                            Option: OptionWithSubLabel(),
                          }}
                        />
                      </Box>
                    </Box>
                    <Box
                      mt="2"
                      bg="gray.50"
                      borderRadius="sm"
                      px="2"
                      py="3"
                      display="flex"
                      flexDir="column"
                    >
                      <EditSettings
                        label={editSettingsLabel}
                        isDisabled={disabled}
                        onEdit={handleOpenModal(input, fieldKey)}
                      >
                        <InputFieldDetails input={input} />
                      </EditSettings>
                    </Box>
                  </Box>
                  {deleteAction && (
                    <Box
                      className="row-hoverable-btn-80"
                      position="absolute"
                      right="-22px"
                      top="7px"
                      color="gray.600"
                      cursor="pointer"
                      w="20px"
                      my="auto"
                      onClick={deleteAction}
                    >
                      <DeleteIcon style={{ width: 'inherit' }} />
                    </Box>
                  )}
                </Box>
              );
            })}
            {!disabled && (
              <Box
                display="flex"
                alignItems="center"
                color="bento.bright"
                cursor="pointer"
                opacity="1"
                _hover={{ opacity: '0.8' }}
                mt="2"
                ml="auto"
                onClick={handleCreateInputField}
              >
                <AddCircleOutlineIcon
                  style={{
                    color: 'inherit',
                    width: '20px',
                  }}
                />
                <Box fontSize="xs" ml="2" fontWeight="bold">
                  Add input
                </Box>
              </Box>
            )}
          </SeparatorBox>
        )}
      />
      <StepInputFieldModal
        key={modalKey}
        formKey={modalState.fieldKey}
        onClose={handleCloseModal}
        isOpen={!!modalState.input}
        input={modalState.input}
        resetOnCancel={!step.inputs?.length}
        disableRequired={disableRequired}
      />
    </>
  );
};

export default withTemplateDisabled<SelectedStepInputFieldsProps>(
  SelectedStepInputFields
);
