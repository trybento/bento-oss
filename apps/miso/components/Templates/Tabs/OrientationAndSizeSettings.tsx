import { FormikHelpers } from 'formik';
import {
  Text,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Accordion,
  AccordionPanel,
  AccordionIcon,
  AccordionItem,
  AccordionButton,
  BoxProps,
} from '@chakra-ui/react';
import {
  getGuideThemeFlags,
  horizontalAlignmentOptions,
  isCompactTheme,
  isFlatTheme,
  isTimelineTheme,
  verticalAlignmentOptions,
} from 'bento-common/data/helpers';
import {
  AlignmentEnum,
  ChecklistStyle,
  GuideDesignType,
  GuideFormFactor,
  MediaOrientation,
  OrientableFormFactorStyle,
  StepBodyOrientation,
  Theme,
  TooltipStyle,
  VerticalAlignmentEnum,
  VerticalMediaOrientation,
} from 'bento-common/types';
import HorizontalStepOrientation from 'icons/HorizontalStepOrientation';
import VerticalStepOrientation from 'icons/VerticalStepOrientation';
import React, { useCallback, useEffect, useMemo } from 'react';
import NumberInput from 'system/NumberInput';
import Radio from 'system/Radio';
import RadioGroup from 'system/RadioGroup';
import { px } from 'bento-common/utils/dom';
import FiftyPercentWidth from 'icons/FiftyPercentWidth';
import ThrityPercentWidth from 'icons/ThirtyPercentWidth';
import FixedWidth from 'icons/FixedWidth';
import { pxToNumber } from 'bento-common/frontend/htmlElementHelpers';
import { TemplateValue } from 'bento-common/types/templateData';
import {
  isModalGuide,
  isSingleStepGuide,
  isTooltipGuide,
  isFlowGuide,
  supportsUpdatedMediaHandling,
} from 'bento-common/utils/formFactor';
import { MediaReferenceFlags, useTemplate } from 'providers/TemplateProvider';
import { BentoComponentsEnum } from 'types';
import RadioGroupField from 'components/common/InputFields/RadioGroupField';
import ColorField from 'bento-common/components/ColorField';
import NumberField from 'components/common/InputFields/NumberField';

export const getOrientationSettingsToShow = ({
  previewComponent,
  theme,
  formFactor,
  mediaReferenceFlags,
  stepBodyOrientation,
}: {
  previewComponent: BentoComponentsEnum;
  theme: Theme | undefined;
  formFactor: GuideFormFactor | undefined;
  mediaReferenceFlags: MediaReferenceFlags;
  stepBodyOrientation: StepBodyOrientation | undefined;
}) => {
  const inlineSelected = previewComponent === BentoComponentsEnum.inline;
  const isTooltip = isTooltipGuide(formFactor);
  const isFlow = isFlowGuide(formFactor);
  const isModal = isModalGuide(formFactor);
  const { isNested, isCarousel } = getGuideThemeFlags(theme);
  const singleStepGuide = isSingleStepGuide(theme, formFactor);

  const show = {
    imageOrientation:
      (!isNested && !isCarousel && inlineSelected) ||
      isTooltip ||
      isModal ||
      isFlow,
    mediaOrientation: stepBodyOrientation === StepBodyOrientation.horizontal,
    verticalMediaOrientation:
      stepBodyOrientation === StepBodyOrientation.vertical &&
      !(isNested && !(singleStepGuide || isFlow)),
    verticalMediaAlignment:
      !mediaReferenceFlags.hasEdgeToEdge &&
      supportsUpdatedMediaHandling(theme, formFactor) &&
      stepBodyOrientation === StepBodyOrientation.horizontal,
    horizontalMediaAlignment:
      !mediaReferenceFlags.hasEdgeToEdge &&
      !mediaReferenceFlags.hasVideo &&
      supportsUpdatedMediaHandling(theme, formFactor) &&
      stepBodyOrientation === StepBodyOrientation.vertical,
    imageWidth:
      !mediaReferenceFlags.hasVideo &&
      !mediaReferenceFlags.hasNumberAttribute &&
      stepBodyOrientation === StepBodyOrientation.horizontal,
    numberAttributeStyles: mediaReferenceFlags.hasNumberAttribute,
  };

  const values = {
    ...show,
    mediaOptions:
      (inlineSelected || supportsUpdatedMediaHandling(theme, formFactor)) &&
      (show.imageOrientation ||
        show.mediaOrientation ||
        show.verticalMediaOrientation ||
        show.verticalMediaAlignment ||
        show.horizontalMediaAlignment ||
        show.imageWidth ||
        show.numberAttributeStyles),
  };

  return { values, isAnyOn: Object.values(values).some((v) => v) };
};

