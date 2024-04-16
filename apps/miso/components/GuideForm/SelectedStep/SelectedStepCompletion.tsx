import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import get from 'lodash/get';
import { Box, Button, Flex, FormLabel } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import {
  BentoEvents,
  GuideFormFactor,
  StepCompletion,
} from 'bento-common/types';
import { turnEverythingIntoValue } from 'bento-common/utils/targeting';
import {
  getIsStepAutoCompletionEnabled,
  getIsStepAutoCompleteInteractionEnabled,
} from 'helpers';
import { CustomApiEvent } from 'types';
import StepCompletionModal from './StepCompletionModal';
import { useCustomApiEvents } from 'providers/CustomApiEventsProvider';
import { ExtendedSelectOptions } from 'system/Select';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import { Highlight } from 'components/common/Highlight';
import { useAllTemplates } from 'providers/AllTemplatesProvider';
import {
  BUTTON_INTERACTION_NO_TEXT,
  COMPLETION_OPTIONS,
} from 'helpers/constants';
import { StepPrototypeValue } from 'bento-common/types/templateData';
import { pluralize } from 'bento-common/utils/pluralize';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import Span from 'system/Span';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import { RulesList } from 'components/EditorCommon/RulesList';

interface SelectedStepCompletionProps {
  formKey: string;
  formFactor: GuideFormFactor | undefined;
  disabled?: boolean;
}

const SelectedStepCompletion: React.FC<SelectedStepCompletionProps> = ({
  formKey,
  disabled,
  formFactor,
}) => {
  // TODO: Make generic type for reusable components.
  // Main form context.
  const { values } = useFormikContext<object>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const step: StepPrototypeValue = get(values, formKey);
  const isFlow = isFlowGuide(formFactor);
  const { templates } = useAllTemplates();
  const defaultNewUrl = useMemo<string | undefined>(
    () => (isFlow ? step.taggedElements?.[0]?.url : undefined),
    [isFlow, step.taggedElements]
  );
  const extension = useChromeExtensionInstalled();

  const stepCompletionType = useMemo<StepCompletion>(() => {
    if (getIsStepAutoCompletionEnabled(step)) return StepCompletion.auto;
    if (getIsStepAutoCompleteInteractionEnabled(step))
      return StepCompletion.autoInteraction;
    return StepCompletion.manual;
  }, [
    step?.stepType,
    step?.autoCompleteInteraction,
    step?.eventMappings,
    step?.autoCompleteInteractions,
  ]);

  const selectedStepCompletionOption = useMemo<ExtendedSelectOptions>(
    () => COMPLETION_OPTIONS.find((o) => o.value === stepCompletionType),
    [stepCompletionType]
  );

  const { customApiEvents, fetchCustomApiEvents } = useCustomApiEvents();

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const autoCompleteDetails: ReactNode = useMemo(() => {
    // Click based completion.
    if (stepCompletionType === StepCompletion.autoInteraction)
      return (
        <>
          Button:{' '}
          {step.autoCompleteInteraction?.elementText || (
            <Span fontStyle="italic" color="gray.400">
              {BUTTON_INTERACTION_NO_TEXT}
            </Span>
          )}
        </>
      );

    // Guide based completion.
    if (step.autoCompleteInteractions?.length)
      return step.autoCompleteInteractions.reduce(
        (acc, { templateEntityId }) => {
          const displayedValue =
            templates?.find((t) => t.entityId === templateEntityId)?.name ||
            templateEntityId;

          return `${acc ? `${acc},` : `Guide completion: `} ${displayedValue}`;
        },
        ''
      );

    if (step.eventMappings?.length) {
      const firstEvent = step.eventMappings[0];
      // Attribute based completion.
      if (
        firstEvent.eventName === BentoEvents.account ||
        firstEvent.eventName === BentoEvents.user
      ) {
        const rule = firstEvent.rules[0];
        return rule ? (
          <>
            Attribute:{' '}
            <RulesList
              variant="plain"
              rules={[
                turnEverythingIntoValue({
                  ...rule,
                  attribute: rule.propertyName,
                }),
              ]}
              mb="0"
              fontSize="xs"
            />
          </>
        ) : (
          ''
        );
      }

      // Event based completion.
      return step.eventMappings.reduce((acc, { eventName }) => {
        acc = `${
          acc ? `${acc},` : `${pluralize(step.eventMappings.length, 'Event')}: `
        } ${eventName}`;
        return acc;
      }, '');
    }

    return '';
  }, [
    step.autoCompleteInteractions,
    step.eventMappings,
    stepCompletionType,
    templates,
  ]);

  useEffect(() => {
    !customApiEvents && fetchCustomApiEvents();
  }, []);

  return (
    <Flex
      flexDir="column"
      gap="2"
      pointerEvents={disabled ? 'none' : undefined}
    >
      <Flex gap="2">
        <FormLabel variant="secondary" my="auto" mr="0">
          Step completion:
        </FormLabel>
        {(!stepCompletionType ||
          stepCompletionType === StepCompletion.manual) && (
          <Highlight fontSize="xs" mb="auto">
            {selectedStepCompletionOption.label}
          </Highlight>
        )}
        <Box ml="auto">
          <Button
            fontSize="xs"
            variant="link"
            onClick={handleOpenModal}
            isDisabled={disabled}
          >
            Edit step completion
          </Button>
        </Box>
      </Flex>
      {stepCompletionType && stepCompletionType !== StepCompletion.manual && (
        <Flex gap="2">
          <Highlight fontSize="xs" whiteSpace="nowrap">
            Automatic
          </Highlight>
          <Highlight fontSize="xs" isTruncated>
            {autoCompleteDetails}
          </Highlight>
        </Flex>
      )}

      {isOpen && (
        <StepCompletionModal
          formKey={formKey}
          stepCompletionType={stepCompletionType}
          onClose={handleCloseModal}
          manualCompletionDisabled={step.manualCompletionDisabled}
          eventMappings={step.eventMappings}
          defaultNewUrl={defaultNewUrl}
          autoCompleteInteractions={step.autoCompleteInteractions}
          autoCompleteInteraction={step.autoCompleteInteraction}
          existingEventNames={customApiEvents as unknown as CustomApiEvent[]}
          formFactor={formFactor}
          isOpen
        />
      )}
    </Flex>
  );
};

export default withTemplateDisabled<SelectedStepCompletionProps>(
  SelectedStepCompletion
);
