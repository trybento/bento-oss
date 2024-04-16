import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Text, BoxProps, Flex, FormLabel } from '@chakra-ui/react';
import { FieldArray, useFormikContext } from 'formik';
import { get } from 'lodash';

import usePrevious from 'bento-common/hooks/usePrevious';
import {
  BannerStyle,
  BranchingEntityType,
  CardStyle,
  CtaInput,
  GuideFormFactor,
  StepCtaType,
  StepType,
  Theme,
  TooltipStyle,
} from 'bento-common/types';
import {
  getAllowedStepCtaTypes,
  getDefaultStepCtas,
  hasOnlyDefaultCtas,
  getImplicitStepCtas,
} from 'bento-common/data/helpers';

import CtaEditorModal from './CtaEditor/CtaEditorModal';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import { isGuideBase } from 'helpers/constants';
import { FormEntityType } from '../types';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import { TemplateFormValues } from 'components/Templates/Template';
import { concatImplicitCtas } from 'helpers';
import { Highlight } from 'components/common/Highlight';
import { computeCtaAllowance } from './CtaEditor/helpers';
import ConflictingFlowCtaWarning from '../ConflictingFlowCtaWarning';

interface SelectedStepCtasContainerProps extends SelectedStepCtasProps {
  formEntityType: FormEntityType;
}

interface SelectedStepCtasProps extends BoxProps {
  formKey: string;
  stepType: StepType;
  branchingMultiple: boolean;
  branchingType: BranchingEntityType | undefined;
  formFactor: GuideFormFactor;
  theme: Theme;
  ctas: CtaInput[];
  blocklist?: StepCtaType[];
  disabled?: boolean;
  /**
   * Flow-type specific compliance information for CTAs.
   * This is used to determine whether we should show warnings indicating
   * that a CTA is conflicting with the a step of the Flow (i.e. redirecting user
   * to another page).
   */
  flowCtasComplianceInfo?: {
    /** If not compliant, means a warning will show */
    compliant: boolean;
    /** The URL for the next Step of the flow, if any */
    nextUrlOfFlow: string | undefined;
  };
}

const getShowCtas = (
  stepType: StepType,
  branchingMultiple: boolean,
  branchingType: BranchingEntityType | undefined,
  formFactor: GuideFormFactor,
  theme: Theme
): boolean =>
  !!getAllowedStepCtaTypes({
    stepType,
    branchingMultiple,
    branchingType,
    guideFormFactor: formFactor,
    theme,
  }).length;