type ShowSettings = ReturnType<typeof getOrientationSettingsToShow>['values'];

type Props = {
  setFieldValue: FormikHelpers<{}>['setFieldValue'];
  templateData: TemplateValue;
  formKey: string;
  label?: string;
  groupAsAccordion?: boolean;
  formFactorStyle: OrientableFormFactorStyle;
  theme: Theme;
  multiModule: boolean;
  isCyoa: boolean;
  disabled?: boolean;
  previewComponent: BentoComponentsEnum;
  showSettings: ShowSettings;
} & BoxProps;

type ChangeHandlersInput =
  | React.ChangeEvent<HTMLInputElement>
  | string
  | number
  | boolean
  | undefined
  | null;

type ChangeHandlers = {
  [key in keyof OrientableFormFactorStyle]: (ev: ChangeHandlersInput) => void;
};

export const getStepHeightPlaceholder = (theme: Theme) =>
  `Auto${
    isTimelineTheme(theme) || isCompactTheme(theme)
      ? ' (up to 300px)'
      : isFlatTheme(theme)
      ? ' (up to 150px)'
      : ''
  }`;

function isPercentageImageWidth(width: string | number) {
  return typeof width === 'string' && !!width?.includes('%');
}

const defaultMediaWidth = {
  [MediaOrientation.Left]: '400px',
  [MediaOrientation.Right]: '400px',
};

export const StepHeightHelperText: React.FC<{ isHorizontal: boolean }> = ({
  isHorizontal,
}) => (
  <Box fontSize="xs" mt="1" color="gray.600">
    This applies to all steps
    {isHorizontal
      ? ' and will make any images grow to fill the height without distorting their aspect ratio'
      : ''}
    .
  </Box>
);

/**
 * Orientation and image settings, shown in an accordion
 * with an optional label.
 * NOTE: Evaulate wether StyleTab and PreviewTab should be consolidated.
 */
