import {
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  StepBodyOrientation,
  Theme,
} from 'bento-common/types';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import { BranchingFormFactor } from 'types';
import { ExtendedCalloutTypes } from 'bento-common/types/slate';
import InlineHorizontalContextGuide from '../../icons/InlineHorizontalContextGuide';
import InlineVerticalContextGuide from '../../icons/InlineVerticalContextGuide';
import TimelineContextGuide from 'icons/TimelineContextGuide';
import VideoGalleryContextGuide from 'icons/VideoGalleryContextGuide';
import { formatContextualKey } from './library.helpers';
import ContextualInlineChecklist from 'icons/ContextualInlineChecklist';
import { BranchingType } from 'bento-common/types/templateData';

export const TEMPLATE_SCOPE_OPTIONS = {
  [GuideTypeEnum.user]: {
    id: 'template-scope-user',
    label: 'User',
    description:
      'Guide is shown individually to each user, and tracks progress at a user level.',
    iconType: ExtendedCalloutTypes.UserGuide,
  },
  [GuideTypeEnum.account]: {
    id: 'template-scope-account',
    label: 'Account',
    description: 'Guide is shown and tracks progress on an account level.',
    iconType: ExtendedCalloutTypes.AccountGuide,
  },
};

export const TEMPLATE_TARGETING_OPTIONS = {
  [GuidePageTargetingType.visualTag]: {
    label: 'Click on a visual tag',
  },
  [GuidePageTargetingType.specificPage]: {
    label: 'On a specific page',
  },
  [GuidePageTargetingType.anyPage]: {
    label: 'Only in the “Guides” list (least discoverable)',
  },
  [GuidePageTargetingType.inline]: {
    label: 'On a specific page',
  },
};

export const contextualTypeStrings = {
  /**
   * Sidebar formFactor is "inline" because that's the default targeting
   * we want to give for such guides.
   */
  sidebar: formatContextualKey(GuideFormFactor.inline, Theme.nested),
  tooltip: formatContextualKey(GuideFormFactor.tooltip, Theme.nested),
  timeline: formatContextualKey(GuideFormFactor.inline, Theme.timeline),
  carouselVertical: formatContextualKey(
    GuideFormFactor.inline,
    Theme.carousel,
    StepBodyOrientation.vertical
  ),
  carouselHorizontal: formatContextualKey(
    GuideFormFactor.inline,
    Theme.carousel,
    StepBodyOrientation.horizontal
  ),
  inlineVertical: formatContextualKey(
    GuideFormFactor.inline,
    Theme.card,
    StepBodyOrientation.vertical
  ),
  inlineHorizontal: formatContextualKey(
    GuideFormFactor.inline,
    Theme.card,
    StepBodyOrientation.horizontal
  ),
  videoGallery: formatContextualKey(GuideFormFactor.inline, Theme.videoGallery),
};

export const CONTEXTUAL_COMPONENT_OPTIONS = {
  [contextualTypeStrings.sidebar]: {
    type: contextualTypeStrings.sidebar,
    title: 'Contextual checklist',
    ImgComponent: ContextualInlineChecklist,
    description: 'Checklist guide for a specific page',
  },
  [contextualTypeStrings.inlineHorizontal]: {
    type: contextualTypeStrings.inlineHorizontal,
    title: 'Horizontal card',
    ImgComponent: InlineHorizontalContextGuide,
    description: 'A wider single step embedded on your page',
  },
  [contextualTypeStrings.inlineVertical]: {
    type: contextualTypeStrings.inlineVertical,
    title: 'Vertical card',
    ImgComponent: InlineVerticalContextGuide,
    description: 'A narrower single step embedded on your page',
  },
  [contextualTypeStrings.carouselHorizontal]: {
    type: contextualTypeStrings.carouselHorizontal,
    title: 'Carousel',
    ImgComponent: TimelineContextGuide,
    description: 'Card-like component that can showcase images, videos, text',
  },
  [contextualTypeStrings.videoGallery]: {
    type: contextualTypeStrings.videoGallery,
    title: 'Video gallery',
    ImgComponent: VideoGalleryContextGuide,
    description:
      'A video player and collection of videos embedded on your page',
  },
};

export const BRANCHING_TYPE_OPTIONS = [
  {
    label: `Add a ${MODULE_ALIAS_SINGULAR}`,
    value: BranchingType.module,
  },
  {
    label: 'Add guide',
    value: BranchingType.guide,
  },
];

export const BRANCHING_FORM_FACTOR_OPTIONS = [
  {
    label: 'Dropdown',
    value: BranchingFormFactor.Dropdown,
  },
  {
    label: 'Cards',
    value: BranchingFormFactor.Cards,
  },
];
