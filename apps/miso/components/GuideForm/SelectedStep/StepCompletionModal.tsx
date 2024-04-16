import React, { useCallback, useMemo } from 'react';
import { Formik, useFormikContext } from 'formik';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import {
  any,
  array,
  assert,
  boolean,
  Describe,
  optional,
  StructError,
  type,
} from 'superstruct';
import {
  BentoEvents,
  GuideFormFactor,
  StepAutoCompleteInteractionInput,
  StepCompletion,
  StepEventMappingInput,
} from 'bento-common/types';
import { StepAutoCompleteInteraction } from 'bento-common/types/stepAutoComplete';
import {
  StepAutoCompleteDetailsInputSchema,
  StepAutoCompleteInteractionsInputSchema,
} from 'bento-common/validation/stepAutoComplete.schema';

import useToast from 'hooks/useToast';
import Box from 'system/Box';
import Button from 'system/Button';
import ModalBody from 'system/ModalBody';
import StepAutoCompletion from 'components/StepAutoCompletion';
import { CustomApiEvent } from 'types';
import { showErrors } from 'utils/helpers';
import { getIsAnyStepAutoCompleteRuleIncomplete } from 'components/StepAutoCompletion/helpers';

interface StepCompletionModalProps
  extends StepCompletionFormValues,
    StepCompletionModalContentProps {
  formKey: string;
  formFactor: GuideFormFactor;
}

export interface StepCompletionFormValues {
  stepCompletionType: StepCompletion;
  manualCompletionDisabled: boolean;
  eventMappings: StepEventMappingInput[];
  existingEventNames: CustomApiEvent[];
  autoCompleteInteraction: StepAutoCompleteInteractionInput | undefined;
  autoCompleteInteractions: StepAutoCompleteInteraction[];
}

interface StepCompletionModalContentProps {
  onClose: () => void;
  isOpen: boolean;
  /**
   * Used to auto populate the WYSIWYG entry point
   * for new interactions.
   */
  defaultNewUrl?: string;
  /** Which form factor this should affect */
  formFactor: GuideFormFactor;
}

const AutoInteractionFormValuesSchema: Describe<
  Pick<
    StepCompletionFormValues,
    'autoCompleteInteraction' | 'manualCompletionDisabled'
  >
> = type({
  manualCompletionDisabled: optional(boolean()),
  autoCompleteInteraction: optional(StepAutoCompleteDetailsInputSchema),
});

const AutoFormValuesSchema: Describe<
  Pick<
    StepCompletionFormValues,
    | 'manualCompletionDisabled'
    | 'eventMappings'
    | 'existingEventNames'
    | 'autoCompleteInteractions'
  >
> = type({
  manualCompletionDisabled: optional(boolean()),
  eventMappings: array(any()),
  existingEventNames: array(any()),
  autoCompleteInteractions: StepAutoCompleteInteractionsInputSchema,
});

