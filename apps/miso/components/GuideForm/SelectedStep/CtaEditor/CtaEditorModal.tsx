import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ErrorMessage,
  Field,
  FieldProps,
  Formik,
  useFormikContext,
} from 'formik';
import { debounce } from 'lodash';
import {
  Box,
  Button,
  Flex,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  BannerStyle,
  BranchingEntityType,
  CardStyle,
  CtaInput,
  GuideFormFactor,
  StepCtaType,
  StepType,
  TooltipStyle,
} from 'bento-common/types';
import {
  isBranchingStep,
  isInputStep,
  isUrlCta,
} from 'bento-common/data/helpers';

import Select, {
  ExtendedSelectOptions,
  OptionWithSubLabel,
  SelectOptions,
} from 'system/Select';
import { ErrorCallout } from 'bento-common/components/CalloutText';
import {
  computeCtaAllowance,
  createCtaOptionValue,
  createCtaWithDefaults,
} from './helpers';
import CtaEditorForm from './CtaEditorForm';
import { CtaEditorFormValues } from './types';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import {
  BANNER_TYPE_LABELS,
  CTA_TYPE_OPTIONS,
  MODAL_TYPE_LABELS,
} from 'helpers/constants';
import { isBannerGuide, isModalGuide } from 'bento-common/utils/formFactor';
import H5 from 'system/H5';
import Tooltip from 'system/Tooltip';

type ContainerProps = {
  formFactor: GuideFormFactor;
  formFactorStyle: CardStyle | TooltipStyle | BannerStyle | undefined;

  /**
   * Factory function responsible for computing the CTA allowance details based on given existing CTAs
   * and all other parameters provided by the factory (i.e. theme, form factor, etc).
   *
   * NOTE: The given existing CTA-types will be removed from the allowance list.
   */
  computeCtaAllowanceFactory: (
    existingCtas: CtaInput[]
  ) => () => ReturnType<typeof computeCtaAllowance>;

  /**
   * List containing all pre-existing CTAs
   */
  initialCtas: CtaInput[];
  isOpen: boolean;
  onDismiss: () => void;
  onSubmit: (values: CtaInput[]) => void;
  stepType: StepType;
  branchingType: BranchingEntityType;
  branchingMultiple: boolean;
  /**
   * Whether to start automatically creating a new CTA and selecting it right away.
   * @default false
   */
  startWithNew?: boolean;
  /**
   * The URL of the next Step of the Flow, in case one exists and this is a Flow-type guide.
   */
  nextUrlOfFlow?: string;
};

type Props = Omit<ContainerProps, 'initialCtas' | 'onSubmit'>;

/**
 * Determines the fake value for the "Add CTA" option within the dropdown.
 */
const ADD_CTA_OPTION_VALUE = '__new';

