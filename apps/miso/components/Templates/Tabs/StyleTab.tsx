import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { graphql } from 'react-relay';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
} from '@chakra-ui/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Field, useFormikContext } from 'formik';
import {
  BannerPosition,
  BannerTypeEnum,
  ChecklistStyle,
  CtasOrientation,
  FormFactorStyle,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  ModalPosition,
  ModalSize,
  ModalStyle,
  StepBodyOrientation,
  Theme,
  TooltipShowOn,
  TooltipSize,
  TooltipStyle,
  VisualTagHighlightType,
  VisualTagStyleSettings,
} from 'bento-common/types';
import { ContextTagType } from 'bento-common/types/globalShoyuState';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { px } from 'bento-common/utils/dom';
import CtasLeft from 'icons/CtasLeft';
import CtasRight from 'icons/CtasRight';
import CtasSpaceBetween from 'icons/CtasSpaceBetween';
import CtasInline from 'icons/CtasInline';
import { EDITOR_LEFT_WIDTH, getRootFormKey } from 'helpers/constants';
import PreviewContainer from 'components/Previews/PreviewContainer';
import Radio from 'system/Radio';
import RadioGroup from 'system/RadioGroup';
import { BentoComponentsEnum, ComposedComponentsEnum, StepValue } from 'types';
import ViewInAppButton from '../../ViewInAppButton';
import { FormEntityType } from 'components/GuideForm/types';
import ColorField from 'bento-common/components/ColorField';
import { TemplateFormValues } from '../Template';
import Tooltip from 'system/Tooltip';
import { useTemplate } from 'providers/TemplateProvider';
import {
  addBranchingKeysToPreviewTemplate,
  branchingPathsToEntityIdList,
  branchingPathTransformer,
  composeBranchingPaths,
  templateToGuideTransformer,
} from 'components/Library/LibraryTemplates/LibraryTemplatePreview/preview.helpers';
import SelectField from 'components/common/InputFields/SelectField';
import { OptionWithSubLabel, SingleValueWithIcon } from 'system/Select';
import SwitchField from 'components/common/InputFields/SwitchField';
import OrientationAndSizeSettings, {
  getOrientationSettingsToShow,
  getStepHeightPlaceholder,
  StepHeightHelperText,
} from './OrientationAndSizeSettings';
import { useAdvancedInlineContextualCustomizations } from 'hooks/useFeatureFlag';
import NumberField from 'components/common/InputFields/NumberField';
import { isTransparent } from 'bento-common/utils/color';
import { isNil } from 'bento-common/utils/lodash';
import TextField from 'components/common/InputFields/TextField';
import RadioGroupField from 'components/common/InputFields/RadioGroupField';
import {
  isInlineContextualGuide,
  isSidebarEmbed,
  isSidebarInjectedAsInline,
  isSingleStepGuide,
  supportsUpdatedMediaHandling,
} from 'bento-common/utils/formFactor';
import { CustomizedBadge } from '../../Library/TemplateStatus';
import { isUsingDefaultCssTemplate } from 'components/UISettings/CustomCssSettings';
import NumberInput from 'system/NumberInput';
import {
  getCompatibleThemes,
  getParsedFormFactorStyle,
  getThemeOptions,
  isGuideEligibleToHideCompletedSteps,
} from 'bento-common/data/helpers';
import ButtonGroup from 'system/ButtonGroup';
import { GUIDES_CHECKLISTS_PREVIEW_OPTIONS } from 'components/Previews/helpers';
import InlineResetButton from 'system/InlineResetButton';
import useRandomKey from 'bento-common/hooks/useRandomKey';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import TemplateStyleTabQuery from 'queries/TemplateStyleTabQuery';
import { TemplateStyleTabQuery$data } from 'relay-types/TemplateStyleTabQuery.graphql';
import {
  BranchingPathData,
  BranchingType,
  TemplateValue,
} from 'bento-common/types/templateData';
import EmbedLocationForm from './EmbedLocationForm';
import { getCtaColorOptions } from 'bento-common/utils/buttons';
import SimpleInfoTooltip from 'system/SimpleInfoTooltip';

type Props = {
  formEntityType: FormEntityType;
  formFactor: GuideFormFactor;
  formFactorStyle: FormFactorStyle;
  guideType: GuideTypeEnum;
  step: StepValue;
  templateEntityId: string | undefined | null;
};

type ChangeHandlersInput =
  | React.ChangeEvent<HTMLInputElement>
  | string
  | number
  | boolean
  | undefined
  | null;

type ChangeHandlers = {
  [key in keyof ModalStyle]: (ev: ChangeHandlersInput) => void;
} & {
  [key in keyof TooltipStyle]: (ev: ChangeHandlersInput) => void;
} & {
  [key in keyof ChecklistStyle]: (ev: ChangeHandlersInput) => void;
};

const InlineColorBox: React.FC<BoxProps> = (props) => (
  <Box
    w="12px"
    h="12px"
    border="1px solid #e7e7e7"
    borderRadius="sm"
    {...props}
  />
);

const ReadOnlyField: FC<{ label?: string } & BoxProps> = ({
  children,
  label,
  ...props
}) => (
  <Flex flexDir="column" gap="1" flex="1 0" {...props}>
    {!!label && <FormLabel>{label}</FormLabel>}
    <Box fontSize="sm" color="gray.600">
      {children}
    </Box>
  </Flex>
);

type Field = { key: string; type: 'number' | 'string' | 'boolean' };

/**
 * Preview & styles tab.
 * This is where the end-user comes to customize the component styles while live previewing.
 */
const StyleTab: React.FC<
  Props & TemplateStyleTabQuery$data & { branchingPaths: BranchingPathData[] }