const StepCompletionModalBody: React.FC<StepCompletionModalContentProps> = ({
  onClose,
  isOpen,
  defaultNewUrl,
  formFactor,
}) => {
  // Step completion modal context.
  const { resetForm, submitForm, dirty, isValid } =
    useFormikContext<StepCompletionFormValues>();

  const handleClose = useCallback(() => {
    resetForm();
    onClose?.();
  }, [onClose, resetForm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      scrollBehavior="outside"
      closeOnEsc={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Step completion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StepAutoCompletion
            defaultNewUrl={defaultNewUrl}
            formFactor={formFactor}
          />
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Box>
              <Button onClick={submitForm} isDisabled={!dirty || !isValid}>
                Done
              </Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// TODO: Set max height and scroll.
// Note: Scroll with max-height hides Select menu.
const StepCompletionModal: React.FC<StepCompletionModalProps> = ({
  formKey,
  isOpen,
  onClose,
  manualCompletionDisabled,
  eventMappings,
  existingEventNames,
  autoCompleteInteractions = [],
  autoCompleteInteraction,
  stepCompletionType,
  defaultNewUrl,
  formFactor,
}) => {
  // Main form context.
  const { setFieldValue: mainSetFieldValue } = useFormikContext();

  const toast = useToast();

  const initialValues = useMemo<StepCompletionFormValues>(
    () => ({
      manualCompletionDisabled,
      eventMappings,
      existingEventNames,
      autoCompleteInteractions,
      stepCompletionType,
      autoCompleteInteraction,
    }),
    [
      eventMappings,
      existingEventNames,
      manualCompletionDisabled,
      autoCompleteInteractions,
      autoCompleteInteraction,
      stepCompletionType,
    ]
  );

  const validate = useCallback((values: StepCompletionFormValues) => {
    const { autoCompleteInteractions, eventMappings } = values;

    try {
      if (values.stepCompletionType === StepCompletion.auto)
        assert(values, AutoFormValuesSchema);

      if (values.stepCompletionType === StepCompletion.autoInteraction)
        assert(values, AutoInteractionFormValuesSchema);
    } catch (innerError) {
      if (innerError instanceof StructError) {
        return innerError
          .failures()
          .map((f) => `At path: ${f.path} -- ${f.message}`);
      }
      // rethrow
      throw innerError;
    }

    if (values.stepCompletionType === StepCompletion.auto) {
      if (!autoCompleteInteractions.length && !eventMappings.length) {
        return { autoComplete: 'Step completion set-up incomplete' };
      }

      /** @todo refactor using superstruct */
      return eventMappings.reduce((acc, eventMapping, idx) => {
        if (!eventMapping) return acc;

        const { eventName, rules } = eventMapping;

        if (!eventName) {
          acc[`autoComplete-${idx}`] = 'Step completion set-up incomplete';
        } else if (
          // Validate empty attributes for Bento events.
          (eventName === BentoEvents.account ||
            eventName === BentoEvents.user) &&
          getIsAnyStepAutoCompleteRuleIncomplete([
            { eventMappings: [{ rules, eventName }] },
          ])
        ) {
          acc[`autoComplete-${idx}`] =
            'Step auto-complete properties cannot be empty';
        } else if (
          // Validate custom events only when there is 1 or more attributes.
          (rules || []).length > 0 &&
          getIsAnyStepAutoCompleteRuleIncomplete([
            { eventMappings: [{ rules, eventName }] },
          ])
        ) {
          acc[`autoComplete-${idx}`] =
            'Step auto-complete properties cannot be empty';
        }

        return acc;
      }, {} as { [key: string]: string });
    }

    if (values.stepCompletionType === StepCompletion.autoInteraction) {
      if (!values.autoCompleteInteraction)
        return { autoComplete: 'Step completion set-up incomplete' };
    }

    return {};
  }, []);

  const handleSubmit = useCallback(
    (values: StepCompletionFormValues) => {
      const errors = validate(values);
      if (Object.keys(errors).length) {
        showErrors(errors, toast);
        return;
      }

      const sanitizedValues: StepCompletionFormValues = {
        ...values,
        ...(values.stepCompletionType !== StepCompletion.auto && {
          eventMappings: [],
          autoCompleteInteractions: [],
        }),
        ...(values.stepCompletionType !== StepCompletion.autoInteraction && {
          autoCompleteInteraction: null,
        }),
        ...(values.stepCompletionType === StepCompletion.manual && {
          // Force manual completion to be disabled for manually completed steps
          manualCompletionDisabled: false,
        }),
      };

      mainSetFieldValue(
        `${formKey}.manualCompletionDisabled`,
        sanitizedValues.manualCompletionDisabled,
        false
      );
      mainSetFieldValue(
        `${formKey}.eventMappings`,
        sanitizedValues.eventMappings,
        false
      );
      mainSetFieldValue(
        `${formKey}.autoCompleteInteractions`,
        sanitizedValues.autoCompleteInteractions,
        false
      );
      mainSetFieldValue(
        `${formKey}.autoCompleteInteraction`,
        sanitizedValues.autoCompleteInteraction,
        false
      );
      onClose?.();
    },
    [mainSetFieldValue, formKey, onClose]
  );

  if (!isOpen) return null;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validate}
      enableReinitialize={false}
    >
      <StepCompletionModalBody
        onClose={onClose}
        isOpen={isOpen}
        defaultNewUrl={defaultNewUrl}
        formFactor={formFactor}
      />
    </Formik>
  );
};

export default StepCompletionModal;
