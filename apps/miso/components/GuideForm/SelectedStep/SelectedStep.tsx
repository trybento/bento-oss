import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import get from 'lodash/get';

import {
  getGuideThemeFlags,
  isBranchingStep,
  isInputStep,
} from 'bento-common/data/helpers';
import {
  BranchingEntityType,
  CardStyle,
  FormFactorStyle,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  StepBodyOrientation,
  StepCtaType,
  StepType,
  TagContext,
  Theme,
  VisualTagStyleSettings,
} from 'bento-common/types';
import { getDefaultStepBody } from 'bento-common/utils/templates';
import { ContextTagType } from 'bento-common/types/globalShoyuState';
import { px } from 'bento-common/utils/dom';
import { CalloutTypes, EditorNode } from 'bento-common/types/slate';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import {
  BranchingType,
  StepPrototypeValue,
} from 'bento-common/types/templateData';
import { pluralize } from 'bento-common/utils/pluralize';
import {
  isAnnouncementGuide,
  isModalGuide,
  isTooltipGuide,
  isFlowGuide,
  supportsUpdatedMediaHandling,
  isBannerGuide,
} from 'bento-common/utils/formFactor';

import Box from 'system/Box';
import { StepValue, BranchingFormFactor, BentoComponentsEnum } from 'types';
import { isEmptySlate } from 'bento-common/components/RichTextEditor/helpers';
import { isBranching } from 'utils/helpers';
import SelectedStepStepType from './SelectedStepStepType';
import SelectedStepContent from './SelectedStepContent';
import StepBranching from 'components/Library/StepBranching';
import SelectedStepCompletion from './SelectedStepCompletion';
import StepPrototypeTag, {
  StepPrototypeTagContextProps,
} from 'components/Tags/StepPrototypeTag';
import PreviewContainer from 'components/Previews/PreviewContainer';
import BranchingInfo, {
  stepStatColWidth,
} from 'components/UserGuideBases/EditUserGuideBase/BranchingInfo';
import {
  EDITOR_LEFT_WIDTH,
  getRootFormKey,
  isGuideBase,
  isTemplate,
} from 'helpers/constants';
import { FormEntityType } from '../types';
import CalloutText from 'bento-common/components/CalloutText';
import SelectedStepCtas from './SelectedStepCtas';
import ViewInAppButton from '../../ViewInAppButton';
import { TemplateFormValues } from 'components/Templates/Template';
import { useTemplate } from 'providers/TemplateProvider';
import SelectedStepInputFields from './SelectedStepInputFields';
import QueryRenderer from 'components/QueryRenderer';
import { STYLE_TAB_QUERY } from 'components/Templates/Tabs/StyleTab';
import { StyleTabQuery } from 'relay-types/StyleTabQuery.graphql';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import SelectedStepMedia from './SelectedStepMedia';
import { ModuleUsage } from 'components/Modules/ModuleCountMessage';
import SeparatorBox from 'components/EditorCommon/SeparatorBox';
import InlineEmbedTargeting from 'components/InlineEmbeds/InlineEmbedTargeting';
import AnnouncementLocation from './AnnouncementLocation';

const DEFAULT_STEP_TYPE = StepType.optional;

interface SelectedStepProps {
  theme: Theme;
  isSelected: boolean;
  formKey: string;
  guideType: GuideTypeEnum;
  stepValue: StepValue;
  formFactor: GuideFormFactor;
  contextual?: boolean;
  isCyoa: boolean;
  disabled?: boolean;
  nameInputRef?: React.MutableRefObject<any>;
  // templateEntityId is set within the context of a template or minimal template form.
  templateEntityId?: string;

  /** This shows the tip under the RTE */
  note?: string;
  accountGuideEditor?: boolean;
  formEntityType?: FormEntityType;
  formFactorStyle?: FormFactorStyle;
  recentlyAdded?: boolean;

  /** Disabled in the following scenarios:
   * 1. Template displayTitle is empty.
   */
  autoFocusDisabled?: boolean;
  moduleUsage?: ModuleUsage;

  /** If parent component e.g. guide base editor wants to force previews
   * since we don't always have the context here.
   */
  showPreviews?: boolean;

