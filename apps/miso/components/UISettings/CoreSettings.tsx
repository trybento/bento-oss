import React, { useCallback, useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import tinycolor from 'tinycolor2';
import { Box, Flex, FormControl, FormLabel, Button } from '@chakra-ui/react';
import NextImage from 'next/image';
import CtaComponent from 'bento-common/components/CtaComponent';
import {
  GuideFormFactor,
  ModalPosition,
  ModalSize,
  ModalStyle,
  StepCtaStyle,
  StepCtaType,
  TagVisibility,
} from 'bento-common/types';
import { px } from 'bento-common/utils/dom';
import { ContextTagType, StepCTA } from 'bento-common/types/globalShoyuState';
import { BentoUI } from 'bento-common/types/preview';
import {
  MAX_DOT_SIZE_PX,
  MIN_DOT_SIZE_PX,
} from 'bento-common/components/VisualTag/Dot';
import VisualTagIcon from 'bento-common/components/VisualTagIcon';
import { TAG_PRIMARY_COLOR_BRIGHTNESS } from 'bento-common/frontend/constants';

import UploadImageIcon from 'icons/UploadImage.svg';
import UploadIconModal from './components/UploadIconModal';
import {
  ComponentSelectorSize,
  MAX_PARAGRAPH_FONT_SIZE_PX,
  MAX_PARAGRAPH_LINE_HEIGHT_PX,
  MIN_PARAGRAPH_FONT_SIZE_PX,
  MIN_PARAGRAPH_LINE_HEIGHT_PX,
} from './styles.helpers';
import ButtonGroup from 'system/ButtonGroup';
import PreviewContainer from 'components/Previews/PreviewContainer';
import {
  COMPONENTS_VISUAL_TAG_PREVIEW_OPTIONS,
  MAIN_PREVIEW_OPTIONS,
  TAG_PULSE_LEVEL_OPTIONS,
} from 'components/Previews/helpers';
import { BentoComponentsEnum } from 'types';
import { SelectOption } from 'bento-common/components/RichTextEditor/extensions/Select/withSelect';
import ColorField from 'bento-common/components/ColorField';
import RadioGroupField from '../common/InputFields/RadioGroupField';
import NumberField from 'components/common/InputFields/NumberField';
import H4 from 'system/H4';
import HeadingSub from 'system/HeadingSub';
import {
  PreviewColumn,
  SettingsColumn,
  SettingsWithPreviewRow,
} from './components/GridHelpers';
import AdditionalColors from 'components/OrgSettings/components/AdditionalColors';
import { UISettingsQuery } from 'relay-types/UISettingsQuery.graphql';
import SimpleInfoTooltip from 'system/SimpleInfoTooltip';
import SliderField from 'components/common/InputFields/SliderField';
import SelectField from 'components/common/InputFields/SelectField';
import H3 from 'system/H3';
import {
  getDefaultCtaSetting,
  parseCtaColors,
} from 'bento-common/data/helpers';
import { forceHexColor } from 'bento-common/utils/color';
import { StyleAnchors } from './styles.types';
import { UI_FONT_SIZE } from 'bento-common/utils/color';

export const accordionButtonProps = {
  _hover: { background: 'transparent', opacity: 0.8 },
  _focus: { outline: 'none' },
};

const MAX_TAG_PADDING_PX = 30;

const CoreSettings: React.FC = () => {
  const [colorsComponentSelected, setColorsComponentSelected] = useState<{
    component: BentoComponentsEnum;
    isContextual: boolean;
  }>({ component: BentoComponentsEnum.inline, isContextual: false });
  const [tagStyleSelected, setTagStyleSelected] = useState<ContextTagType>(
    ContextTagType.dot
  );
  const [isUploadIconModalOpen, setIsUploadIconModalOpen] = useState(false);

  const { values, setFieldValue } =
    useFormikContext<UISettingsQuery['response']['uiSettings']>();

  const ctaNoop = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const ctaPreviews = useMemo(() => {
    const formFactor = GuideFormFactor.legacy;
    const commonValues: Partial<StepCTA> = {
      text: 'Click me',
      type: StepCtaType.complete,
      settings: getDefaultCtaSetting(formFactor),
    };

    const ctas = [
      { ...commonValues, style: StepCtaStyle.solid },
      { ...commonValues, style: StepCtaStyle.outline },
      { ...commonValues, style: StepCtaStyle.link },
    ] as StepCTA[];

    return ctas.map((cta) => ({
      cta,
      ctaColors: parseCtaColors(cta, formFactor, undefined, {
        primaryColorHex: forceHexColor(values.primaryColorHex),
        additionalColors: [],
        secondaryColorHex: forceHexColor(values.secondaryColorHex),
        fontColorHex: forceHexColor(values.fontColorHex),
      }),
    }));
  }, [values]);

  const handleComponentSelected = useMemo(
    () => ({
      colors: (selection: SelectOption) =>
        setColorsComponentSelected({
          component: selection.value as BentoComponentsEnum,
          isContextual: selection.label.toLowerCase().includes('contextual'),
        }),
      tag: (selection: SelectOption) => {
        setTagStyleSelected(selection.value as ContextTagType);
      },
    }),
    []
  );

  const tagLightPrimaryColor = useMemo(
    () =>
      tinycolor(values.tagPrimaryColor)
        .lighten(TAG_PRIMARY_COLOR_BRIGHTNESS)
        .toString(),
    [values.tagPrimaryColor]
  );

  const isBadgeTag = useMemo(
    () => tagStyleSelected.includes('badge'),
    [tagStyleSelected]
  );

  const showPulseLevel = useMemo(() => {
    return (
      tagStyleSelected === ContextTagType.badgeDot ||
      tagStyleSelected === ContextTagType.dot
    );
  }, [tagStyleSelected]);

  const onUploadIconClick = useCallback(
    () => setIsUploadIconModalOpen(true),
    []
  );

  const onResetIconClick = useCallback(
    () => setFieldValue('tagCustomIconUrl', ''),
    [setFieldValue]
  );

  const onCustomTagIconUploaded = useCallback(
    (fileUrl: string) => {
      setFieldValue('tagCustomIconUrl', fileUrl);
      setIsUploadIconModalOpen(false);
    },
    [setFieldValue]
  );

  const onCustomTagIconCanceled = useCallback(
    () => setIsUploadIconModalOpen(false),
    [setIsUploadIconModalOpen]
  );

  return (
    <>
      {/* Colors */}
      <SettingsWithPreviewRow spyId={StyleAnchors.colors} pt="0">
        <SettingsColumn>
          <H3 mb="6">Core styles</H3>
          <H4>Colors</H4>
          <HeadingSub mb={4}>Common colors across all components.</HeadingSub>
          <ColorField
            name="primaryColorHex"
            label="Primary"
            helperText="Used for highlights, buttons, links, progress bar, etc"
            defaultValue={values.primaryColorHex}
            mt="6"
            isRequired
            shouldBeDark
          />
          <ColorField
            name="secondaryColorHex"
            label="Default fill"
            helperText="Used for details and filled in background areas"
            defaultValue={values.secondaryColorHex}
            mt="6"
            isRequired
          />
          <ColorField
            name="fontColorHex"
            label="Text"
            helperText="This is most likely inherited from your web-fonts"
            defaultValue={values.fontColorHex}
            mt="6"
          />
        </SettingsColumn>
        <PreviewColumn>
          <ButtonGroup
            options={MAIN_PREVIEW_OPTIONS}
            onOptionSelected={handleComponentSelected.colors}
            buttonProps={useMemo(
              () => ({ minW: ComponentSelectorSize.lg }),
              []
            )}
          />
          <PreviewContainer
            uiSettings={values as BentoUI}
            component={colorsComponentSelected.component}
            contextual={colorsComponentSelected.isContextual}
            tagType={
              colorsComponentSelected.isContextual
                ? ContextTagType.dot
                : undefined
            }
            formFactorStyle={useMemo(
              () =>
                ({
                  modalSize: ModalSize.large,
                  position: ModalPosition.center,
                  hasBackgroundOverlay: true,
                } as ModalStyle),
              []
            )}
            sidebarAlwaysExpanded
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>

      {/* Font sizes */}
      <SettingsWithPreviewRow spyId={StyleAnchors.fontSizes}>
        <SettingsColumn>
          <H4 mb={4}>Font sizes</H4>

          <NumberField
            name="paragraphFontSize"
            fontSize={UI_FONT_SIZE}
            label={`Default paragraph font size (px)`}
            maxW={280}
            inputProps={useMemo(
              () => ({
                inputMode: 'numeric',
                defaultValue: values.paragraphFontSize,
                min: MIN_PARAGRAPH_FONT_SIZE_PX,
                max: MAX_PARAGRAPH_FONT_SIZE_PX,
                neverEmpty: true,
                minimalist: true,
              }),
              [values.paragraphFontSize]
            )}
            mt="6"
          />
          <NumberField
            name="paragraphLineHeight"
            fontSize={UI_FONT_SIZE}
            label="Default paragraph line height"
            maxW={280}
            inputProps={useMemo(
              () => ({
                inputMode: 'numeric',
                defaultValue: values.paragraphLineHeight,
                min: MIN_PARAGRAPH_LINE_HEIGHT_PX,
                max: MAX_PARAGRAPH_LINE_HEIGHT_PX,
                neverEmpty: true,
                minimalist: true,
              }),
              [values.paragraphLineHeight]
            )}
            mt="6"
          />
        </SettingsColumn>
        <PreviewColumn>
          <Box />
        </PreviewColumn>
      </SettingsWithPreviewRow>

      {/* Buttons */}
      <SettingsWithPreviewRow spyId={StyleAnchors.buttons}>
        <SettingsColumn>
          <H4>Buttons</H4>
          <NumberField
            name="ctasStyle.fontSize"
            fontSize={UI_FONT_SIZE}
            label={`Font size (px)`}
            maxW={280}
            inputProps={useMemo(
              () => ({
                inputMode: 'numeric',
                defaultValue: values.ctasStyle.fontSize,
                min: MIN_PARAGRAPH_FONT_SIZE_PX,
                max: MAX_PARAGRAPH_FONT_SIZE_PX,
                neverEmpty: true,
                minimalist: true,
              }),
              [values.ctasStyle.fontSize]
            )}
            mt="6"
          />
          <NumberField
            name="ctasStyle.lineHeight"
            fontSize={UI_FONT_SIZE}
            label={`Line height (px)`}
            maxW={280}
            inputProps={useMemo(
              () => ({
                inputMode: 'numeric',
                defaultValue: values.ctasStyle.lineHeight,
                min: MIN_PARAGRAPH_LINE_HEIGHT_PX,
                max: MAX_PARAGRAPH_LINE_HEIGHT_PX,
                neverEmpty: true,
                minimalist: true,
              }),
              [values.ctasStyle.lineHeight]
            )}
            mt="6"
          />

          <NumberField
            name="ctasStyle.borderRadius"
            fontSize={UI_FONT_SIZE}
            label={`Border radius (px)`}
            maxW={280}
            inputProps={useMemo(
              () => ({
                inputMode: 'numeric',
                defaultValue: values.ctasStyle.borderRadius,
                min: 0,
                max: 50,
                neverEmpty: true,
                minimalist: true,
              }),
              [values.ctasStyle.borderRadius]
            )}
            mt="6"
          />

          <NumberField
            name="ctasStyle.paddingX"
            fontSize={UI_FONT_SIZE}
            label={`Padding left and right (px)`}
            maxW={280}
            inputProps={useMemo(
              () => ({
                inputMode: 'numeric',
                defaultValue: values.ctasStyle.paddingX,
                min: 0,
                max: 50,
                neverEmpty: true,
                minimalist: true,
              }),
              [values.ctasStyle.paddingX]
            )}
            mt="6"
          />
          <NumberField
            name="ctasStyle.paddingY"
            fontSize={UI_FONT_SIZE}
            label={`Padding top and bottom (px)`}
            maxW={280}
            inputProps={useMemo(
              () => ({
                inputMode: 'numeric',
                defaultValue: values.ctasStyle.paddingY,
                min: 0,
                max: 50,
                neverEmpty: true,
                minimalist: true,
              }),
              [values.ctasStyle.paddingY]
            )}
            mt="6"
          />

          <AdditionalColors
            name="additionalColors"
            maxW="320px"
            w="full"
            defaultValue={(values.additionalColors as any) || []}
            mt="6"
          />
        </SettingsColumn>
        <PreviewColumn>
          <Flex gap="5" mt="16">
            {ctaPreviews.map(({ cta, ctaColors }) => (
              <Flex>
                <CtaComponent
                  formFactor={GuideFormFactor.legacy}
                  stepEntityId={undefined}
                  ctasStyle={values.ctasStyle}
                  cta={cta}
                  ctaColors={ctaColors}
                  onClick={ctaNoop}
                />
              </Flex>
            ))}
          </Flex>
        </PreviewColumn>
      </SettingsWithPreviewRow>

      {/* Visual tags */}
      <SettingsWithPreviewRow spyId={StyleAnchors.visualTags}>
        <SettingsColumn>
          <H4>Visual tags</H4>
          <HeadingSub mb="3">
            Common across tags. The guide author will pick the variation when
            adding a tag.
          </HeadingSub>

          <ColorField
            name="tagPrimaryColor"
            helperText="Used across all tag styles"
            label="Primary color"
            defaultValue={values.tagPrimaryColor}
            isRequired
            mt="6"
          />
          {tagStyleSelected === ContextTagType.badge && (
            <ColorField
              name="tagTextColor"
              label="Text color"
              defaultValue={values.tagTextColor}
              mt="6"
              isRequired
            />
          )}
          <RadioGroupField
            name="tagVisibility"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="When should visual tags show?"
            defaultValue={values.tagVisibility}
            alignment="vertical"
            options={useMemo(
              () => [
                {
                  label: (
                    <Flex alignItems="center" gap={1}>
                      Always{' '}
                      <SimpleInfoTooltip label="For active checklist guides, all steps’ visual tags will show as a way to bring users back to the guide" />
                    </Flex>
                  ),
                  value: TagVisibility.always,
                },
                {
                  label: (
                    <Flex alignItems="center" gap={1}>
                      Only when step is selected{' '}
                      <SimpleInfoTooltip label="Will only show the visual tag for the step the user has selected, other steps' tags will be hidden" />
                    </Flex>
                  ),
                  value: TagVisibility.activeStep,
                },
              ],
              []
            )}
          />
          {tagStyleSelected === ContextTagType.dot && (
            <SliderField
              name="tagDotSize"
              maxW={450}
              mt="6"
              fontSize={UI_FONT_SIZE}
              min={MIN_DOT_SIZE_PX}
              max={MAX_DOT_SIZE_PX}
              label="Dot size"
              value={values.tagDotSize}
              units="px"
            />
          )}
          {showPulseLevel && (
            <SelectField
              name="tagPulseLevel"
              label="Pulse level"
              mt="4"
              isSearchable={false}
              options={TAG_PULSE_LEVEL_OPTIONS}
              defaultValue={values.tagPulseLevel}
            />
          )}
          {(isBadgeTag || tagStyleSelected === ContextTagType.icon) && (
            <>
              <SliderField
                name="tagBadgeIconPadding"
                maxW={450}
                fontSize={UI_FONT_SIZE}
                max={MAX_TAG_PADDING_PX}
                label="Padding"
                value={values.tagBadgeIconPadding}
                units="px"
                mt="6"
              />
              <SliderField
                name="tagBadgeIconBorderRadius"
                maxW={450}
                fontSize={UI_FONT_SIZE}
                max={MAX_TAG_PADDING_PX * 2}
                label="Border radius"
                value={values.tagBadgeIconBorderRadius}
                units="px"
                mt="6"
              />
            </>
          )}
          {[ContextTagType.icon, ContextTagType.badgeIcon].includes(
            tagStyleSelected
          ) && (
            <>
              <FormControl>
                <Field
                  type="tagCustomIconUrl"
                  name="tagCustomIconUrl"
                  value={values.tagCustomIconUrl}
                  hidden
                />
                <FormLabel mt="6">Icon</FormLabel>
                <Flex gap={2}>
                  {values.tagCustomIconUrl ? (
                    <VisualTagIcon
                      primaryColor={values.tagPrimaryColor}
                      iconUrl={values.tagCustomIconUrl}
                      bgColor={tagLightPrimaryColor}
                      borderRadius={99}
                      padding={12}
                    />
                  ) : (
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      w={10}
                      h={10}
                      bgColor="gray.100"
                      borderRadius="full"
                      position="relative"
                    >
                      <Box
                        m="auto"
                        w={4}
                        h={4}
                        position="relative"
                        top={px(-1)}
                        left={px(1)}
                      >
                        <NextImage src={UploadImageIcon} alt="" />
                      </Box>
                    </Flex>
                  )}
                  <Button onClick={onUploadIconClick} variant="link">
                    {values.tagCustomIconUrl ? 'Change' : 'Upload custom icon'}
                  </Button>
                  {values.tagCustomIconUrl && (
                    <Button
                      onClick={onResetIconClick}
                      variant="link"
                      color="bento.errorText"
                    >
                      Reset to default
                    </Button>
                  )}
                </Flex>
              </FormControl>
              <UploadIconModal
                onSuccess={onCustomTagIconUploaded}
                onCancel={onCustomTagIconCanceled}
                isOpen={isUploadIconModalOpen}
              />
            </>
          )}
        </SettingsColumn>
        <PreviewColumn>
          <ButtonGroup
            options={COMPONENTS_VISUAL_TAG_PREVIEW_OPTIONS}
            onOptionSelected={handleComponentSelected.tag}
            buttonProps={{ minW: ComponentSelectorSize.md }}
          />
          <PreviewContainer
            uiSettings={values as BentoUI}
            component={BentoComponentsEnum.context}
            tagType={tagStyleSelected}
            sidebarAlwaysExpanded
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>
    </>
  );
};

export default CoreSettings;