export default function OrientationAndSizeSettingsAccordion({
  setFieldValue,
  templateData,
  formKey,
  label,
  formFactorStyle,
  theme,
  multiModule,
  previewComponent,
  groupAsAccordion,
  showSettings,
  isCyoa,
  disabled,
  ...boxProps
}: React.PropsWithChildren<Props>) {
  const { isNested, template, canEditTemplate, setMediaPositionDefaults } =
    useTemplate();

  const handleStyleChange = useCallback(
    (field, value) => setFieldValue(`${formKey}.${field}`, value),
    [formKey]
  );

  const styleChangeHandlers = useMemo(
    () =>
      Object.fromEntries(
        [
          'mediaOrientation',
          'verticalMediaOrientation',
          'ctasOrientation',
          'height',
          'imageWidth',
        ].map((field) => [
          field,
          (event: ChangeHandlersInput) =>
            handleStyleChange(
              field,
              typeof event === 'object' ? event?.target?.value : event
            ),
        ])
      ) as ChangeHandlers,
    [handleStyleChange]
  );

  const isPercentageWidth = useMemo<boolean>(
    () => isPercentageImageWidth(formFactorStyle.imageWidth),
    [formFactorStyle.imageWidth]
  );

  const fixedWidthInputValue = useMemo<number>(
    () =>
      formFactorStyle.imageWidth
        ? pxToNumber(
            isPercentageImageWidth(formFactorStyle.imageWidth)
              ? defaultMediaWidth[
                  formFactorStyle.mediaOrientation || MediaOrientation.Right
                ]
              : formFactorStyle.imageWidth
          )
        : undefined,
    [formFactorStyle.imageWidth]
  );

  const handleImageWidthChange = useCallback(
    (value: string | number) => {
      handleStyleChange(
        'imageWidth',
        value === 'px' || Number.isNaN(value)
          ? undefined
          : isPercentageImageWidth(value)
          ? value
          : px(+value)
      );
    },
    [handleStyleChange]
  );

  const handleStepBodyOrientationChange = useCallback(
    (value: string) => {
      const newStepBodyOrientation = value as StepBodyOrientation;
      handleStyleChange('stepBodyOrientation', newStepBodyOrientation);
      setMediaPositionDefaults({ newStepBodyOrientation });
    },
    [handleStyleChange, setMediaPositionDefaults]
  );

  // Reset settings if the theme changes.
  useEffect(() => {
    if (isNested && template.designType === GuideDesignType.onboarding) {
      if (
        formFactorStyle.stepBodyOrientation === StepBodyOrientation.horizontal
      )
        handleStyleChange('stepBodyOrientation', StepBodyOrientation.vertical);
      if ((formFactorStyle as ChecklistStyle).hideStepGroupTitle)
        handleStyleChange('hideStepGroupTitle', false);
    }
  }, [isNested]);

  const isShowingSettings = useMemo(
    () => Object.values(showSettings).some((v) => v),
    [showSettings]
  );

  const SettingsWrapper: React.FC<React.PropsWithChildren> = useCallback(
    ({ children }) =>
      groupAsAccordion ? (
        <Accordion defaultIndex={0} allowToggle>
          {children}
        </Accordion>
      ) : (
        <>{children}</>
      ),
    [groupAsAccordion]
  );

  const SettingsPanel: React.FC<React.PropsWithChildren<{ label: string }>> =
    useCallback(
      ({ label, children }) =>
        groupAsAccordion ? (
          <AccordionItem border="none" mb="2" bg="gray.50">
            <AccordionButton pb="1">
              <Text fontSize="md" fontWeight="bold">
                {label}
              </Text>
              <AccordionIcon ml="2" />
            </AccordionButton>
            <AccordionPanel display="flex" flexDir="column" gap="4">
              {children}
            </AccordionPanel>
          </AccordionItem>
        ) : (
          <Flex flexDir="column" gap="4">
            {children}
          </Flex>
        ),
      [groupAsAccordion]
    );

  return (
    <Box w="full" {...boxProps}>
      {label && isShowingSettings && (
        <Text fontSize="lg" fontWeight="bold" color="gray.800" mb="1">
          {label}
        </Text>
      )}
      <Flex gap="4" flexDir="column" w="full">
        <SettingsWrapper>
          {showSettings.mediaOptions && (
            <SettingsPanel label="Media options">
              {showSettings.numberAttributeStyles && (
                <Flex w="full" gap="4">
                  <NumberField
                    name={`${formKey}.mediaFontSize`}
                    label="Attribute size (px)"
                    disabled={!canEditTemplate}
                    inputProps={{
                      inputMode: 'numeric',
                      defaultValue: (formFactorStyle as TooltipStyle)
                        ?.mediaFontSize,
                      min: 0,
                      max: 100,
                      neverEmpty: true,
                      minimalist: true,
                    }}
                  />
                  <ColorField
                    name={`${formKey}.mediaTextColor`}
                    label="Attribute color"
                    disabled={!canEditTemplate}
                    defaultValue={
                      (formFactorStyle as TooltipStyle)?.mediaTextColor
                    }
                  />
                </Flex>
              )}
              {showSettings.imageOrientation && (
                <FormControl as="fieldset">
                  <FormLabel as="legend" fontSize="sm">
                    Media position relative to content
                  </FormLabel>
                  <RadioGroup
                    value={formFactorStyle.stepBodyOrientation}
                    onChange={handleStepBodyOrientationChange}
                    isDisabled={disabled}
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
                        <VerticalStepOrientation />
                        <Radio
                          name="stepBodyOrientation"
                          value={StepBodyOrientation.vertical}
                          label="Vertical"
                          mr="0"
                        />
                      </Flex>
                      <Flex direction="column" alignItems="center">
                        <HorizontalStepOrientation />
                        <Radio
                          name="stepBodyOrientation"
                          value={StepBodyOrientation.horizontal}
                          label="Horizontal"
                          mr="0"
                        />
                      </Flex>
                    </Flex>
                  </RadioGroup>
                </FormControl>
              )}
              {showSettings.mediaOrientation && (
                <FormControl as="fieldset">
                  <FormLabel as="legend" fontSize="sm">
                    Media position
                  </FormLabel>
                  <RadioGroup
                    value={
                      formFactorStyle.mediaOrientation || MediaOrientation.Right
                    }
                    onChange={styleChangeHandlers.mediaOrientation}
                    isDisabled={disabled}
                  >
                    <Radio
                      name="mediaOrientation"
                      value={MediaOrientation.Left}
                      label="Left"
                    />
                    <Radio
                      name="mediaOrientation"
                      value={MediaOrientation.Right}
                      label="Right"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              {showSettings.verticalMediaOrientation && (
                <FormControl as="fieldset">
                  <FormLabel as="legend" fontSize="sm">
                    Media position
                  </FormLabel>
                  <RadioGroup
                    value={
                      formFactorStyle.verticalMediaOrientation ||
                      VerticalMediaOrientation.top
                    }
                    onChange={styleChangeHandlers.verticalMediaOrientation}
                    isDisabled={disabled}
                  >
                    <Radio
                      name="verticalMediaOrientation"
                      value={VerticalMediaOrientation.top}
                      label="Top"
                    />
                    <Radio
                      name="verticalMediaOrientation"
                      value={VerticalMediaOrientation.bottom}
                      label="Bottom"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              {showSettings.verticalMediaAlignment && (
                <RadioGroupField
                  name={`${formKey}.verticalMediaAlignment`}
                  label="Media alignment"
                  fontSize="sm"
                  disabled={disabled}
                  optionMr="0"
                  defaultValue={
                    formFactorStyle.verticalMediaAlignment ||
                    VerticalAlignmentEnum.top
                  }
                  alignment="horizontal"
                  options={verticalAlignmentOptions}
                />
              )}
              {showSettings.horizontalMediaAlignment && (
                <RadioGroupField
                  name={`${formKey}.horizontalMediaAlignment`}
                  label="Media alignment"
                  fontSize="sm"
                  disabled={disabled}
                  optionMr="0"
                  defaultValue={
                    formFactorStyle.horizontalMediaAlignment ||
                    AlignmentEnum.center
                  }
                  alignment="horizontal"
                  options={horizontalAlignmentOptions}
                />
              )}
              {showSettings.imageWidth && (
                <FormControl as="fieldset">
                  <FormLabel as="legend" fontSize="sm">
                    Image width
                  </FormLabel>
                  <RadioGroup
                    value={
                      isPercentageWidth ? formFactorStyle.imageWidth : 'px'
                    }
                    onChange={handleImageWidthChange}
                    w="full"
                    isDisabled={disabled}
                  >
                    <Flex
                      gap={4}
                      borderWidth={1}
                      borderColor="gray.100"
                      bg="white"
                      borderRadius="md"
                      p={6}
                      w="full"
                      flexWrap="wrap"
                    >
                      <Flex direction="column" alignItems="center" flex="1">
                        <FiftyPercentWidth width="100%" />
                        <Radio
                          name="imageWidth"
                          value="50%"
                          label="50%"
                          mr="0"
                        />
                      </Flex>
                      <Flex direction="column" alignItems="center" flex="1">
                        <ThrityPercentWidth width="100%" />
                        <Radio
                          name="imageWidth"
                          value="30%"
                          label="30%"
                          mr="0"
                        />
                      </Flex>
                      <Flex direction="column" alignItems="center" flex="1">
                        <FixedWidth width="100%" />
                        <Radio
                          name="imageWidth"
                          value="px"
                          label="Fixed (px)"
                          mr="0"
                        />
                      </Flex>
                      {!isPercentageWidth && (
                        <Flex direction="column" w="full" mt="2" gap="1">
                          <NumberInput
                            inputMode="numeric"
                            onChange={handleImageWidthChange}
                            value={fixedWidthInputValue}
                            disabled={disabled}
                            placeholder={`Auto${
                              formFactorStyle.imageWidth
                                ? ''
                                : ` (up to ${
                                    defaultMediaWidth[
                                      formFactorStyle.mediaOrientation ||
                                        MediaOrientation.Right
                                    ]
                                  })`
                            }`}
                            min={40}
                            minimalist
                          />
                          <Box fontSize="xs" mt="1" color="gray.600">
                            Images will be at most 50% of the width of the guide
                            regardless of this setting to avoid overwhelming the
                            text content.
                          </Box>
                        </Flex>
                      )}
                    </Flex>
                  </RadioGroup>
                </FormControl>
              )}
            </SettingsPanel>
          )}
        </SettingsWrapper>
      </Flex>
    </Box>
  );
}