  rteRenderKey?: string;
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

/**
 * Component to display and edit a selected step inside a module
 */
function SelectedStep({
  formKey,
  isSelected,
  stepValue: {
    entityId,
    name: stepName,
    body: stepBody,
    bodySlate,
    stepType,
    snappyAt,
  },
  note,
  accountGuideEditor,
  formFactor,
  disabled,
  contextual,
  theme,
  isCyoa,
  formFactorStyle,
  formEntityType,
  recentlyAdded,
  moduleUsage,
  templateEntityId,
  showPreviews,
  rteRenderKey,
  flowCtasComplianceInfo,
}: SelectedStepProps & Partial<StyleTabQuery['response']>) {
  // TODO: Better typing for this since it is not 'TemplateFormValues' all the time.

  /* Use caution when using template context because it is only relevant in 1/3 areas
   *  that this component may appear in.
   */
  const { setFieldValue, values } = useFormikContext<TemplateFormValues>();
  const { template } = useTemplate();
  const { isCard } = getGuideThemeFlags(theme);
  const isAnnouncement = isAnnouncementGuide(formFactor);
  const isModal = isModalGuide(formFactor);
  const isTooltip = isTooltipGuide(formFactor);
  const isFlow = isFlowGuide(formFactor);
  const isGuideBaseForm = isGuideBase(formEntityType);
  const isBanner = isBannerGuide(formFactor);

  const guideData = values[getRootFormKey(formEntityType)];
  // TODO: Remove either 'step' or 'stepValue'.
  const step = get(values, formKey) as StepPrototypeValue;

  /** Used to load default content when the step type changes. */
  const [stepTemplateLoadedCount, setStepTemplateLoadedCount] =
    useState<number>(0);
  const [touched, setTouched] = useState<boolean>(!!entityId || !recentlyAdded);

  /** UI hidden for branching steps and step groups */
  const shouldShowVts =
    isTemplate(formEntityType) &&
    templateEntityId &&
    !isBranchingStep(stepType);

  /** UI hidden for: 'information', 'branching' and 'input steps */
  const shouldShowCompletion =
    ((stepType !== StepType.fyi &&
      stepType !== StepType.branching &&
      stepType !== StepType.branchingOptional &&
      stepType !== StepType.input) ||
      isFlow ||
      isTooltip) &&
    !isGuideBaseForm;

  const showCustomizations =
    isInputStep(stepType) || shouldShowCompletion || shouldShowVts;

  const sectionWidths: string[] = useMemo(() => {
    return isAnnouncement || isTooltip || isCard || isFlow
      ? [EDITOR_LEFT_WIDTH, '100%']
      : ['100%', '100%'];
  }, [isAnnouncement, isTooltip, isCard, isFlow]);

  const tagStyle = values.templateData?.taggedElements[0]?.style as
    | VisualTagStyleSettings
    | undefined;

  /**
   * Compute CTA restrictions based on form factor and styles.
   *
   * NOTE: This logic assumes that multiple cases could apply to the same instance,
   * therefore builds the blocklist array interactively and simply returns it as a final step.
   */
  const ctaBlocklist = useMemo(() => {
    let blocklist: StepCtaType[] = [];

    if (template?.isCyoa) {
      blocklist = blocklist.concat(StepCtaType.back, StepCtaType.next);
    }

    return blocklist;
  }, [formFactorStyle, isAnnouncement, isTooltip, template?.isCyoa]);

  const loadTemplate = useCallbackRef(
    (newStepType: StepType, force = false) => {
      // Don't load template for touched steps.
      if (!touched || force) {
        setFieldValue(
          `${formKey}.bodySlate`,
          getDefaultStepBody(newStepType, theme)
        );
        setStepTemplateLoadedCount((v) => v + 1);
        setTouched(false);
      }
    },
    [entityId, formKey, theme, touched]
  );

  const onStepTypeChange = useCallback(
    ({ value }) => {
      // Reset branching data.
      if (isBranching(stepType) && !isBranching(value)) {
        setFieldValue(`${formKey}.branchingMultiple`, false);
        setFieldValue(`${formKey}.branchingDismissDisabled`, false);
        setFieldValue(
          `${formKey}.branchingFormFactor`,
          BranchingFormFactor.Dropdown
        );
        setFieldValue(`${formKey}.branchingPathData`, []);
        setFieldValue(`${formKey}.branchingQuestion`, '');
        setFieldValue(`${formKey}.branchingEntityType`, BranchingType.module);
      }

      // Reset input fields.
      setFieldValue(`${formKey}.inputs`, []);

      setFieldValue(`${formKey}.stepType`, value);
      if (!entityId) {
        loadTemplate(value);
      }
    },
    [formKey, stepType]
  );

  const onBodyChange = useCallback(
    (newBodySlate: EditorNode[], snappy?: boolean) => {
      setFieldValue(`${formKey}.bodySlate`, newBodySlate);
      if (snappy) {
        setFieldValue(`${formKey}.snappyAt`, new Date());
      }
    },
    [formKey, setFieldValue]
  );

  const onStepContentInteracted = useCallback(() => setTouched(true), []);

  useEffect(() => {
    if (!stepType) {
      setFieldValue(`${formKey}.stepType`, DEFAULT_STEP_TYPE);
      setTouched(false);
    }

    if (isEmptySlate(bodySlate) && !entityId && !stepName && !isGuideBaseForm) {
      loadTemplate(DEFAULT_STEP_TYPE, true);
      setTouched(false);
    }
  }, [stepType]);

  const showSettingsUnderRte =
    isModal || isCard || isTooltip || isFlow || isBanner;
  const showSingleStepType = isModal || isCard || isTooltip;
  const showInlineLocation = isCard;

  const singleStepVtProps: StepPrototypeTagContextProps | null = isGuideBaseForm
    ? null
    : isTooltip
    ? { context: TagContext.template }
    : isFlow
    ? { context: TagContext.step, formKey: formKey, stepPrototype: step }
    : null;

  // No need to render if step isn't selected.
  if (!isSelected) return null;

  return (
    <Flex flexDir="row" gridGap={10} mt="4">
      <Flex flexDir="column" width={sectionWidths[0]} maxW="750px">
        {showSingleStepType && (
          <SelectedStepStepType
            accountGuideEditor={accountGuideEditor}
            onTypeChange={onStepTypeChange}
            stepType={stepType}
            stepTypeAllowList={[StepType.fyi, StepType.input]}
            hideRequiredToggle
            disabled={isGuideBaseForm || template?.isCyoa || disabled}
            mb="4"
          />
        )}
        {moduleUsage && (
          <CalloutText mb="4" calloutType={CalloutTypes.Warning}>
            <Box display="flex" flexWrap="wrap" flexDirection="row">
              <Box mr="1">⚠️ Modifying this step will update it in the </Box>
              {/* @ts-ignore */}
              <moduleUsage.Popover>
                <Box fontWeight="semibold" textDecoration="underline">
                  {moduleUsage.count} {pluralize(moduleUsage.count, 'guide')}
                </Box>
              </moduleUsage.Popover>
              <Box ml="1">where this is used. This is irreversible.</Box>
            </Box>
          </CalloutText>
        )}
        <SelectedStepContent
          key={`step-${formKey}-content-${stepTemplateLoadedCount}`}
          w={sectionWidths[0]}
          minW={EDITOR_LEFT_WIDTH}
          onBodyChange={onBodyChange}
          onInteracted={onStepContentInteracted}
          formFactor={formFactor}
          bodySlate={bodySlate}
          stepBody={stepBody}
          stepType={stepType}
          formKey={formKey}
          note={note}
          formFactorStyle={formFactorStyle}
          entityId={entityId}
          formEntityType={formEntityType}
          snappyAt={snappyAt}
          disabled={disabled}
          theme={theme}
          mb="5"
          rteRenderKey={rteRenderKey}
        />

        {showSettingsUnderRte && (
          <Flex flexDir="column" _empty={{ display: 'none' }} gap="8">
            {isAnnouncement && <AnnouncementLocation disabled={disabled} />}
            {shouldShowCompletion && (
              <SelectedStepCompletion
                formKey={formKey}
                disabled={disabled}
                formFactor={formFactor}
              />
            )}
            {showSingleStepType && (
              <SelectedStepInputFields
                formKey={formKey}
                disabled={isGuideBaseForm || disabled}
                onCancel={onStepTypeChange}
                disableRequired
              />
            )}
            {singleStepVtProps && (
              <StepPrototypeTag
                {...singleStepVtProps}
                label="Anchor location:"
                editLabel="Edit location"
                setLabel="Set location"
                templateData={values.templateData}
                disabled={disabled}
                showPreview={false}
                warnWhenNotSet={true}
              />
            )}
            {showInlineLocation && (
              <InlineEmbedTargeting
                templateData={values.templateData}
                disabled={disabled}
              />
            )}
            {!isCyoa && (
              <SelectedStepCtas
                formKey={formKey}
                theme={theme}
                disabled={disabled}
                branchingMultiple={step.branchingMultiple}
                branchingType={
                  step.branchingEntityType as any as BranchingEntityType
                }
                ctas={step.ctas}
                formFactor={formFactor}
                stepType={step.stepType}
                formEntityType={formEntityType}
                blocklist={ctaBlocklist}
                flowCtasComplianceInfo={flowCtasComplianceInfo}
              />
            )}
            {supportsUpdatedMediaHandling(theme, formFactor) &&
              isTemplate(formEntityType) && (
                <SelectedStepMedia
                  formKey={formKey}
                  formFactor={formFactor}
                  mediaReferences={step.mediaReferences}
                />
              )}
          </Flex>
        )}
      </Flex>
      <Flex
        width={sectionWidths[1]}
        maxW={px(1000)}
        flexDir="column"
        gap="2"
        /**
         * minWidth: Allows flex child to shrink
         * its content.
         */
        minWidth="0"
        _empty={{ display: 'none' }}
      >
        {isFlow ? null : isAnnouncement ||
          isTooltip ||
          isCard ||
          showPreviews ? (
          <Flex gap="2" flexDir="column">
            <Flex>
              <Box fontSize="sm" fontWeight="bold" color="gray.800">
                Preview
              </Box>
              <Box ml="auto">
                <ViewInAppButton />
              </Box>
            </Flex>

            <PreviewContainer
              component={
                formFactor === GuideFormFactor.inline && contextual
                  ? BentoComponentsEnum.inlineContext
                  : BentoComponentsEnum[formFactor]
              }
              selectedStep={step}
              formFactorStyle={formFactorStyle}
              tagType={
                guideData.pageTargetingType === GuidePageTargetingType.visualTag
                  ? (values.templateData?.taggedElements[0]
                      ?.type as ContextTagType) || ContextTagType.dot
                  : undefined
              }
              tagStyle={tagStyle}
              showTooltipsPlacementCallout={isTooltip}
              contextual={isTooltip || formFactor === GuideFormFactor.inline}
              narrowGuide={
                isCard &&
                (formFactorStyle as CardStyle).stepBodyOrientation ===
                  StepBodyOrientation.vertical
              }
              previewBoxProps={{ py: 0 }}
            />
          </Flex>
        ) : (
          <>
            <Flex flexDir="column" gap="4">
              {/** Step type */}
              <SelectedStepStepType
                accountGuideEditor={accountGuideEditor}
                onTypeChange={onStepTypeChange}
                stepType={stepType}
                disabled={isGuideBaseForm || template?.isCyoa || disabled}
              />
              {/** Branching settings */}
              {isBranching(stepType) && !isGuideBaseForm && (
                <StepBranching
                  key={`${formKey}-${entityId}`}
                  selectedStepFormKey={formKey}
                  disabled={disabled}
                />
              )}
              {isBranching(stepType) && isGuideBaseForm && (
                <Box ml="auto" display="flex" width="full">
                  <BranchingInfo
                    isOpen
                    guideStepBaseEntityId={step?.entityId}
                  />
                  {/** Dummy box to compesate empty column */}
                  <Box w={stepStatColWidth} />
                </Box>
              )}
              {/** Step customizations */}
              {showCustomizations && (
                <>
                  {shouldShowCompletion && (
                    <SeparatorBox flexDir="column">
                      <SelectedStepCompletion
                        formKey={formKey}
                        disabled={disabled}
                        formFactor={formFactor}
                      />
                    </SeparatorBox>
                  )}

                  <SelectedStepInputFields
                    formKey={formKey}
                    disabled={isGuideBaseForm || disabled}
                    onCancel={onStepTypeChange}
                  />

                  {!isCyoa && (
                    <SeparatorBox flexDir="column">
                      <SelectedStepCtas
                        formKey={formKey}
                        theme={theme}
                        disabled={disabled}
                        branchingMultiple={step.branchingMultiple}
                        branchingType={
                          step.branchingEntityType as any as BranchingEntityType
                        }
                        ctas={step.ctas}
                        formFactor={formFactor}
                        stepType={step.stepType}
                        formEntityType={formEntityType}
                        blocklist={ctaBlocklist}
                      />
                    </SeparatorBox>
                  )}

                  {shouldShowVts && (
                    <SeparatorBox flexDir="column">
                      <StepPrototypeTag
                        context={TagContext.step}
                        label="Visual tag:"
                        editLabel="Edit"
                        setLabel="Add visual tag"
                        stepPrototype={step}
                        templateData={values.templateData}
                        disabled={disabled}
                        formKey={formKey}
                      />
                    </SeparatorBox>
                  )}
                </>
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}

function SelectedStepQueryRenderer(
  cProps: React.PropsWithChildren<SelectedStepProps>
) {
  return !cProps.templateEntityId ? (
    <SelectedStep {...cProps} />
  ) : (
    <QueryRenderer<StyleTabQuery>
      query={STYLE_TAB_QUERY}
      variables={{ templateEntityId: cProps.templateEntityId }}
      render={({ props }) =>
        props ? <SelectedStep {...cProps} {...props} /> : null
      }
    />
  );
}

export default withTemplateDisabled<React.PropsWithChildren<SelectedStepProps>>(
  SelectedStepQueryRenderer
);
