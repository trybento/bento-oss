import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Flex, FormControl, FormLabel, HStack } from '@chakra-ui/react';
import {
  BannerPosition,
  BannerTypeEnum,
  AnnouncementShadow,
  ModalSize,
  TooltipShowOn,
  TooltipSize,
  TooltipStyle,
  BannerStyle,
  ModalStyle,
  ModalPosition,
  InlineContextualShadow,
  CompletionStyle,
  StepSeparationType,
  ActiveStepShadow,
} from 'bento-common/types';
import { ContextTagType } from 'bento-common/types/globalShoyuState';

import ButtonGroup from 'system/ButtonGroup';
import PreviewContainer from 'components/Previews/PreviewContainer';
import {
  GUIDES_ANNOUNCEMENTS_PREVIEW_OPTIONS,
  GUIDES_CHECKLISTS_PREVIEW_OPTIONS,
} from 'components/Previews/helpers';
import { BentoComponentsEnum } from 'types';
import { SelectOption } from 'bento-common/components/RichTextEditor/extensions/Select/withSelect';
import {
  bannerPaddings,
  ComponentSelectorSize,
  THEME_OPTIONS,
} from './styles.helpers';
import Select from 'system/Select';
import ColorField from 'bento-common/components/ColorField';
import RadioGroupField from '../common/InputFields/RadioGroupField';
import NumberField from 'components/common/InputFields/NumberField';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import {
  PreviewColumn,
  SettingsColumn,
  SettingsWithPreviewRow,
} from './components/GridHelpers';
import H3 from 'system/H3';
import H4 from 'system/H4';
import { orgSettingsDefaults } from 'bento-common/data/orgSettingsDefaults';
import { px } from 'bento-common/utils/dom';
import InlineResetButton from 'system/InlineResetButton';
import HeadingSub from 'system/HeadingSub';
import H5 from 'system/H5';
import { DefaultCyoaOptionShadow } from 'bento-common/frontend/constants';
import TextField from 'components/common/InputFields/TextField';
import { UI_FONT_SIZE } from 'bento-common/utils/color';

const isCustomShadow = (defaultValue: string, value: string) => {
  return value !== 'none' && value !== defaultValue;
};