const SelectedStepCtas: React.FC<SelectedStepCtasProps> = ({
  formKey,
  stepType,
  branchingMultiple,
  branchingType,
  formFactor,
  theme,
  ctas = [],
  blocklist = [],
  disabled,
  flowCtasComplianceInfo = {
    compliant: true,
    nextUrlOfFlow: undefined,
  },
  ...boxProps
}) => {
  const [shouldShow, setShouldShow] = useState<boolean>(
    getShowCtas(stepType, branchingMultiple, branchingType, formFactor, theme)
  );
  const [editing, setEditing] = useState<{ isNew: boolean } | false>(false);

  const uiSettings = useUISettings('store-or-network');

  // Main form context.
  const { setFieldValue, values } = useFormikContext<TemplateFormValues>();

  // Guide style settings only apply for
  // the template form.
  const formFactorStyle: CardStyle | TooltipStyle | BannerStyle | undefined =
    values.templateData?.formFactorStyle;

  /**
   * Do the following if step type changes:
   * 1. Check if current CTAs are default and replace them with new defaults.
   * 2. If CTAs were modified, just remove incomplatible types.
   * 3. If no CTAs were present, add defaults.
   */
  const previousStepType = usePrevious(stepType);
  const previousBranchingMultiple = usePrevious(branchingMultiple);
  const previousBranchingType = usePrevious(branchingType);
  useEffect(() => {
    if (
      !stepType ||
      !formFactor ||
      !previousStepType ||
      (stepType === previousStepType &&
        previousBranchingMultiple === branchingMultiple &&
        previousBranchingType === branchingType)
    )
      return;

    const shouldShowCtas = getShowCtas(
      stepType,
      branchingMultiple,
      branchingType,
      formFactor,
      theme
    );

    // We should always replace the current ctas if:
    // 1. There are no current ctas (implicit discarded)
    // 2. When all ctas match the default ones for the previous step,
    // meaning they were not changed
    const shouldReplace =
      !ctas.filter((cta) => !cta.settings.implicit).length ||
      hasOnlyDefaultCtas(ctas, previousStepType, formFactor, theme);

    if (!shouldShowCtas) {
      setFieldValue(`${formKey}.ctas`, []);
    } else if (shouldReplace) {
      const newDefaultCtas = getDefaultStepCtas({
        stepType,
        branchingMultiple,
        branchingType,
        guideFormFactor: formFactor,
        theme,
      });

      setFieldValue(`${formKey}.ctas`, newDefaultCtas);
    } else {
      const allowedTypes = getAllowedStepCtaTypes({
        stepType,
        branchingMultiple,
        branchingType,
        guideFormFactor: formFactor,
        theme,
      });

      const implicitCtas = getImplicitStepCtas({
        stepType,
        branchingMultiple,
        branchingType,
      }) as CtaInput[];

      setFieldValue(
        `${formKey}.ctas`,
        concatImplicitCtas({ implicitCtas, ctas, allowedTypes })
      );
    }

    setShouldShow(shouldShowCtas);
  }, [stepType, branchingMultiple, branchingType, formFactor]);

  /**
   * Filter allowed CTAs if external factors
   * modify the types blacklist.
   */
  useEffect(() => {
    if (blocklist.length) {
      setFieldValue(
        `${formKey}.ctas`,
        ctas.filter((cta) => !blocklist.includes(cta.type))
      );
    }
  }, [blocklist]);

  const initialCtas = useMemo<CtaInput[]>(() => {
    return get(values, formKey)?.ctas || [];
  }, [formKey, values]);

  /**
   * Creates a function responsible for computing the CTA allowance details based on
   * the given existing CTAs and additional context provided by itself (i.e. theme, form factor, etc).
   *
   * Useful to share the same context with underlying components (i.e. CtaEditorModal).
   */
  const computeCtaAllowanceFactory = useCallback(
    (existingCtas: CtaInput[]) => () =>
      computeCtaAllowance({
        existingCtas,
        stepType,
        branchingMultiple,
        branchingType,
        formFactor,
        theme,
        blocklist,
      }),
    [stepType, branchingMultiple, branchingType, formFactor, theme, blocklist]
  );

  const { canAdd, forcedCtaTypes } = useMemo(() => {
    if (disabled) return { canAdd: false, forcedCtaTypes: [] };
    return computeCtaAllowanceFactory(initialCtas)();
  }, [disabled, initialCtas, computeCtaAllowanceFactory]);

  const handleOpenModal = useCallback(() => {
    setEditing({ isNew: false });
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditing(false);
  }, []);

  const handleAdd = useCallback(() => {
    setEditing({ isNew: true });
  }, [
    ctas.length,
    formFactor,
    theme,
    stepType,
    branchingMultiple,
    branchingType,
  ]);

  const handleEditorConfirmed = useCallback(
    (values: CtaInput[]) => {
      setFieldValue(`${formKey}.ctas`, values);
      setEditing(false);
    },
    [formKey, setFieldValue]
  );

  if (!uiSettings || !shouldShow) return null;

  return (
    <Box {...boxProps}>
      <FieldArray
        name={`${formKey}.ctas`}
        render={() => (
          <>
            <Flex
              flexDir="row"
              justifyContent="space-between"
              alignItems="center"
              overflow="hidden"
            >
              <Flex flexDir="row" gap={2} alignItems="center" overflow="hidden">
                <>
                  <FormLabel variant="secondary" whiteSpace="nowrap" m="0">
                    <Flex className="flex-row gap-1">
                      <Text>Call-to-action buttons:</Text>
                      {!flowCtasComplianceInfo?.compliant && (
                        <ConflictingFlowCtaWarning
                          label={
                            "Contains a CTA that redirects to a URL that's different from the next step, which will disrupt the flow."
                          }
                        />
                      )}
                    </Flex>
                  </FormLabel>
                  {/* Render each CTA */}
                  {ctas.length ? (
                    ctas.map((cta, ctaIdx) => (
                      <Highlight
                        key={cta.entityId || `new-cta-${ctaIdx}`}
                        fontSize="xs"
                        isTruncated
                      >
                        {cta.text}
                      </Highlight>
                    ))
                  ) : (
                    <Text fontStyle="italic">None</Text>
                  )}
                </>
              </Flex>
              {/* Global controls (edit & add) */}
              <Flex flexDir="row" gap={4} alignItems="center" ml={8}>
                {ctas.length > 0 && (
                  <Button
                    fontSize="xs"
                    variant="link"
                    onClick={handleOpenModal}
                  >
                    Edit CTA
                  </Button>
                )}
                {(canAdd || forcedCtaTypes.length > 0) && (
                  <Button fontSize="xs" variant="link" onClick={handleAdd}>
                    Add CTA
                  </Button>
                )}
              </Flex>
            </Flex>

            {!disabled && !!editing && (
              <CtaEditorModal
                computeCtaAllowanceFactory={computeCtaAllowanceFactory}
                initialCtas={initialCtas}
                onDismiss={handleCloseModal}
                onSubmit={handleEditorConfirmed}
                isOpen={!!editing}
                startWithNew={editing?.isNew}
                branchingType={branchingType}
                branchingMultiple={branchingMultiple}
                stepType={stepType}
                formFactorStyle={formFactorStyle}
                formFactor={formFactor}
                nextUrlOfFlow={flowCtasComplianceInfo?.nextUrlOfFlow}
              />
            )}
          </>
        )}
      />
    </Box>
  );
};

const SelectedStepCtasContainer: React.FC<SelectedStepCtasContainerProps> = ({
  formEntityType,
  ...restProps
}) => (
  <>
    {isGuideBase(formEntityType) ? null : <SelectedStepCtas {...restProps} />}
  </>
);

export default withTemplateDisabled<SelectedStepCtasContainerProps>(
  SelectedStepCtasContainer
);
