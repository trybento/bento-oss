import { THEME_LABELS } from 'bento-common/data/helpers';
import {
  BannerPadding,
  EmbedToggleStyle,
  EmbedToggleStyleInverted,
  Theme,
} from 'bento-common/types';

import { SelectOptions } from 'system/Select';

export enum ComponentSelectorSize {
  sm = '86px',
  md = '110px',
  lg = '150px',
}

export enum StylesTabLabels {
  general = 'General',
  guideSpecific = 'Guide-specific',
}

export const tabOptions = [
  {
    title: StylesTabLabels.general,
  },
  { title: StylesTabLabels.guideSpecific },
];

export const THEME_OPTIONS: SelectOptions[] = [
  { label: THEME_LABELS[Theme.nested], value: Theme.nested },
  { label: THEME_LABELS[Theme.flat], value: Theme.flat },
  { label: THEME_LABELS[Theme.compact], value: Theme.compact },
  { label: THEME_LABELS[Theme.timeline], value: Theme.timeline },
];

export const SIDEBAR_TOGGLE_TYPES: (
  | EmbedToggleStyle
  | EmbedToggleStyleInverted
)[] = [
  EmbedToggleStyle.progressRing,
  EmbedToggleStyleInverted.progressRing,
  EmbedToggleStyle.arrow,
  EmbedToggleStyle.text,
  EmbedToggleStyleInverted.text,
];

export const bannerPaddings = [
  { value: BannerPadding.large, text: 'Large' },
  { value: BannerPadding.medium, text: 'Medium' },
  { value: BannerPadding.small, text: 'Small' },
];

export const DARK_COLOR_THRESHOLD = 100;

export const MIN_PARAGRAPH_FONT_SIZE_PX = 5;
export const MAX_PARAGRAPH_FONT_SIZE_PX = 25;

export const MIN_PARAGRAPH_LINE_HEIGHT_PX = 5;
export const MAX_PARAGRAPH_LINE_HEIGHT_PX = 80;

export function isSidebarToggleInverted(toggleStyle: string) {
  return (
    toggleStyle === EmbedToggleStyleInverted.progressRing ||
    toggleStyle === EmbedToggleStyleInverted.text
  );
}

/**
 * Massage the toggleStyle for inverted case
 */
export const massageInitialToggleStyle = (toggleStyle: string) => {
  switch (toggleStyle) {
    case EmbedToggleStyle.progressRing:
      return EmbedToggleStyleInverted.progressRing;

    case EmbedToggleStyle.text:
      return EmbedToggleStyleInverted.text;

    default:
      return toggleStyle;
  }
};

/**
 * Massage the toggleStyle value when the inverted one is chosen
 */
export const massageToggleStyle = (
  toggleStyle: EmbedToggleStyleInverted | EmbedToggleStyle | string
): EmbedToggleStyle => {
  switch (toggleStyle) {
    case EmbedToggleStyleInverted.progressRing:
      return EmbedToggleStyle.progressRing;

    case EmbedToggleStyleInverted.text:
      return EmbedToggleStyle.text;

    default:
      return toggleStyle as EmbedToggleStyle;
  }
};