const CtaEditorModal: React.FC<Props> = ({
  computeCtaAllowanceFactory,
  formFactor,
  formFactorStyle,
  isOpen,
  branchingType,
  branchingMultiple,
  onDismiss,
  startWithNew,
  stepType,
  nextUrlOfFlow,
}) => {
  const uiSettings = useUISettings('store-or-network');

  const { dirty, isValid, setFieldValue, submitForm, values } =
    useFormikContext<CtaEditorFormValues>();

  const [selectedCtaKey, setSelectedCtaKey] = useState<string>();

  /**
   * Compute the CTA allowance information which determines whether more CTAs are allowed
   * and which types are allowed or forced.
   */
  const { canAdd, allowedCtaTypes, forcedCtaTypes } = useMemo(
    () => computeCtaAllowanceFactory(values.ctas)(),
    [values.ctas, computeCtaAllowanceFactory]
  );

  /**
   * Compose the list of options based on existing CTA values to allow
   * the user to select which one is being edited.
   *
   * NOTE: This appends an "Add CTA" option to allow creating new CTA instances.
   */
  const whichCtaOptions = useMemo<ExtendedSelectOptions[]>(() => {
    const options: ExtendedSelectOptions[] = values.ctas.map((cta, index) => {
      const thisOptionValue = createCtaOptionValue(cta, index);

      const deleteDisabled =
        cta.settings?.implicit &&
        // Input steps require a submit CTA.
        (isInputStep(stepType) ||
          // Multi module branching requires a submit CTA.
          (isBranchingStep(stepType) &&
            branchingMultiple &&
            branchingType === BranchingEntityType.Module));

      const icon = (({ style, ...props }) => (
        <Tooltip
          label={deleteDisabled ? 'This CTA is required' : 'Remove'}
          placement="top"
        >
          <DeleteIcon
            style={{
              ...style,
              ...(deleteDisabled && { cursor: 'not-allowed', opacity: 0.3 }),
            }}
            {...props}
          />
        </Tooltip>
      )) as ExtendedSelectOptions['extra']['icon'];

      return {
        value: thisOptionValue,
        label: `"${cta.text}"`,
        extra: {
          icon,
          callback: (event) => {
            event.stopPropagation();

            if (deleteDisabled) return;

            // unselect if necessary
            if (selectedCtaKey === thisOptionValue)
              setSelectedCtaKey(undefined);
            // drop item from the select list by their index
            setFieldValue(
              'ctas',
              values.ctas.filter(
                (c, i) => createCtaOptionValue(c, i) !== thisOptionValue
              )
            );
          },
        },
      };
    });

    options.push({
      Icon: <AddCircleOutlineIcon fontSize="small" />,
      label: 'Add CTA',
      value: ADD_CTA_OPTION_VALUE,
      isDisabled: !canAdd && !forcedCtaTypes.length,
    });

    return options;
  }, [
    values.ctas,
    selectedCtaKey,
    canAdd,
    forcedCtaTypes,
    stepType,
    branchingMultiple,
    branchingType,
  ]);

  /**
   * Which types of CTAs can still be added.
   *
   * WARNING: This does NOT include the type of the currently selected CTA, if any.
   */
  const ctaTypeOptions = useMemo(() => {
    const { allowedCtaTypes: allowedOptions, forcedCtaTypes: forcedOptions } =
      computeCtaAllowanceFactory(
        values.ctas.filter(
          (c, i) =>
            // filter out the current selection
            createCtaOptionValue(c, i) !== selectedCtaKey
        )
      )();

    const allowed = forcedOptions.length ? forcedOptions : allowedOptions;

    return CTA_TYPE_OPTIONS.filter((opt) => allowed.includes(opt.value)).map(
      (opt) => {
        let label = opt.label;
        if (opt.value === StepCtaType.complete) {
          label = isModalGuide(formFactor)
            ? MODAL_TYPE_LABELS[opt.value]
            : isBannerGuide(formFactor)
            ? BANNER_TYPE_LABELS[opt.value]
            : opt.label;
        }
        return { ...opt, label };
      }
    );
  }, [selectedCtaKey, computeCtaAllowanceFactory, formFactor]);

  const whichCtaValue = useMemo<ExtendedSelectOptions | undefined>(() => {
    return selectedCtaKey
      ? whichCtaOptions.find((option) => option.value === selectedCtaKey)
      : whichCtaOptions[0];
  }, [whichCtaOptions, selectedCtaKey]);

  const createNewAndSelect = useCallback(() => {
    if (!canAdd && !forcedCtaTypes.length) return undefined;

    const newCta = createCtaWithDefaults(
      (canAdd ? allowedCtaTypes : forcedCtaTypes)[0],
      formFactor,
      stepType
    );

    if (newCta) {
      setFieldValue('ctas', values.ctas.concat(newCta));
      // this equals length because we added one above
      setSelectedCtaKey(createCtaOptionValue(newCta, values.ctas.length));
    }

    return newCta;
  }, [
    canAdd,
    allowedCtaTypes,
    forcedCtaTypes,
    formFactor,
    stepType,
    values.ctas,
  ]);

  const handleWhichCtaChanged = useCallback(
    (option: SelectOptions) => {
      // create and select the new cta right away
      if (option.value === ADD_CTA_OPTION_VALUE) {
        createNewAndSelect();
        return;
      }
      // change selection
      setSelectedCtaKey(option.value);
    },
    [createNewAndSelect]
  );

  const selectedCtaIndex = useMemo(() => {
    return values.ctas.findIndex(
      (c, i) => createCtaOptionValue(c, i) === selectedCtaKey
    );
  }, [selectedCtaKey, values.ctas]);

  useEffect(() => {
    // automatically start creating a new CTA when necessary
    if (startWithNew) {
      createNewAndSelect();
    }
    // automatically select the first available CTA option when nothing is selected
    else if (!selectedCtaKey && whichCtaOptions.length) {
      setSelectedCtaKey(whichCtaOptions[0].value);
    }
  }, []);

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={onDismiss}
      /** @todo consider removing the below */
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit call-to-action button</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="6">
            {/* CTA Picker */}
            <Field name="target">
              {({ field }: FieldProps) => (
                <Box>
                  <H5 mb="1">Which CTA are you editing</H5>
                  <Select
                    isClearable={false}
                    options={whichCtaOptions}
                    value={whichCtaValue}
                    onChange={handleWhichCtaChanged}
                    components={{ Option: OptionWithSubLabel() }}
                  />
                  <ErrorMessage name={field.name} component={ErrorCallout} />
                </Box>
              )}
            </Field>
            {/* Fields associated with the chosen CTA */}
            {selectedCtaIndex !== -1 && (
              <CtaEditorForm
                formKey={`ctas[${selectedCtaIndex}]`}
                formFactorStyle={formFactorStyle}
                stepType={stepType}
                formFactor={formFactor}
                uiSettings={uiSettings}
                ctaTypeOptions={ctaTypeOptions}
                nextUrlOfFlow={nextUrlOfFlow}
              />
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={onDismiss}>
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={!dirty || !isValid}
              onClick={submitForm}
            >
              Done
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

/**
 * Handles creating, editing and removing CTAs.
 *
 * WARNING: Contains "heavy" logic so please only render this component when you need it.
 */
const CtaEditorModalContainer: React.FC<ContainerProps> = (props) => {
  const { initialCtas, onSubmit, ...restProps } = props;

  /**
   * @todo convert to superstruct
   */
  const validate = useCallback(
    debounce(
      (values: CtaEditorFormValues) => {
        const errors = values.ctas.reduce<Record<string | number, any>>(
          (acc, input, i) => {
            const errors: Record<string, string> = {};

            if (!input.type) {
              errors.type = 'Please select a type for this CTA';
            }

            if (input.type === StepCtaType.launch && !input.destinationGuide) {
              errors.destinationGuide = 'Please select a guide';
            }

            if (!input.style) {
              errors.style = 'Please select a style for this CTA';
            }

            if (!input.text) {
              errors.text = 'Please add some text for your CTA';
            }

            if (isUrlCta(input.type) && !input.url) {
              errors.url = 'A url needs to be provided';
            }

            if (input.url?.includes('*')) {
              errors.url = 'Wildcards are not supported in the URL';
            }

            if (
              input.type === StepCtaType.event &&
              !input.settings?.eventName
            ) {
              errors['settings.eventName'] = 'Please provide an event message';
            }

            if (Object.keys(errors).length > 0) acc[i] = errors;
            return acc;
          },
          {}
        );

        if (Object.keys(errors).length > 0) {
          return { ctas: errors };
        }

        return undefined;
      },
      100,
      { leading: true, trailing: true, maxWait: 200 }
    ),
    []
  );

  const handleSubmit = useCallback(
    (values: CtaEditorFormValues) => {
      onSubmit(values.ctas);
    },
    [onSubmit]
  );

  const initialValues = useMemo(() => ({ ctas: initialCtas }), [initialCtas]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validate}
      enableReinitialize
      validateOnMount
      validateOnChange
    >
      <CtaEditorModal {...restProps} />
    </Formik>
  );
};

export default CtaEditorModalContainer;