export default function GuidesSettings() {
  const [checklistComponentSelected, setChecklistComponentSelected] =
    useState<BentoComponentsEnum>(BentoComponentsEnum.inline);
  const [announcementsComponentSelected, setAnnouncementsComponentSelected] =
    useState<
      BentoComponentsEnum | [BentoComponentsEnum.banner, BannerTypeEnum]
    >(BentoComponentsEnum.modal);

  // Used for fields that don't re render on reset.
  const [resetCount, setResetCount] = useState<number>(0);

  const { values, setFieldValue } = useFormikContext<any>();

  const resetField = useCallback(
    (fieldName: string, resetValue?: string | number | boolean) => () => {
      setFieldValue(fieldName, resetValue || null);
      setResetCount((v) => v + 1);
    },
    [setFieldValue]
  );

  const isCustomCyoaOptionShadow = isCustomShadow(
    DefaultCyoaOptionShadow.default,
    values.cyoaOptionShadow
  );

  const isCustomCyoaOptionShadowHover = isCustomShadow(
    DefaultCyoaOptionShadow.hover,
    values.cyoaOptionShadowHover
  );

  /**
   * NOTE: Settings between Modals and Banners
   * are partially shared. Remove this once the UI
   * is split.
   */
  useEffect(() => {
    setFieldValue('bannersStyle.shadow', values.modalsStyle.shadow);
    setFieldValue('bannersStyle.borderRadius', values.modalsStyle.borderRadius);
  }, [values.modalsStyle]);

  const themeSelected = useMemo(
    () => THEME_OPTIONS.find((option) => option.value === values.theme),
    [values?.theme]
  );

  const defaultChecklistIndexSelected = useMemo(
    () =>
      GUIDES_CHECKLISTS_PREVIEW_OPTIONS.findIndex(
        (o) => o.value === checklistComponentSelected
      ),
    []
  );

  const handleComponentSelected = useMemo(
    () => ({
      checklist: (selection: SelectOption) => {
        setChecklistComponentSelected(selection.value as BentoComponentsEnum);
      },
      announcements: (selection: {
        label: string;
        value: string | string[];
      }) => {
        if (!selection.value) return;
        setAnnouncementsComponentSelected(
          selection.value as
            | BentoComponentsEnum
            | [BentoComponentsEnum.banner, BannerTypeEnum]
        );
      },
    }),
    []
  );

  const announcementFormFactorStyle = useMemo<
    ModalStyle | BannerStyle | undefined
  >(() => {
    const selectedComponent = Array.isArray(announcementsComponentSelected)
      ? announcementsComponentSelected[0]
      : announcementsComponentSelected;

    switch (selectedComponent) {
      case BentoComponentsEnum.modal:
        return {
          modalSize: ModalSize.large,
          position: ModalPosition.center,
          hasBackgroundOverlay: true,
        } as ModalStyle;

      case BentoComponentsEnum.banner:
        return {
          bannerType: announcementsComponentSelected[1],
          bannerPosition: BannerPosition.top,
        } as BannerStyle;

      default:
        return undefined;
    }
  }, [announcementsComponentSelected]);

  return (
    <>
      {/**
       * Checklist
       */}
      <SettingsWithPreviewRow spyId="checklists" pt={0}>
        <SettingsColumn>
          <H4 mb={3}>Checklists</H4>
          <Field>
            {({ form }) => (
              <FormControl as="fieldset" mt={4}>
                <FormLabel as="legend" fontSize={UI_FONT_SIZE}>
                  Default layout
                </FormLabel>
                <Box maxW={280}>
                  <Select
                    isSearchable={false}
                    options={THEME_OPTIONS}
                    defaultValue={themeSelected}
                    onChange={(o) => form.setFieldValue('theme', o.value)}
                  />
                </Box>
              </FormControl>
            )}
          </Field>
          <ColorField
            name="embedBackgroundHex"
            label="Inline background color"
            defaultValue={values.embedBackgroundHex}
            mt="6"
            allowTransparent
            isRequired
          />
          <RadioGroupField
            alignment="horizontal"
            name="stepCompletionStyle"
            fontSize={UI_FONT_SIZE}
            mt="6"
            defaultValue={values.stepCompletionStyle}
            label="Completed step style"
            options={[
              {
                label: 'Strikedthrough',
                value: CompletionStyle.lineThrough,
              },
              {
                label: 'Grayed out',
                value: CompletionStyle.grayedOut,
              },
            ]}
          />
          <ColorField
            name="stepSeparationStyle.boxCompleteBackgroundColor"
            label="Completed background"
            helperText="This only applies to Flat layout guides when using the box border style"
            defaultValue={
              values.stepSeparationStyle?.boxCompleteBackgroundColor
            }
            mt="6"
          />

          <H5 mt="24" mb="1">
            Borders and dividers
          </H5>
          <HeadingSub mb="3">
            Choose if your aestetic works better with dividers or cards
          </HeadingSub>

          <RadioGroupField
            name="stepSeparationStyle.type"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="Style"
            defaultValue={values.stepSeparationStyle?.type}
            alignment="horizontal"
            options={[
              { label: 'Border', value: StepSeparationType.border },
              { label: 'Box', value: StepSeparationType.box },
            ]}
          />

          <ColorField
            name="borderColor"
            label="Divider color"
            defaultValue={values.borderColor}
            mt="6"
            isRequired
          />

          {values.stepSeparationStyle?.type === StepSeparationType.box && (
            <>
              <H5 my={4}>Box settings</H5>

              <ColorField
                name="cardBackgroundColor"
                label="Background color"
                defaultValue={values.cardBackgroundColor}
                helperText="Recommended only if background is transparent"
                mt="6"
                allowTransparent
                isRequired
              />

              {/** @todo add support for custom shadow */}
              <RadioGroupField
                name="stepSeparationStyle.boxActiveStepShadow"
                mt="6"
                fontSize={UI_FONT_SIZE}
                label="Active step shadow"
                defaultValue={values.stepSeparationStyle?.boxActiveStepShadow}
                alignment="horizontal"
                options={[
                  { label: 'Standard', value: ActiveStepShadow.standard },
                  { label: 'None', value: ActiveStepShadow.none },
                  // { label: 'Custom', value: ActiveStepShadow.custom },
                ]}
              />

              <NumberField
                name="stepSeparationStyle.boxBorderRadius"
                mt="4"
                fontSize={UI_FONT_SIZE}
                label="Border radius (px)"
                maxW={280}
                inputProps={{
                  inputMode: 'numeric',
                  defaultValue: values.stepSeparationStyle?.boxBorderRadius,
                  min: 0,
                  max: 100,
                  neverEmpty: true,
                  minimalist: true,
                }}
              />
            </>
          )}
        </SettingsColumn>
        <PreviewColumn>
          <ButtonGroup
            options={GUIDES_CHECKLISTS_PREVIEW_OPTIONS}
            onOptionSelected={handleComponentSelected.checklist}
            defaultIndex={defaultChecklistIndexSelected}
            buttonProps={{ minW: ComponentSelectorSize.sm }}
          />
          <PreviewContainer
            uiSettings={values}
            component={checklistComponentSelected}
            sidebarAlwaysExpanded
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>

      <SettingsWithPreviewRow>
        <SettingsColumn>
          <H4>Branching cards</H4>
          <HeadingSub mb="3">
            Used for branching type steps and CYOA guides.
          </HeadingSub>

          <ColorField
            name="cyoaOptionBackgroundColor"
            label="Card background color"
            defaultValue={values.cyoaOptionBackgroundColor}
            mt="6"
            isRequired
          />
          <ColorField
            name="cyoaOptionBorderColor"
            label="Card border color"
            defaultValue={values.cyoaOptionBorderColor}
            mt="6"
            isRequired
            allowTransparent
          />
          <ColorField
            name="cyoaTextColor"
            label="Text color"
            defaultValue={values.cyoaTextColor}
            mt="6"
            isRequired
          />

          <RadioGroupField
            name="cyoaOptionShadow"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="Card shadow"
            defaultValue={values.cyoaOptionShadow}
            alignment="horizontal"
            options={[
              { label: 'Standard', value: DefaultCyoaOptionShadow.default },
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Custom',
                value: isCustomCyoaOptionShadow ? values.cyoaOptionShadow : '',
              },
            ]}
          />

          {isCustomCyoaOptionShadow && (
            <TextField
              maxW="280px"
              mt="2"
              name="cyoaOptionShadow"
              fontSize={UI_FONT_SIZE}
              defaultValue={values.cyoaOptionShadow}
            />
          )}

          <RadioGroupField
            name="cyoaOptionShadowHover"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="Card shadow - hover"
            defaultValue={values.cyoaOptionShadowHover}
            alignment="horizontal"
            options={[
              { label: 'Standard', value: DefaultCyoaOptionShadow.hover },
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Custom',
                value: isCustomCyoaOptionShadowHover
                  ? values.cyoaOptionShadowHover
                  : '',
              },
            ]}
          />

          {isCustomCyoaOptionShadowHover && (
            <TextField
              maxW="280px"
              mt="2"
              name="cyoaOptionShadowHover"
              fontSize={UI_FONT_SIZE}
              defaultValue={values.cyoaOptionShadowHover}
            />
          )}
        </SettingsColumn>
        <PreviewColumn>
          <PreviewContainer
            uiSettings={values}
            component={BentoComponentsEnum.inline}
            branching
            sidebarAlwaysExpanded
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>

      {/**
       * Tooltips
       */}
      <SettingsWithPreviewRow spyId="tooltips">
        <SettingsColumn>
          <H4 mb={1}>Tooltips</H4>
          <HeadingSub>
            Each tooltip can have its size adjusted. Padding is dependent on
            each size.
          </HeadingSub>
          <NumberField
            key={`tooltipsStyle.borderRadius-${resetCount}`}
            name="tooltipsStyle.borderRadius"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="Border radius (px)"
            maxW={280}
            inputProps={{
              inputMode: 'numeric',
              defaultValue: values.tooltipsStyle.borderRadius,
              min: 0,
              max: 100,
              neverEmpty: true,
              minimalist: true,
            }}
            helperText={
              <Box display="inline-flex">
                Uses {px(orgSettingsDefaults.tooltipsStyle.borderRadius)} by
                default -
                <InlineResetButton
                  ml="2px"
                  onClick={resetField(
                    `tooltipsStyle.borderRadius`,
                    orgSettingsDefaults.tooltipsStyle.borderRadius
                  )}
                />
              </Box>
            }
          />
          <NumberField
            key={`tooltipsStyle.paddingX-${resetCount}`}
            name="tooltipsStyle.paddingX"
            mt="4"
            fontSize={UI_FONT_SIZE}
            label="Padding left and right (px)"
            maxW={280}
            inputProps={{
              inputMode: 'numeric',
              defaultValue: values.tooltipsStyle.paddingX,
              min: 0,
              max: 100,
              neverEmpty: true,
              minimalist: true,
            }}
            helperText={
              <Box display="inline-flex">
                We recommend {px(orgSettingsDefaults.tooltipsStyle.paddingX)} -
                <InlineResetButton
                  ml="2px"
                  onClick={resetField(
                    `tooltipsStyle.paddingX`,
                    orgSettingsDefaults.tooltipsStyle.paddingX
                  )}
                />
              </Box>
            }
          />
          <NumberField
            key={`tooltipsStyle.paddingY-${resetCount}`}
            name="tooltipsStyle.paddingY"
            mt="4"
            fontSize={UI_FONT_SIZE}
            label="Padding top and bottom (px)"
            maxW={280}
            inputProps={{
              inputMode: 'numeric',
              defaultValue: values.tooltipsStyle.paddingY,
              min: 0,
              max: 100,
              neverEmpty: true,
              minimalist: true,
            }}
            helperText={
              <Box display="inline-flex">
                Uses {px(orgSettingsDefaults.tooltipsStyle.paddingY)} by default
                -
                <InlineResetButton
                  ml="2px"
                  onClick={resetField(
                    `tooltipsStyle.paddingY`,
                    orgSettingsDefaults.tooltipsStyle.paddingY
                  )}
                />
              </Box>
            }
          />
          <RadioGroupField
            name="tooltipsStyle.shadow"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="Shadow"
            defaultValue={values.tooltipsStyle.shadow}
            alignment="horizontal"
            options={[
              {
                label: 'Standard',
                value: AnnouncementShadow.standard,
              },
              {
                label: 'None',
                value: AnnouncementShadow.none,
              },
            ]}
          />
        </SettingsColumn>
        <PreviewColumn>
          <PreviewContainer
            uiSettings={values}
            component={BentoComponentsEnum.tooltip}
            tagType={ContextTagType.dot}
            formFactorStyle={
              {
                hasArrow: true,
                tooltipShowOn: TooltipShowOn.load,
                tooltipSize: TooltipSize.medium,
              } as TooltipStyle
            }
            contextual
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>
      {/**
       * Embedded empty states
       */}
      <SettingsWithPreviewRow spyId="embedded_empty_states">
        <SettingsColumn>
          <H4 mb={3}>Embedded cards & empty states</H4>
          <ColorField
            name="inlineContextualStyle.borderColor"
            label="Border color"
            defaultValue={
              values.inlineContextualStyle.borderColor || '#00000000'
            }
            maxW={280}
            fontSize={UI_FONT_SIZE}
            allowTransparent
            showUnset
          />
          <NumberField
            key={`inlineContextualStyle.borderRadius-${resetCount}`}
            name="inlineContextualStyle.borderRadius"
            mt="4"
            fontSize={UI_FONT_SIZE}
            label="Border radius (px)"
            maxW={280}
            helperText={
              <Flex flexDir="column" gap="1">
                <Box display="inline-flex">
                  Uses{' '}
                  {px(orgSettingsDefaults.inlineContextualStyle.borderRadius)}{' '}
                  radius by default -
                  <InlineResetButton
                    ml="2px"
                    onClick={resetField(
                      'inlineContextualStyle.borderRadius',
                      orgSettingsDefaults.inlineContextualStyle.borderRadius
                    )}
                  />
                </Box>
              </Flex>
            }
            inputProps={{
              inputMode: 'numeric',
              defaultValue: values.inlineContextualStyle.borderRadius,
              min: 0,
              max: 100,
              neverEmpty: true,
              minimalist: true,
            }}
          />
          <NumberField
            key={`inlineContextualStyle.padding-${resetCount}`}
            name="inlineContextualStyle.padding"
            mt="4"
            fontSize={UI_FONT_SIZE}
            label="Padding (px)"
            maxW={280}
            inputProps={{
              inputMode: 'numeric',
              defaultValue: values.inlineContextualStyle.padding,
              min: 0,
              max: 100,
              neverEmpty: true,
              minimalist: true,
            }}
            helperText={
              <Flex flexDir="column" gap="1">
                <Box display="inline-flex">
                  Uses {px(orgSettingsDefaults.inlineContextualStyle.padding)}{' '}
                  by default -
                  <InlineResetButton
                    ml="2px"
                    onClick={resetField(
                      'inlineContextualStyle.padding',
                      orgSettingsDefaults.inlineContextualStyle.padding
                    )}
                  />
                </Box>
              </Flex>
            }
          />
          <RadioGroupField
            name="inlineContextualStyle.shadow"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="Shadow"
            defaultValue={values.inlineContextualStyle.shadow}
            alignment="horizontal"
            options={[
              {
                label: 'Standard',
                value: InlineContextualShadow.standard,
              },
              {
                label: 'None',
                value: InlineContextualShadow.none,
              },
            ]}
          />
        </SettingsColumn>
        <PreviewColumn>
          <PreviewContainer
            uiSettings={values}
            component={BentoComponentsEnum.inlineContext}
            tagType={ContextTagType.dot}
            sidebarAlwaysExpanded
            contextual
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>

      {/** Announcements */}
      <SettingsWithPreviewRow spyId="announcements">
        <SettingsColumn>
          <H4 mb={3}>Announcements</H4>

          {(announcementsComponentSelected === BentoComponentsEnum.modal ||
            (Array.isArray(announcementsComponentSelected) &&
              announcementsComponentSelected[0] ===
                BentoComponentsEnum.banner &&
              announcementsComponentSelected[1] ===
                BannerTypeEnum.floating)) && (
            <>
              <NumberField
                key={`modalsStyle.borderRadius-${resetCount}`}
                name="modalsStyle.borderRadius"
                fontSize={UI_FONT_SIZE}
                label="Border radius (px)"
                // helperText=""
                helperText="Applies to modals and floating banners"
                maxW={280}
                inputProps={{
                  inputMode: 'numeric',
                  defaultValue: values.modalsStyle.borderRadius,
                  min: 0,
                  max: 100,
                  neverEmpty: true,
                  minimalist: true,
                }}
              />
              {announcementsComponentSelected === BentoComponentsEnum.modal && (
                <>
                  <NumberField
                    key={`modalsStyle.paddingX-${resetCount}`}
                    name="modalsStyle.paddingX"
                    mt="4"
                    fontSize={UI_FONT_SIZE}
                    label="Padding left and right (px)"
                    maxW={280}
                    inputProps={{
                      inputMode: 'numeric',
                      defaultValue: values.modalsStyle.paddingX,
                      min: 0,
                      max: 100,
                      neverEmpty: true,
                      minimalist: true,
                    }}
                    helperText={
                      <Box display="inline-flex">
                        Uses {px(orgSettingsDefaults.modalsStyle.paddingX)} by
                        default -
                        <InlineResetButton
                          ml="2px"
                          onClick={resetField(
                            `modalsStyle.paddingX`,
                            orgSettingsDefaults.modalsStyle.paddingX
                          )}
                        />
                      </Box>
                    }
                  />
                  <NumberField
                    key={`modalsStyle.paddingY-${resetCount}`}
                    name="modalsStyle.paddingY"
                    mt="4"
                    fontSize={UI_FONT_SIZE}
                    label="Padding top and bottom (px)"
                    maxW={280}
                    inputProps={{
                      inputMode: 'numeric',
                      defaultValue: values.modalsStyle.paddingY,
                      min: 0,
                      max: 100,
                      neverEmpty: true,
                      minimalist: true,
                    }}
                    helperText={
                      <Box display="inline-flex">
                        Uses {px(orgSettingsDefaults.modalsStyle.paddingY)} by
                        default -
                        <InlineResetButton
                          ml="2px"
                          onClick={resetField(
                            `modalsStyle.paddingY`,
                            orgSettingsDefaults.modalsStyle.paddingY
                          )}
                        />
                      </Box>
                    }
                  />
                </>
              )}
              <RadioGroupField
                name="modalsStyle.shadow"
                mt="6"
                fontSize={UI_FONT_SIZE}
                label="Shadow"
                defaultValue={
                  values.modalsStyle.shadow || AnnouncementShadow.standard
                }
                alignment="horizontal"
                options={[
                  {
                    label: 'Standard',
                    value: AnnouncementShadow.standard,
                  },
                  {
                    label: 'None',
                    value: AnnouncementShadow.none,
                  },
                ]}
              />
            </>
          )}

          {announcementsComponentSelected === BentoComponentsEnum.modal && (
            <FormControl as="fieldset" mt="6">
              <FormLabel as="legend" fontSize={UI_FONT_SIZE}>
                Modal background overlay
              </FormLabel>
              <HStack spacing="2">
                <Box width="50%">
                  <FormLabel variant="secondary" fontSize={UI_FONT_SIZE}>
                    Overlay color
                  </FormLabel>
                  <ColorField
                    name="modalsStyle.backgroundOverlayColor"
                    defaultValue={values.modalsStyle.backgroundOverlayColor}
                    maxW="100%"
                    isRequired
                  />
                </Box>

                <Box width="50%">
                  <NumberField
                    name="modalsStyle.backgroundOverlayOpacity"
                    variant="secondary"
                    fontSize={UI_FONT_SIZE}
                    label="Opacity (%)"
                    inputProps={{
                      inputMode: 'numeric',
                      defaultValue: values.modalsStyle.backgroundOverlayOpacity,
                      min: 0,
                      max: 100,
                      step: 1,
                      neverEmpty: true,
                      minimalist: true,
                    }}
                  />
                </Box>
              </HStack>
            </FormControl>
          )}

          {Array.isArray(announcementsComponentSelected) &&
            announcementsComponentSelected[0] ===
              BentoComponentsEnum.banner && (
              <RadioGroupField
                name="bannersStyle.padding"
                mt="6"
                fontSize={UI_FONT_SIZE}
                label="Banner padding"
                defaultValue={values.bannersStyle.padding}
                alignment="horizontal"
                options={bannerPaddings.map(({ value, text }) => ({
                  value,
                  label: text,
                }))}
              />
            )}
        </SettingsColumn>
        <PreviewColumn>
          <ButtonGroup
            options={GUIDES_ANNOUNCEMENTS_PREVIEW_OPTIONS}
            onOptionSelected={handleComponentSelected.announcements}
            buttonProps={{ minW: ComponentSelectorSize.sm }}
          />
          <PreviewContainer
            uiSettings={values}
            component={
              Array.isArray(announcementsComponentSelected)
                ? announcementsComponentSelected[0]
                : announcementsComponentSelected
            }
            formFactorStyle={announcementFormFactorStyle as any}
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>
    </>
  );
}
