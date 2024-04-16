import React from 'react';
import { Box, ButtonProps } from '@chakra-ui/react';
import { ExtendedSelectOptions } from '../components/Select';
import {
  additionalColorOptionPrefix,
  ctaColorFieldToHexValue,
  getDefaultCtaSetting,
} from '../data/helpers';
import {
  BannerStyle,
  CardStyle,
  CarouselStyle,
  CtaColorFields,
  CtaInput,
  GuideFormFactor,
  StepCtaStyle,
  TooltipStyle,
  VideoGalleryStyle,
} from '../types';
import { BentoUI } from '../types/preview';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import FontDownloadOutlinedIcon from '@mui/icons-material/FontDownloadOutlined';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import { $enum } from 'ts-enum-util';
import { RichTextEditorUISettings } from '../components/RichTextEditor/helpers';

const WHITE_FALLBACK = '#F8F8F8';

export const CTA_COLOR_LABELS = {
  [CtaColorFields.primaryColorHex]: 'Primary color',
  [CtaColorFields.secondaryColorHex]: 'Secondary Color',
  [CtaColorFields.guideBackgroundColor]: 'Guide background color',
  [CtaColorFields.guideTextColor]: 'Guide text color',
  [CtaColorFields.white]: 'White',
};

export const CTA_STYLE_LABELS = {
  [StepCtaStyle.solid]: 'Solid',
  [StepCtaStyle.outline]: 'Outline',
  [StepCtaStyle.link]: 'Link',
};

/** CTA and RTE Button styles helper. */
export const getButtonStyles = (
  cta: Pick<CtaInput, 'settings' | 'style'> | undefined,
  uiSettings:
    | Pick<
        BentoUI,
        | 'primaryColorHex'
        | 'secondaryColorHex'
        | 'fontColorHex'
        | 'additionalColors'
      >
    | undefined,
  formFactorStyle:
    | CarouselStyle
    | CardStyle
    | TooltipStyle
    | BannerStyle
    | VideoGalleryStyle
    | undefined,
  guideFormFactor: GuideFormFactor | null | undefined,
  undefinedFallback?: Partial<Record<CtaColorFields | 'default', string>>
): ButtonProps => {
  const defaultSettings = getDefaultCtaSetting(guideFormFactor);
  const colorFieldFallbacks = [
    defaultSettings.bgColorField,
    defaultSettings.textColorField,
  ];

  let [ctaColor, ctaTextColor] = [
    cta?.settings?.bgColorField,
    cta?.settings?.textColorField,
  ].map(
    (colorField, idx) =>
      ctaColorFieldToHexValue(
        uiSettings,
        formFactorStyle,
        guideFormFactor,
        colorField,
        undefinedFallback,
        colorFieldFallbacks[idx] as CtaColorFields
      ).value
  );

  /** Prevent making the CTA invisible if it will render all white. */
  if (!ctaColor || ctaColor.toUpperCase() === '#FFFFFF') {
    ctaColor = WHITE_FALLBACK;
  }

  if (
    (!ctaTextColor || ctaTextColor.toUpperCase() === '#FFFFFF') &&
    // Keep white text for solid CTAs with a color different than white.
    !(cta.style === StepCtaStyle.solid && ctaColor.toUpperCase() !== '#FFFFFF')
  ) {
    ctaTextColor = WHITE_FALLBACK;
  }

  switch (cta.style) {
    case StepCtaStyle.solid:
      return {
        variant: cta.style,
        bg: ctaColor,
        color: ctaTextColor,
      };

    case StepCtaStyle.outline:
      return {
        variant: cta.style,
        borderColor: ctaColor,
        color: ctaColor,
      };
  }

  /* Link style */
  return {
    variant: cta.style,
    color: ctaColor,
    fontWeight: 'normal',
  };
};

/**
 * This is mostly intended for undefined fallbacks in miso where
 * the preview can't tell the colors that the embeddable will inherit.
 */
export const undefinedCtaColorFallbacks: Partial<
  Record<CtaColorFields | 'default', string>
> = {
  [CtaColorFields.guideTextColor]: '#000000',
};

export const CTA_STYLE_OPTIONS: ExtendedSelectOptions[] = [
  {
    label: CTA_STYLE_LABELS[StepCtaStyle.solid],
    value: StepCtaStyle.solid,
    Icon: <FontDownloadIcon fontSize="small" />,
  },
  {
    label: CTA_STYLE_LABELS[StepCtaStyle.outline],
    value: StepCtaStyle.outline,
    Icon: <FontDownloadOutlinedIcon fontSize="small" />,
  },
  {
    label: CTA_STYLE_LABELS[StepCtaStyle.link],
    value: StepCtaStyle.link,
    Icon: (
      <Box w={6} h={4} overflow="hidden">
        {/** Couldn't find icon for plain A. Change to plain text if necessary. */}
        <TextFormatIcon fontSize="small" />
      </Box>
    ),
  },
];

export const getCtaColorOptions = (
  formFactor: GuideFormFactor,
  uiSettings: RichTextEditorUISettings,
  formFactorStyle: CardStyle | TooltipStyle | BannerStyle,
  blacklist: CtaColorFields[] = []
) => {
  const options = $enum(CtaColorFields)
    .getValues()
    .reduce((acc, colorField) => {
      if (
        (colorField === CtaColorFields.guideBackgroundColor &&
          formFactor !== GuideFormFactor.inline &&
          formFactor !== GuideFormFactor.banner &&
          formFactor !== GuideFormFactor.tooltip) ||
        blacklist.includes(colorField)
      )
        return acc;

      const color = ctaColorFieldToHexValue(
        uiSettings,
        formFactorStyle,
        formFactor,
        colorField,
        undefinedCtaColorFallbacks
      );

      const hexLabel =
        colorField === CtaColorFields.white
          ? ''
          : ` (${color.value && !color.isFallback ? color.value : 'inherit'})`;

      acc.push({
        label: `${CTA_COLOR_LABELS[colorField]}${hexLabel}`,
        value: colorField,
        Icon: (
          <Box
            w="14px"
            h="14px"
            bg={color.value || 'transparent'}
            border="1px solid #e7e7e7"
            borderRadius="sm"
          />
        ),
      });
      return acc;
    }, [] as ExtendedSelectOptions[]);

  const additionalColorOptions: ExtendedSelectOptions[] = (
    uiSettings?.additionalColors || []
  ).map((additionalColor, idx) => ({
    label: `Additional color ${idx + 1} (${additionalColor.value})`,
    value: additionalColorOptionPrefix + idx,
    Icon: (
      <Box
        w="14px"
        h="14px"
        bg={additionalColor.value}
        border="1px solid #e7e7e7"
        borderRadius="sm"
      />
    ),
  }));

  return [...options, ...additionalColorOptions];
};
