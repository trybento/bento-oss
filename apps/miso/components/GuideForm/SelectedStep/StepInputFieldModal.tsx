import React, { useCallback, useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useToast from 'hooks/useToast';

import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Flex,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';

import Box from 'system/Box';
import Button from 'system/Button';
import { Formik, useFormikContext } from 'formik';
import {
  DropdownInputVariation,
  StepInputFieldInput,
} from 'bento-common/types';
import { showErrors } from 'utils/helpers';
import TextField from 'components/common/InputFields/TextField';
import NumberField from 'components/common/InputFields/NumberField';
import { inputConfigs, INPUT_TYPE_OPTIONS } from './SelectedStepInputFields';
import SelectField from 'components/common/InputFields/SelectField';
import { SelectOptions } from 'system/Select';
import SwitchField from 'components/common/InputFields/SwitchField';
import InputModalOptions from './InputModalOptions';

interface StepInputFieldModalProps {
  formKey: string;
  input: StepInputFieldInput;
  isOpen: boolean;
  onClose: (shouldReset: boolean) => void;
  resetOnCancel?: boolean;
  disableRequired?: boolean;
}

export interface StepInputFieldFormValues extends StepInputFieldInput {}

interface StepInputFieldModalContentProps {
  onClose?: () => void;
  isOpen: boolean;
  disableRequired?: boolean;
}

const StepInputFieldModalBody: React.FC<StepInputFieldModalContentProps> = ({
  onClose,
  isOpen,
  disableRequired,
}) => {
  // Step input field modal context.
  const { values, setValues, resetForm, submitForm, dirty, isValid } =
    useFormikContext<StepInputFieldFormValues>();
  const modalKey = useMemo(
    () => `input-modal-${values.entityId}-${values.type}`,
    [values.type]
  );

  const handleClose = useCallback(() => {
    resetForm();
    onClose?.();
  }, [onClose, resetForm]);

  const handleTypeChange = useCallback(
    (selection: SelectOptions) => {
      setValues({
        ...values,
        ...inputConfigs[selection.value].defaultValues,
      });
    },
    [values]
  );

  const handleSubmit = useCallback(() => {
    if (disableRequired && values.settings?.required) {
      /* Enforce optional if we can't set */
      const newValues = cloneDeep(values);
      newValues.settings.required = false;

      setValues(newValues);
    }
    submitForm();
  }, [values, disableRequired]);

  const { field, defaultValues } = inputConfigs[values.type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User input</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          key={modalKey}
          bg="gray.50"
          display="flex"
          flexDir="column"
          gridGap="2"
        >
          <SelectField
            alignment="horizontal"
            variant="secondary"
            label="Input type"
            name="type"
            selectWidth="230px"
            options={INPUT_TYPE_OPTIONS}
            onChange={handleTypeChange}
            defaultValue={values.type}
          />
          <TextField
            {...field.label}
            placeholder={
              field.label.placeholder ||
              defaultValues.label ||
              'For example: First and last name'
            }
            name="label"
            variant="secondary"
            defaultValue={values.label}
            fontSize="sm"
            showRequired
          />
          {field.placeholder && (
            <TextField
              {...field.placeholder}
              placeholder="For example: “E.g. First and last name”"
              name="settings.placeholder"
              variant="secondary"
              defaultValue={values.settings?.placeholder}
              fontSize="sm"
              showRequired
            />
          )}
          {field.variation && (
            <SelectField
              {...field.variation}
              variant="secondary"
              name="settings.variation"
              options={[
                { label: 'Dropdown', value: DropdownInputVariation.dropdown },
                { label: 'Cards', value: DropdownInputVariation.cards },
              ]}
              defaultValue={values.settings?.variation}
            />
          )}
          {field.options && (
            <Flex flexDir="column" gap="2">
              <InputModalOptions mb="2" />
            </Flex>
          )}
          {field.helperText && (
            <TextField
              {...field.helperText}
              placeholder="For example: This field is case sensitive"
              name="settings.helperText"
              variant="secondary"
              defaultValue={values.settings?.helperText}
              fontSize="sm"
              showRequired
            />
          )}
          {(field.minLabel || field.maxLabel) && (
            <Box display="flex" flexDir="row" gridGap="2">
              {field.minLabel && (
                <TextField
                  {...field.minLabel}
                  name="settings.minLabel"
                  variant="secondary"
                  defaultValue={values.settings?.minLabel}
                  fontSize="sm"
                  showRequired
                />
              )}

              {field.maxLabel && (
                <TextField
                  {...field.maxLabel}
                  name="settings.maxLabel"
                  variant="secondary"
                  defaultValue={values.settings?.maxLabel}
                  fontSize="sm"
                  showRequired
                />
              )}
            </Box>
          )}
          {(field.minValue || field.maxValue) && (
            <Box display="flex" flexDir="row" gridGap="2">
              {field.minValue && (
                <NumberField
                  label={field.minValue.label}
                  required={field.minValue.required}
                  inputProps={{
                    min: field.minValue.min,
                    max: field.minValue.max,
                    minimalist: true,
                    defaultValue: values.settings?.minValue,
                  }}
                  name="settings.minValue"
                  variant="secondary"
                  showRequired
                />
              )}
              {field.maxValue && (
                <NumberField
                  label={field.maxValue.label}
                  required={field.maxValue.required}
                  inputProps={{
                    min: field.maxValue.min,
                    max: field.maxValue.max,
                    minimalist: true,
                    defaultValue: values.settings?.maxValue,
                  }}
                  name="settings.maxValue"
                  variant="secondary"
                  showRequired
                />
              )}
            </Box>
          )}
          {field.multiSelect && (
            <SwitchField
              required={field.multiSelect.required}
              checkedOption={{ label: field.multiSelect.label, value: true }}
              uncheckedOption={{ value: false }}
              defaultValue={!!values.settings.multiSelect}
              name="settings.multiSelect"
              variant="secondary"
              fontSize="sm"
            />
          )}
          {field.required && !disableRequired && (
            <SwitchField
              label={field.required.label}
              required={field.required.required}
              checkedOption={{ label: 'Required', value: true }}
              uncheckedOption={{ label: 'Optional', value: false }}
              defaultValue={values.settings.required}
              name="settings.required"
              variant="secondary"
              fontSize="sm"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Box>
              <Button onClick={handleSubmit} isDisabled={!dirty || !isValid}>
                Done
              </Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const StepInputFieldModal: React.FC<StepInputFieldModalProps> = ({
  formKey,
  isOpen,
  onClose,
  input,
  resetOnCancel,
  disableRequired,
}) => {
  // Main form context.
  const { setFieldValue: mainSetFieldValue, values: mainValues } =
    useFormikContext();

  const toast = useToast();

  const initialValues = useMemo(() => input, [input]);

  const validate = useCallback((values: StepInputFieldFormValues) => {
    const errors: { [key: string]: string } = {};

    // Validate required.
    for (const [fieldKey, field] of Object.entries(
      inputConfigs[values.type].field
    )) {
      const fieldValue = values[fieldKey] || values?.settings?.[fieldKey];

      if (
        field.required &&
        (fieldValue === null || fieldValue === undefined || fieldValue === '')
      ) {
        errors.autoComplete = `${field.label} is required`;
      }
    }

    return errors;
  }, []);

  const handleCancel = useCallback(() => {
    onClose?.(resetOnCancel);
  }, [onClose, resetOnCancel]);

  const handleSubmit = useCallback(
    (values: StepInputFieldFormValues) => {
      const errors = validate(values);
      if (Object.keys(errors).length) {
        showErrors(errors, toast);
        return;
      }
      mainSetFieldValue(formKey, values, false);
      onClose?.(false);
    },
    [mainValues, mainSetFieldValue, formKey, onClose]
  );

  if (!isOpen) return null;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validate}
      enableReinitialize={false}
    >
      <StepInputFieldModalBody
        onClose={handleCancel}
        isOpen={isOpen}
        disableRequired={disableRequired}
      />
    </Formik>
  );
};

export default StepInputFieldModal;
