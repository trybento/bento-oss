import { SVGProps } from 'react';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { GuideFormFactor, Theme } from 'bento-common/types';
import AnnouncementImage from 'icons/AnnouncementType';
import ChecklistImage from 'icons/Checklist';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import Tooltip from 'icons/Tooltip';
import {
  GuideCreateType,
  GUIDE_STYLE_LABELS,
  LibraryCreateEnum,
  LibraryCreateTooltipType,
  OnboardingEnum,
  ONBOARDING_LABELS,
  THEME_LABELS,
  TOOLTIP_LABELS,
} from 'bento-common/data/helpers';
import NestedLayout from 'icons/NestedLayout';
import FlatLayout from 'icons/FlatLayout';
import CompactLayout from 'icons/CompactLayout';
import Banner from 'icons/Banner';
import CYOAImage from 'icons/CYOA';
import TimelineLayout from 'icons/TimelineLayout';
import TooltipIcon from 'icons/Tooltip';
import InlineHorizontalContextGuide from 'icons/InlineHorizontalContextGuide';
import FlowGuide from 'icons/FlowGuide';

export type SelectorOption<T> = {
  /** Useful to add friendly unique identifiers to DOM elements, which helps Bento on Bento */
  id?: string;
  type: T;
  title: string;
  ImgComponent: React.FC<SVGProps<SVGSVGElement>>;
  description: string;
  disabled?: boolean;
};

export const moduleTypeOption = {
  type: LibraryCreateEnum.module,
  title: capitalizeFirstLetter(MODULE_ALIAS_SINGULAR),
  description: 'A set of steps that can be re-used in any guide',
};

export const templateTypeOptions: SelectorOption<GuideCreateType>[] = [
  {
    id: 'template-type-onboarding',
    type: LibraryCreateEnum.guide,
    title: GUIDE_STYLE_LABELS[LibraryCreateEnum.guide],
    ImgComponent: ChecklistImage,
    description: 'Checklist shown in a central page and also in the sidebar',
  },
  {
    id: 'template-type-everboarding',
    type: LibraryCreateEnum.everboarding,
    title: GUIDE_STYLE_LABELS[LibraryCreateEnum.everboarding],
    ImgComponent: InlineHorizontalContextGuide,
    description: 'Inline and sidebar guides targeted to a specific page',
  },
  {
    id: 'template-type-tooltips-and-flows',
    type: LibraryCreateEnum.tooltipsAndFlows,
    title: GUIDE_STYLE_LABELS[LibraryCreateEnum.tooltipsAndFlows],
    ImgComponent: TooltipIcon,
    description: 'Guidance floating next to an element on the page',
  },
  {
    id: 'template-type-announcements',
    type: LibraryCreateEnum.announcements,
    title: GUIDE_STYLE_LABELS[LibraryCreateEnum.announcements],
    ImgComponent: AnnouncementImage,
    description: 'Modals and overlay banners',
  },
];

export const onboardingOptions: SelectorOption<OnboardingEnum>[] = [
  {
    id: 'onboarding-type-checklist',
    type: OnboardingEnum.guide,
    title: ONBOARDING_LABELS[OnboardingEnum.guide],
    ImgComponent: ChecklistImage,
    description:
      'Multi step-checklist usually inline into a page, but also can follow the user across the app',
  },
  {
    id: 'onboarding-type-cyoa',
    type: OnboardingEnum.cyoa,
    title: ONBOARDING_LABELS[OnboardingEnum.cyoa],
    ImgComponent: CYOAImage,
    description: `Allows the user to pick a path which then kicks off a guide`,
  },
];

export const tooltipOptions: SelectorOption<LibraryCreateTooltipType>[] = [
  {
    id: 'floating-type-tooltip',
    type: LibraryCreateTooltipType.tooltip,
    title: TOOLTIP_LABELS[LibraryCreateTooltipType.tooltip],
    ImgComponent: Tooltip,
    description:
      'Small pop-up box, typically attached to a visual tag that appears on hover or click',
  },
  {
    id: 'floating-type-flow',
    type: LibraryCreateTooltipType.flow,
    title: TOOLTIP_LABELS[LibraryCreateTooltipType.flow],
    ImgComponent: FlowGuide,
    description: `Several tooltips that are connected`,
  },
];

/** Themes included: Nested, flat, compact, timeline. */
export const themeOptions = [
  {
    id: 'theme-type-nested',
    type: Theme.nested,
    title: THEME_LABELS[Theme.nested],
    ImgComponent: NestedLayout,
    description:
      'Good for grouping steps into themes. Supports more step content',
  },
  {
    id: 'theme-type-flat',
    type: Theme.flat,
    title: THEME_LABELS[Theme.flat],
    ImgComponent: FlatLayout,
    description: `Conveys a lightweight onboarding experience.`,
  },
  {
    id: 'theme-type-compat',
    type: Theme.compact,
    title: THEME_LABELS[Theme.compact],
    ImgComponent: CompactLayout,
    description:
      'Shows all steps at a high level, but can expand for more details',
  },
  {
    id: 'theme-type-timeline',
    type: Theme.timeline,
    title: THEME_LABELS[Theme.timeline],
    ImgComponent: TimelineLayout,
    description: `Good if you don't need a "list" of steps, and want to focus on the content in a step`,
  },
];

export const announcementStyleOptions = [
  {
    id: 'announcement-type-modal',
    type: GuideFormFactor.modal,
    title: 'Modal',
    ImgComponent: AnnouncementImage,
    description: 'Window overlay usually with a background color',
  },
  {
    id: 'announcement-type-banner',
    type: GuideFormFactor.banner,
    title: 'Banner',
    ImgComponent: Banner,
    description: `Inline or floating but always at the top or bottom of a page`,
  },
];

export const getDefaultThemeForCreateType = (
  createType: GuideCreateType,
  defaultOnboardingTheme: Theme
): Theme => {
  switch (createType) {
    case LibraryCreateEnum.guide:
      return defaultOnboardingTheme;

    default:
      return Theme.nested;
  }
};