> = (props) => {
  const {
    formEntityType,
    formFactor,
    formFactorStyle,
    step,
    branchingPaths,
    templates,
    modules,
    uiSettings,
  } = props;

  const { values, setFieldValue } = useFormikContext<TemplateFormValues>();
  const {
    isCard,
    isCarousel,
    isVideoGallery,
    isBanner,
    isInline,
    isCompact,
    isFlat,
    isAnnouncement,
    isModal,
    isTooltip,
    isFlow,
    template,
    canEditTemplate,
    multiModule,
    mediaReferenceFlags,
  } = useTemplate();
  const isSidebarAsInline = isSidebarInjectedAsInline(
    values.templateData.theme,
    template.isSideQuest,
    formFactor
  );
  const {
    cardFormFactorStyle,
    checklistFormFactorStyle,
    carouselFormFactorStyle,
    tooltipFormFactorStyle,
    bannerFormFactorStyle,
    modalFormFactorStyle,
    videoGalleryFormFactorStyle,
    orientableFormFactorStyle,
  } = useMemo(
    () => getParsedFormFactorStyle(formFactorStyle),
    [formFactorStyle]
  );

  /**
   * Fixes newly created sidebar contextual guides set as "inline"
   * from not showing the preview due to them being empty.
   */
  const previewKey = useRandomKey([values.templateData.modules.length]);

  const isInlineContextual =
    isInlineContextualGuide(values.templateData.theme) && !isSidebarAsInline;

  const formKey = useMemo(
    () => `${getRootFormKey(formEntityType)}.formFactorStyle`,
    [formEntityType]
  );
  const advancedInlineContextualCustomizationsEnabled =
    useAdvancedInlineContextualCustomizations();
  const [isCustomCssCustomized, setIsCustomCssCustomized] =
    useState<boolean>(false);
  // Used for fields that don't re render on reset.
  const [resetCount, setResetCount] = useState<number>(0);
  const [overridingDefaults, setOverridingDefaults] = useState<boolean>(
    isInlineContextual &&
      advancedInlineContextualCustomizationsEnabled &&
      ['borderColor', 'borderRadius', 'padding', 'advancedPadding'].some(
        (key) => !isNil(cardFormFactorStyle[key])
      )
  );

  const [useAdvancedPadding, setUseAdvancedPadding] = useState<boolean>(
    !isNil(cardFormFactorStyle.advancedPadding)
  );

  const isVertical =
    cardFormFactorStyle?.stepBodyOrientation === StepBodyOrientation.vertical;
  const isHorizontal =
    cardFormFactorStyle?.stepBodyOrientation === StepBodyOrientation.horizontal;

  const checkCustomCss = useCallback(async (customCss: string) => {
    setIsCustomCssCustomized(!(await isUsingDefaultCssTemplate(customCss)));
  }, []);

  useEffect(() => {
    checkCustomCss(uiSettings.embedCustomCss);
  }, [uiSettings.embedCustomCss]);

  const onFormFactorStyleChange = useCallback(
    (field: Field, value) =>
      setFieldValue(
        `${formKey}.${field.key}`,
        field.type === 'number' && isNaN(value) ? undefined : value
      ),
    [formKey, setFieldValue]
  );

  const dotsColorOptions = useMemo(
    () => getCtaColorOptions(formFactor, uiSettings as any, formFactorStyle),
    [uiSettings, formFactorStyle, formFactor]
  );

  const dotsColorOptionSelected = carouselFormFactorStyle?.dotsColor
    ? dotsColorOptions.find(
        (o) => o.value === carouselFormFactorStyle?.dotsColor
      ) || dotsColorOptions[0]
    : dotsColorOptions[0];

  const styleChangeHandlers = useMemo<ChangeHandlers>(
    () =>
      Object.fromEntries(
        [
          { key: 'backgroundOverlayColor', type: 'string' },
          { key: 'backgroundOverlayOpacity', type: 'string' },
          { key: 'hasArrow', type: 'boolean' },
          { key: 'modalSize', type: 'string' },
          { key: 'position', type: 'string' },
          { key: 'tooltipShowOn', type: 'string' },
          { key: 'tooltipSize', type: 'string' },
          { key: 'height', type: 'number' },
          { key: 'stepBodyOrientation', type: 'string' },
          { key: 'mediaOrientation', type: 'string' },
          { key: 'imageWidth', type: 'number' },
          { key: 'ctasOrientation', type: 'string' },
        ].map((field: Field) => [
          field.key,
          (event: ChangeHandlersInput) =>
            onFormFactorStyleChange(
              field,
              typeof event === 'object' ? event?.target?.value : event
            ),
        ])
      ) as ChangeHandlers,
    [onFormFactorStyleChange]
  );

  const transformedGuide = useMemo(() => {
    // Allow components that use the new media
    // to have number attributes mocked by
    // PreviewContainer.
    return supportsUpdatedMediaHandling(values.templateData.theme, formFactor)
      ? undefined
      : {
          ...templateToGuideTransformer(
            addBranchingKeysToPreviewTemplate({
              ...template,
              ...values.templateData,
            } as TemplateValue)
          ),
          designType: template.designType as GuideDesignType,
        };
  }, [template, values.templateData, formFactor]);

  const composedBranchingPaths = useMemo(
    () =>
      branchingPathTransformer(
        !branchingPaths || branchingPaths.length === 0
          ? []
          : composeBranchingPaths({ branchingPaths, templates, modules })
      ),
    [branchingPaths, templates, modules]
  );

  const selectedTag =
    values.templateData?.taggedElements?.[0] || step?.taggedElements?.[0];

  const tagStyle = selectedTag?.style as VisualTagStyleSettings | undefined;

  const isBackgroundOverlay =
    selectedTag?.type === ContextTagType.highlight &&
    tagStyle?.type === VisualTagHighlightType.overlay;

  useEffect(() => {
    if (
      isBackgroundOverlay &&
      tooltipFormFactorStyle?.tooltipShowOn === TooltipShowOn.hover
    ) {
      styleChangeHandlers.tooltipShowOn(TooltipShowOn.load);
    }
  }, [
    isBackgroundOverlay,
    tooltipFormFactorStyle?.tooltipShowOn,
    styleChangeHandlers,
  ]);

  const resetField = useCallback(
    (fieldName: string, resetValue?: string | number | boolean) => () => {
      if (fieldName.includes('padding')) {
        setUseAdvancedPadding(false);
      }
      setFieldValue(fieldName, resetValue || null);
      setResetCount((v) => v + 1);
    },
    [setFieldValue]
  );

  // Reset inline contextual customizations.
  useEffect(() => {
    if (advancedInlineContextualCustomizationsEnabled && isInlineContextual) {
      if (!overridingDefaults) {
        [
          `${formKey}.borderRadius`,
          `${formKey}.borderColor`,
          `${formKey}.padding`,
        ].forEach((field) => resetField(field)());
        setUseAdvancedPadding(false);
      }
      if (!useAdvancedPadding) {
        resetField(`${formKey}.advancedPadding`)();
      }
    }
  }, [
    advancedInlineContextualCustomizationsEnabled,
    isInlineContextual,
    overridingDefaults,
    useAdvancedPadding,
  ]);

  const themeOptions = useMemo(
    () =>
      template.isCyoa || isAnnouncement || isTooltip || isFlow
        ? []
        : getThemeOptions(getCompatibleThemes(values.templateData.theme)),
    [
      values.templateData.theme,
      template.isCyoa,
      isAnnouncement,
      isTooltip,
      isFlow,
    ]
  );

  const [selectedComponent, setSelectedComponent] =
    useState<BentoComponentsEnum>(
      template.designType === GuideDesignType.onboarding
        ? BentoComponentsEnum.inline
        : isInline
        ? BentoComponentsEnum.inlineContext
        : ComposedComponentsEnum[formFactor] || BentoComponentsEnum[formFactor]
    );

  const previewTagType = isFlow
    ? selectedTag?.type
    : values.templateData.pageTargetingType === GuidePageTargetingType.visualTag
    ? (values.templateData?.taggedElements[0]?.type as ContextTagType) ||
      ContextTagType.dot
    : undefined;

  const onSetSelectedComponent = useCallback((option) => {
    setSelectedComponent(option.value);
  }, []);

  /**
   * Handle formFactor changes for the preview.
   * Currently only possible for sidebar contextual
   * guides.
   */
  useEffect(() => {
    if (
      isSidebarAsInline &&
      selectedComponent !== BentoComponentsEnum.inlineContext
    )
      setSelectedComponent(BentoComponentsEnum.inlineContext);
    else if (
      isSidebarEmbed(formFactor) &&
      selectedComponent !== BentoComponentsEnum.sidebar
    )
      setSelectedComponent(BentoComponentsEnum.sidebar);
  }, [formFactor]);

  const paddingFieldProps = useMemo(() => {
    const defaultValue = useAdvancedPadding
      ? cardFormFactorStyle.advancedPadding
      : cardFormFactorStyle.padding ||
        uiSettings.inlineContextualStyle.padding ||
        0;

    return {
      key: `padding-${resetCount}`,
      name: `${formKey}.${useAdvancedPadding ? 'advancedPadding' : 'padding'}`,
      fontSize: 'sm',
      defaultValue,
      disabled: !canEditTemplate,
      inputProps: {
        inputMode: 'numeric',
        defaultValue,
        min: 0,
        max: 100,
        minimalist: true,
      },
      helperText: (
        <Box fontSize="xs" color="gray.600" display="inline-flex">
          Uses {uiSettings.inlineContextualStyle.padding || 0}
          px by default -
          <InlineResetButton
            ml="2px"
            onClick={resetField(
              `${formKey}.padding`,
              uiSettings.inlineContextualStyle.padding || 0
            )}
          />
        </Box>
      ),
    };
  }, [
    formFactorStyle,
    uiSettings,
    useAdvancedPadding,
    formKey,
    resetCount,
    canEditTemplate,
  ]);

  // Use for labels that change
  // based on the context.
  const fieldLabels = useMemo(() => {
    return {
      header:
        template.designType === GuideDesignType.onboarding || isSidebarAsInline
          ? 'Step container options'
          : isVideoGallery
          ? 'Gallery options'
          : isModal
          ? 'Modal options'
          : isTooltip || isFlow
          ? 'Tooltip options'
          : isBanner
          ? 'Banner options'
          : 'Card options',
      backgroundColor: isVideoGallery
        ? 'Gallery background color'
        : 'Background color',
    };
  }, [
    template.designType,
    isVideoGallery,
    isModal,
    isTooltip,
    isBanner,
    isFlow,
    isSidebarAsInline,
  ]);

  const orientationSettingsToShow = getOrientationSettingsToShow({
    mediaReferenceFlags,
    previewComponent: selectedComponent,
    theme: values.templateData.theme,
    stepBodyOrientation: orientableFormFactorStyle?.stepBodyOrientation,
    formFactor: formFactor,
  });

  const otherSettingsToShow = {
    hideStepGroupTitle:
      (isCompact || isFlat) &&
      !isSingleStepGuide(
        template.theme as Theme,
        template.formFactor as GuideFormFactor
      ),
    hideCompletedSteps: isGuideEligibleToHideCompletedSteps(
      values.templateData.theme
    ),
  };

  /**
   * Note: Make sure that defaults are aligned to the behavior
   * of each formFactor.
   */
  const defaultValues = useMemo(() => {
    return {
      backgroundColor:
        tooltipFormFactorStyle?.backgroundColor ||
        (isBanner ? uiSettings.primaryColorHex : '#FFFFFF'),
      textColor:
        tooltipFormFactorStyle?.textColor ||
        (isBanner ? '#FFFFFF' : isModal ? '' : uiSettings.fontColorHex),
    };
  }, [formFactorStyle, isBanner, uiSettings, isModal]);

  return (
    <Box display="flex" flexDir="row" gridGap="10" mt="4">
      {/* Styles */}
      {template.isCyoa && (
        <Box
          width={EDITOR_LEFT_WIDTH}
          minW={EDITOR_LEFT_WIDTH}
          maxW="750px"
          display="flex"
          flexDirection="column"
        >
          <EmbedLocationForm
            header="Location"
            template={template}
            currentValues={values}
            mb="10"
          />
        </Box>
      )}
      {!template.isCyoa && (
        <Box
          width={EDITOR_LEFT_WIDTH}
          minW={EDITOR_LEFT_WIDTH}
          maxW="750px"
          display="flex"
          flexDirection="column"
        >
          <EmbedLocationForm
            header="Location"
            template={template}
            currentValues={values}
            mb="10"
          />
          {/* Section header */}
          <Flex mb="3" gap="2">
            <Text my="auto" fontSize="lg" fontWeight="bold" color="gray.800">
              Style options
            </Text>
            {isCustomCssCustomized && (
              <CustomizedBadge
                h="22px"
                my="auto"
                tooltipLabel="You have custom styling applied"
                tooltipPlacement="top"
              />
            )}
          </Flex>

          <Flex flexDir="column" gap={4}>
            {themeOptions.length > 0 && (
              <SelectField
                name="templateData.theme"
                label="Guide layout"
                options={themeOptions}
                defaultValue={values.templateData.theme}
                disabled={!canEditTemplate}
              />
            )}
            {otherSettingsToShow.hideStepGroupTitle && (
              <Box display="flex" gap="1">
                <SwitchField
                  name={`${formKey}.hideStepGroupTitle`}
                  w="auto"
                  variant="secondary"
                  defaultValue={
                    !multiModule ||
                    !!checklistFormFactorStyle.hideStepGroupTitle
                  }
                  disabled={!canEditTemplate || !multiModule}
                  checkedOption={{
                    value: false,
                    label: 'Show step group titles',
                  }}
                  uncheckedOption={{
                    value: true,
                  }}
                  as="checkbox"
                />
                <Tooltip
                  placement="top"
                  label={
                    multiModule
                      ? 'Breaks up the list of steps by their step group title'
                      : 'Step group titles will not be shown if there is only one step group'
                  }
                >
                  <InfoOutlinedIcon fontSize="small" />
                </Tooltip>
              </Box>
            )}
            {otherSettingsToShow.hideCompletedSteps &&
              selectedComponent === BentoComponentsEnum.sidebar && (
                <SwitchField
                  name={`${formKey}.hideCompletedSteps`}
                  w="auto"
                  variant="secondary"
                  defaultValue={!!checklistFormFactorStyle.hideCompletedSteps}
                  disabled={!canEditTemplate}
                  checkedOption={{
                    value: true,
                    label: 'Hide completed steps',
                  }}
                  uncheckedOption={{
                    value: false,
                  }}
                  as="checkbox"
                />
              )}
            {selectedComponent !== BentoComponentsEnum.sidebar && (
              <>
                {(isVideoGallery ||
                  isAnnouncement ||
                  isTooltip ||
                  isCard ||
                  isCarousel) && (
                  <Flex flex="1" direction="row" gap={1} mt="2">
                    <Box width="fit">
                      <SwitchField
                        name={`${formKey}.canDismiss`}
                        disabled={!canEditTemplate}
                        checkedOption={{
                          value: false,
                          label: 'Prevent user from dismissing',
                        }}
                        defaultValue={!!videoGalleryFormFactorStyle?.canDismiss}
                        uncheckedOption={{ value: true }}
                        as="checkbox"
                      />
                    </Box>
                    {isModal && (
                      <SimpleInfoTooltip label="If checked, the modal will not be dismissed if a user clicks outside of it." />
                    )}
                  </Flex>
                )}
                <Accordion defaultIndex={0} allowToggle>
                  <AccordionItem border="none" mb="2" bg="gray.50">
                    <AccordionButton px="3">
                      <Text fontSize="md" fontWeight="bold">
                        {fieldLabels.header}
                      </Text>
                      <AccordionIcon ml="2" />
                    </AccordionButton>
                    <AccordionPanel
                      display="flex"
                      flexDir="column"
                      px="3"
                      gap="4"
                    >
                      {(isTooltip || isBanner || isFlow) && (
                        <>
                          <Box
                            display="flex"
                            w="full"
                            gap="6"
                            justifyContent="space-between"
                            mb={4}
                          >
                            <Box flex="1 0">
                              <Text as="legend" fontSize="sm">
                                Background color
                              </Text>
                              <ColorField
                                name={`${formKey}.backgroundColor`}
                                disabled={!canEditTemplate}
                                defaultValue={defaultValues.backgroundColor}
                              />
                            </Box>
                            <Box flex="1 0">
                              <Text as="legend" fontSize="sm">
                                Text color
                              </Text>
                              <ColorField
                                name={`${formKey}.textColor`}
                                disabled={!canEditTemplate}
                                defaultValue={defaultValues.textColor}
                              />
                            </Box>
                          </Box>

                          {(isTooltip || isFlow) && (
                            <>
                              <Field>
                                {() => (
                                  <FormControl as="fieldset" mb={4}>
                                    <FormLabel as="legend" fontSize="sm">
                                      {isFlow && (
                                        <>
                                          Show first tooltip on:{' '}
                                          <SimpleInfoTooltip label="Tooltips after the first will appear on page load; users do not need to hover" />
                                        </>
                                      )}
                                      {isTooltip && <>Show tooltip on:</>}
                                    </FormLabel>
                                    <RadioGroup
                                      value={
                                        tooltipFormFactorStyle?.tooltipShowOn
                                      }
                                      defaultValue={TooltipShowOn.load}
                                      onChange={
                                        styleChangeHandlers.tooltipShowOn
                                      }
                                      alignment="horizontal"
                                      isDisabled={!canEditTemplate}
                                    >
                                      <Tooltip
                                        label="Background overlays can only show on page load"
                                        placement="top"
                                        isDisabled={!isBackgroundOverlay}
                                      >
                                        <Box>
                                          <Radio
                                            name="tooltipShowOn"
                                            value={TooltipShowOn.hover}
                                            label="Hover on tag"
                                            isDisabled={isBackgroundOverlay}
                                          />
                                        </Box>
                                      </Tooltip>
                                      <Radio
                                        name="tooltipShowOn"
                                        value={TooltipShowOn.load}
                                        label="Page load"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                )}
                              </Field>

                              <Field>
                                {() => (
                                  <FormControl as="fieldset" mb={4}>
                                    <FormLabel as="legend" fontSize="sm">
                                      Tooltip arrow
                                    </FormLabel>
                                    <RadioGroup
                                      defaultValue={
                                        '' + !!tooltipFormFactorStyle?.hasArrow
                                      }
                                      onChange={(value) =>
                                        styleChangeHandlers.hasArrow(
                                          value === 'true'
                                        )
                                      }
                                      alignment="vertical"
                                      isDisabled={!canEditTemplate}
                                    >
                                      <Radio
                                        name="hasArrow"
                                        value="true"
                                        label="Show arrow"
                                      />
                                      <Radio
                                        name="hasArrow"
                                        value="false"
                                        label="Hide arrow"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                )}
                              </Field>

                              <Field>
                                {() => (
                                  <FormControl as="fieldset" mb={4}>
                                    <FormLabel as="legend" fontSize="sm">
                                      Tooltip size
                                    </FormLabel>
                                    <RadioGroup
                                      value={
                                        tooltipFormFactorStyle?.tooltipSize
                                      }
                                      defaultValue={TooltipSize.medium}
                                      onChange={styleChangeHandlers.tooltipSize}
                                      alignment="vertical"
                                      isDisabled={!canEditTemplate}
                                    >
                                      <Radio
                                        name="tooltipSize"
                                        value={TooltipSize.large}
                                        label="Large"
                                      />
                                      <Radio
                                        name="tooltipSize"
                                        value={TooltipSize.medium}
                                        label="Medium"
                                      />
                                      <Radio
                                        name="tooltipSize"
                                        value={TooltipSize.small}
                                        label="Small"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                )}
                              </Field>
                            </>
                          )}
                          {isBanner && (
                            <>
                              <RadioGroupField
                                name={`${formKey}.bannerType`}
                                label="Style"
                                fontSize="sm"
                                disabled={!canEditTemplate}
                                optionMr="0"
                                defaultValue={bannerFormFactorStyle.bannerType}
                                alignment="horizontal"
                                options={[
                                  {
                                    label: 'Floating',
                                    value: BannerTypeEnum.floating,
                                  },
                                  {
                                    label: 'Inline',
                                    value: BannerTypeEnum.inline,
                                  },
                                ]}
                                mb="4"
                                helperText="Floating banners show on top of the page.
                            Inline banners push the page down."
                              />
                              <RadioGroupField
                                name={`${formKey}.bannerPosition`}
                                label="Position"
                                fontSize="sm"
                                disabled={!canEditTemplate}
                                optionMr="0"
                                defaultValue={
                                  bannerFormFactorStyle.bannerPosition
                                }
                                alignment="horizontal"
                                options={[
                                  { label: 'Top', value: BannerPosition.top },
                                  {
                                    label: 'Bottom',
                                    value: BannerPosition.bottom,
                                  },
                                ]}
                              />
                            </>
                          )}
                        </>
                      )}
                      {isModal && (
                        <>
                          <Flex gap="6" mb="4">
                            <ColorField
                              label="Background color"
                              name={`${formKey}.backgroundColor`}
                              disabled={!canEditTemplate}
                              defaultValue={defaultValues.backgroundColor}
                            />
                            <ColorField
                              label="Text color"
                              name={`${formKey}.textColor`}
                              disabled={!canEditTemplate}
                              defaultValue={defaultValues.textColor}
                              showUnset
                            />
                          </Flex>
                          <Field>
                            {() => (
                              <FormControl as="fieldset">
                                <FormLabel as="legend" fontSize="sm">
                                  Modal size
                                </FormLabel>
                                <RadioGroup
                                  value={modalFormFactorStyle?.modalSize}
                                  onChange={styleChangeHandlers.modalSize}
                                  alignment="vertical"
                                  isDisabled={!canEditTemplate}
                                >
                                  <Radio
                                    name="modalSize"
                                    value={ModalSize.large}
                                    label="Large"
                                  />
                                  <Radio
                                    name="modalSize"
                                    value={ModalSize.medium}
                                    label="Medium"
                                  />
                                  <Radio
                                    name="modalSize"
                                    value={ModalSize.small}
                                    label="Small"
                                  />
                                </RadioGroup>
                              </FormControl>
                            )}
                          </Field>
                          <Flex flex="1" direction="row" gap={1} my="4">
                            <Box width="fit">
                              <SwitchField
                                name={`${formKey}.hasBackgroundOverlay`}
                                disabled={!canEditTemplate}
                                checkedOption={{
                                  value: true,
                                  label: `Add background overlay behind ${
                                    isModal ? 'modal' : 'tooltip'
                                  }`,
                                }}
                                defaultValue={
                                  !!modalFormFactorStyle?.hasBackgroundOverlay
                                }
                                uncheckedOption={{ value: false }}
                                as="checkbox"
                              />
                            </Box>
                            {isModal && (
                              <SimpleInfoTooltip label="If not checked, users can interact with your app even while the modal is live" />
                            )}
                          </Flex>
                          <Field>
                            {() => (
                              <FormControl as="fieldset">
                                <FormLabel as="legend" fontSize="sm">
                                  Modal position
                                </FormLabel>
                                <RadioGroup
                                  value={modalFormFactorStyle?.position}
                                  onChange={styleChangeHandlers.position}
                                  alignment="vertical"
                                  isDisabled={!canEditTemplate}
                                >
                                  <Radio
                                    name="modalPosition"
                                    value={ModalPosition.center}
                                    label="Page center"
                                  />
                                  <Box display="flex" flexDir="row" gap="2">
                                    <Box
                                      display="flex"
                                      flexDir="column"
                                      gap="2"
                                    >
                                      <Radio
                                        name="modalPosition"
                                        value={ModalPosition.topLeft}
                                        label="Top left"
                                      />
                                      <Radio
                                        name="modalPosition"
                                        value={ModalPosition.bottomLeft}
                                        label="Bottom left"
                                      />
                                    </Box>
                                    <Box
                                      display="flex"
                                      flexDir="column"
                                      gap="2"
                                    >
                                      <Radio
                                        name="modalPosition"
                                        value={ModalPosition.topRight}
                                        label="Top right"
                                      />
                                      <Radio
                                        name="modalPosition"
                                        value={ModalPosition.bottomRight}
                                        label="Bottom right"
                                      />
                                    </Box>
                                  </Box>
                                </RadioGroup>
                              </FormControl>
                            )}
                          </Field>
                        </>
                      )}
                      {(isInlineContextual ||
                        template.designType === GuideDesignType.onboarding ||
                        isSidebarAsInline) && (
                        <>
                          {template.designType !== GuideDesignType.onboarding &&
                            !isSidebarAsInline && (
                              <>
                                <Box
                                  display="flex"
                                  w="full"
                                  gap="6"
                                  justifyContent="space-between"
                                >
                                  <ColorField
                                    name={`${formKey}.backgroundColor`}
                                    label={fieldLabels.backgroundColor}
                                    defaultValue={defaultValues.backgroundColor}
                                    disabled={!canEditTemplate}
                                    flex="1 0"
                                    showUnset
                                  />
                                  <ColorField
                                    name={`${formKey}.textColor`}
                                    label="Text color"
                                    defaultValue={defaultValues.textColor}
                                    flex="1 0"
                                    disabled={!canEditTemplate}
                                    showUnset
                                  />
                                </Box>
                                {isVideoGallery && (
                                  <Box
                                    display="flex"
                                    w="full"
                                    mt="4"
                                    gap="6"
                                    justifyContent="space-between"
                                  >
                                    <ColorField
                                      name={`${formKey}.selectedBackgroundColor`}
                                      label="Selected video background color"
                                      defaultValue={
                                        videoGalleryFormFactorStyle.selectedBackgroundColor ||
                                        uiSettings.secondaryColorHex
                                      }
                                      disabled={!canEditTemplate}
                                      flex="1 0"
                                    />
                                    <ColorField
                                      name={`${formKey}.statusLabelColor`}
                                      label="Status label text color"
                                      defaultValue={
                                        videoGalleryFormFactorStyle?.statusLabelColor ||
                                        uiSettings.primaryColorHex
                                      }
                                      flex="1 0"
                                      disabled={!canEditTemplate}
                                    />
                                  </Box>
                                )}
                                <Flex w="full" flexDir="column" gap="2" my="4">
                                  {advancedInlineContextualCustomizationsEnabled && (
                                    <SwitchField
                                      onChange={setOverridingDefaults as any}
                                      name="overrideDefaults"
                                      fontWeight="bold"
                                      defaultValue={overridingDefaults}
                                      disabled={!canEditTemplate}
                                      checkedOption={{
                                        value: true,
                                        label: 'Override defaults',
                                      }}
                                      uncheckedOption={{
                                        value: false,
                                      }}
                                    />
                                  )}
                                  {overridingDefaults ? (
                                    <Flex
                                      flexDir="column"
                                      gap="4"
                                      bg="white"
                                      p="2"
                                    >
                                      <Flex gap="6" w="full">
                                        <ColorField
                                          name={`${formKey}.borderColor`}
                                          label="Border color"
                                          defaultValue={
                                            cardFormFactorStyle.borderColor ||
                                            uiSettings.inlineContextualStyle
                                              .borderColor ||
                                            '#00000000'
                                          }
                                          flex="1 0"
                                          disabled={!canEditTemplate}
                                          helperText={
                                            <Box
                                              fontSize="xs"
                                              color="gray.600"
                                              display="inline-flex"
                                            >
                                              Uses
                                              <InlineColorBox
                                                bg={
                                                  uiSettings
                                                    .inlineContextualStyle
                                                    .borderColor
                                                }
                                                mx="2px"
                                                my="auto"
                                              />
                                              {!uiSettings.inlineContextualStyle
                                                .borderColor ||
                                              isTransparent(
                                                uiSettings.inlineContextualStyle
                                                  .borderColor
                                              )
                                                ? 'transparent'
                                                : uiSettings
                                                    .inlineContextualStyle
                                                    .borderColor}{' '}
                                              by default -
                                              <InlineResetButton
                                                ml="2px"
                                                onClick={resetField(
                                                  `${formKey}.borderColor`
                                                )}
                                              />
                                            </Box>
                                          }
                                          allowTransparent
                                        />
                                        <NumberField
                                          key={`borderRadius-${resetCount}`}
                                          name={`${formKey}.borderRadius`}
                                          label="Border radius (px)"
                                          flex="1 0"
                                          inputProps={{
                                            inputMode: 'numeric',
                                            defaultValue:
                                              cardFormFactorStyle.borderRadius ||
                                              uiSettings.inlineContextualStyle
                                                .borderRadius ||
                                              0,
                                            min: 0,
                                            max: 100,
                                            // neverEmpty: true,
                                            minimalist: true,
                                          }}
                                          disabled={!canEditTemplate}
                                          helperText={
                                            <Box
                                              fontSize="xs"
                                              color="gray.600"
                                              display="inline-flex"
                                            >
                                              Uses{' '}
                                              {uiSettings.inlineContextualStyle
                                                .borderRadius || 0}
                                              px by default -
                                              <InlineResetButton
                                                ml="2px"
                                                onClick={resetField(
                                                  `${formKey}.borderRadius`
                                                )}
                                              />
                                            </Box>
                                          }
                                        />
                                      </Flex>
                                      <Flex>
                                        <Flex
                                          flexDir="column"
                                          flex="1 0"
                                          gap="2"
                                        >
                                          <RadioGroupField
                                            name="advancedPaddingRadioGroup"
                                            label="Padding"
                                            fontSize="sm"
                                            onChange={(value) => {
                                              setUseAdvancedPadding(
                                                value === 'advancedPadding'
                                              );
                                            }}
                                            disabled={!canEditTemplate}
                                            optionMr="0"
                                            defaultValue={
                                              useAdvancedPadding
                                                ? 'advancedPadding'
                                                : 'padding'
                                            }
                                            alignment="horizontal"
                                            options={[
                                              {
                                                label: 'Normal (px)',
                                                value: 'padding',
                                              },
                                              {
                                                label: 'Advanced',
                                                value: 'advancedPadding',
                                              },
                                            ]}
                                          />
                                          {useAdvancedPadding ? (
                                            <TextField
                                              {...(paddingFieldProps as any)}
                                              placeholder="4px 4px 8px 8px"
                                            />
                                          ) : (
                                            <NumberField
                                              {...(paddingFieldProps as any)}
                                            />
                                          )}
                                        </Flex>
                                        {/** Dummy box while more settings are added. */}
                                        <Box ml="5" flex="1 0" />
                                      </Flex>
                                    </Flex>
                                  ) : (
                                    <Flex flexDir="column" w="full" gap="4">
                                      <Flex gap="6">
                                        <ReadOnlyField label="Border color">
                                          <Box
                                            color="gray.600"
                                            display="inline-flex"
                                          >
                                            <InlineColorBox
                                              bg={
                                                uiSettings.inlineContextualStyle
                                                  .borderColor
                                              }
                                              mx="2px"
                                              my="auto"
                                            />
                                            {!uiSettings.inlineContextualStyle
                                              .borderColor ||
                                            isTransparent(
                                              uiSettings.inlineContextualStyle
                                                .borderColor
                                            )
                                              ? 'transparent'
                                              : uiSettings.inlineContextualStyle
                                                  .borderColor}
                                          </Box>
                                        </ReadOnlyField>
                                        <ReadOnlyField label="Border radius">
                                          {cardFormFactorStyle.borderRadius ||
                                            uiSettings.inlineContextualStyle
                                              .borderRadius ||
                                            0}
                                          px
                                        </ReadOnlyField>
                                      </Flex>
                                      <Flex gap="6">
                                        <ReadOnlyField label="Padding">
                                          {cardFormFactorStyle.advancedPadding ||
                                            cardFormFactorStyle.padding ||
                                            uiSettings.inlineContextualStyle
                                              .padding ||
                                            0}
                                          {useAdvancedPadding ? '' : 'px'}
                                        </ReadOnlyField>
                                        {/** Dummy box while more settings are added. */}
                                        <Box ml="5" flex="1 0" />
                                      </Flex>
                                    </Flex>
                                  )}
                                </Flex>

                                {isCarousel ? (
                                  <Box
                                    display="flex"
                                    w="full"
                                    gap="6"
                                    justifyContent="space-between"
                                  >
                                    <Box flex="1 0">
                                      <SelectField
                                        label="Navigation Dots color"
                                        alignSelf="self-start"
                                        name={`${formKey}.dotsColor`}
                                        options={dotsColorOptions}
                                        disabled={!canEditTemplate}
                                        defaultValue={
                                          dotsColorOptionSelected.value
                                        }
                                        components={{
                                          Option: OptionWithSubLabel(),
                                          SingleValue: SingleValueWithIcon(),
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                ) : (
                                  <>
                                    <Box>
                                      <Flex
                                        w="full"
                                        gap="6"
                                        justifyContent="space-between"
                                      >
                                        <Box flex="1 0">
                                          <FormLabel as="legend" fontSize="sm">
                                            Max-width (px)
                                          </FormLabel>
                                          {/** TODO: Change to Select. */}
                                          <Input
                                            value={
                                              values.templateData.inlineEmbed
                                                ?.maxWidth || 'Fill container'
                                            }
                                            fontSize="sm"
                                            disabled
                                          />
                                        </Box>
                                        <Box flex="1 0">
                                          <FormLabel as="legend" fontSize="sm">
                                            Alignment
                                          </FormLabel>
                                          {/** TODO: Change to Select. */}
                                          <Input
                                            value={capitalizeFirstLetter(
                                              values.templateData.inlineEmbed
                                                ?.alignment || 'auto'
                                            )}
                                            fontSize="sm"
                                            disabled
                                          />
                                        </Box>
                                      </Flex>
                                    </Box>
                                  </>
                                )}
                              </>
                            )}

                          {!isVideoGallery && (
                            <FormControl as="fieldset">
                              <FormLabel as="legend" fontSize="sm">
                                Step height (px)
                              </FormLabel>
                              <NumberInput
                                inputMode="numeric"
                                onChange={styleChangeHandlers.height}
                                value={cardFormFactorStyle.height || ''}
                                placeholder={getStepHeightPlaceholder(
                                  values.templateData.theme
                                )}
                                disabled={!canEditTemplate}
                                min={0}
                                minimalist
                              />
                              <StepHeightHelperText
                                isHorizontal={isHorizontal}
                              />
                            </FormControl>
                          )}
                          {otherSettingsToShow.hideCompletedSteps && (
                            <SwitchField
                              name={`${formKey}.hideCompletedSteps`}
                              w="auto"
                              variant="secondary"
                              defaultValue={
                                !!checklistFormFactorStyle.hideCompletedSteps
                              }
                              disabled={!canEditTemplate}
                              checkedOption={{
                                value: true,
                                label: 'Hide completed steps',
                              }}
                              uncheckedOption={{
                                value: false,
                              }}
                              as="checkbox"
                            />
                          )}
                        </>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                  {!isVideoGallery && orientationSettingsToShow.isAnyOn && (
                    <AccordionItem border="none" mb="2" bg="gray.50">
                      <AccordionButton px="3">
                        <Text fontSize="md" fontWeight="bold">
                          Media options
                        </Text>
                        <AccordionIcon ml="2" />
                      </AccordionButton>
                      <AccordionPanel px="3">
                        <OrientationAndSizeSettings
                          setFieldValue={setFieldValue}
                          templateData={values.templateData}
                          formKey={formKey}
                          disabled={!canEditTemplate}
                          formFactorStyle={orientableFormFactorStyle}
                          previewComponent={selectedComponent}
                          theme={values.templateData.theme}
                          multiModule={multiModule}
                          isCyoa={template.isCyoa}
                          showSettings={orientationSettingsToShow.values}
                        />
                      </AccordionPanel>
                    </AccordionItem>
                  )}
                  <AccordionItem border="none" mb="2" bg="gray.50">
                    <AccordionButton px="3">
                      <Text fontSize="md" fontWeight="bold">
                        Call-to-action button options
                      </Text>
                      <AccordionIcon ml="2" />
                    </AccordionButton>
                    <AccordionPanel px="3">
                      <FormControl as="fieldset">
                        <RadioGroup
                          value={checklistFormFactorStyle.ctasOrientation}
                          onChange={styleChangeHandlers.ctasOrientation}
                          isDisabled={!canEditTemplate}
                        >
                          <Flex
                            alignItems="flex-end"
                            justifyContent="space-evenly"
                            gap={4}
                            borderWidth={1}
                            borderColor="gray.100"
                            bg="white"
                            borderRadius="md"
                            p={6}
                            w="full"
                          >
                            <Flex direction="column" alignItems="center">
                              <CtasLeft />
                              <Radio
                                name="ctasOrientation"
                                value={CtasOrientation.left}
                                label="Left"
                                mr="0"
                              />
                            </Flex>
                            <Flex direction="column" alignItems="center">
                              <CtasRight />
                              <Radio
                                name="ctasOrientation"
                                value={CtasOrientation.right}
                                label="Right"
                                mr="0"
                              />
                            </Flex>
                            {isBanner ? (
                              <Flex direction="column" alignItems="center">
                                <CtasInline />
                                <Radio
                                  name="ctasOrientation"
                                  value={CtasOrientation.inline}
                                  label="Inline"
                                  mr="0"
                                />
                              </Flex>
                            ) : (
                              <Flex direction="column" alignItems="center">
                                <CtasSpaceBetween />
                                <Radio
                                  name="ctasOrientation"
                                  value={CtasOrientation.spaceBetween}
                                  label="Space between"
                                  mr="0"
                                />
                              </Flex>
                            )}
                          </Flex>
                        </RadioGroup>
                      </FormControl>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </>
            )}
          </Flex>
        </Box>
      )}

      {/* Preview */}
      <Box
        display="flex"
        flexDir="column"
        flexGrow="1"
        maxW={px(1000)}
        gap="2"
        style={{ marginInlineStart: '0' }}
      >
        <HStack justifyContent="space-between" alignItems="flex-end">
          {template.designType === GuideDesignType.onboarding ? (
            <ButtonGroup
              options={GUIDES_CHECKLISTS_PREVIEW_OPTIONS}
              onOptionSelected={onSetSelectedComponent}
              buttonProps={{ minW: 's' }}
            />
          ) : (
            <Box fontSize="sm" fontWeight="bold" color="gray.800">
              Preview
            </Box>
          )}
          <Box>
            <ViewInAppButton />
          </Box>
        </HStack>
        <PreviewContainer
          key={previewKey}
          component={selectedComponent}
          branchingPaths={composedBranchingPaths}
          selectedStep={step}
          inputGuide={transformedGuide}
          tagType={previewTagType}
          tagStyle={tagStyle}
          formFactorStyle={formFactorStyle}
          sidebarAlwaysExpanded={
            selectedComponent === BentoComponentsEnum.sidebar
          }
          showTooltipsPlacementCallout={isTooltip}
          contextual={isTooltip || isInlineContextual || isFlow}
          narrowGuide={isCard && isVertical}
          previewBoxProps={{ py: 0 }}
        />
      </Box>
    </Box>
  );
};

export const STYLE_TAB_QUERY = graphql`
  query StyleTabQuery(
    $templateEntityId: EntityId!
    $templateEntityIds: [EntityId!]
    $moduleEntityIds: [EntityId!]
  ) {
    uiSettings {
      primaryColorHex
      secondaryColorHex
      fontColorHex
      theme
      cyoaOptionBackgroundColor
      embedCustomCss
      isCyoaOptionBackgroundColorDark
      inlineContextualStyle {
        borderRadius
        borderColor
        padding
      }
      modalsStyle {
        paddingX
        paddingY
        shadow
        borderRadius
        backgroundOverlayColor
        backgroundOverlayOpacity
      }
      tooltipsStyle {
        paddingX
        paddingY
        shadow
        borderRadius
      }
      ctasStyle {
        paddingX
        paddingY
        fontSize
        lineHeight
        borderRadius
      }
      bannersStyle {
        padding
        shadow
        borderRadius
      }
      responsiveVisibility {
        all
      }
      cyoaTextColor
      borderColor
    }
    previewTemplate: findTemplate(entityId: $templateEntityId) {
      taggedElements {
        entityId
        type
        style {
          ...EditTag_taggedElementStyle @relay(mask: false)
        }
      }
      inlineEmbed {
        alignment
        maxWidth
      }
    }
    ...Root_branchingTargets @relay(mask: false)
  }
`;

export default function StyleTabQueryRenderer(
  cProps: React.PropsWithChildren<Props>
) {
  const { templateEntityId } = cProps;
  const {
    values: { templateData },
  } = useFormikContext<TemplateFormValues>();

  const branchingPaths = useMemo(
    () =>
      templateData?.modules
        .flatMap((m) =>
          m.stepPrototypes.flatMap((sp) =>
            sp.branchingPathData?.map((bp) => {
              return {
                ...bp,
                branchingKey: sp.entityId,
                entityType: bp.moduleEntityId
                  ? BranchingType.module
                  : BranchingType.guide,
              };
            })
          )
        )
        .filter((bp) => !!bp),
    [templateData.modules]
  );

  const [templateEntityIds, moduleEntityIds] = useMemo(
    () => branchingPathsToEntityIdList(branchingPaths),
    [branchingPaths]
  );

  const { data: styleQueryResponse } = useQueryAsHook(
    TemplateStyleTabQuery,
    {
      templateEntityId,
      moduleEntityIds,
      templateEntityIds,
    },
    {
      dependencies: [templateEntityId, templateEntityIds, moduleEntityIds],
    }
  );

  return styleQueryResponse ? (
    <StyleTab
      branchingPaths={branchingPaths}
      {...cProps}
      {...styleQueryResponse}
    />
  ) : (
    <BentoLoadingSpinner />
  );
}
