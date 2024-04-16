import { EmbedFormFactor, VisualTagPulseLevel } from 'bento-common/types/index';
import { BentoComponentsEnum, ComposedComponentsEnum } from 'types';
import set from 'lodash/set';

import {
  Theme,
  BannerTypeEnum,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
} from 'bento-common/types';
import { ContextTagType, FullGuide } from 'bento-common/types/globalShoyuState';
import { transformedFullGuideAssociations } from 'bento-common/utils/previews';

import sampleStandardGuide from 'bento-common/sampleGuides/standardGuide';
import sampleCompactGuide from 'bento-common/sampleGuides/compactGuide';
import sampleFlatGuide from 'bento-common/sampleGuides/flatGuide';
import sampleTimelineGuide from 'bento-common/sampleGuides/timelineGuide';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import sampleBannerGuide from 'bento-common/sampleGuides/bannerGuide';
import sampleTooltipGuide from 'bento-common/sampleGuides/sampleTooltipGuide';
import sampleStandaloneBranchingStepGuide from 'bento-common/sampleGuides/standaloneBranchingStepGuide';
import placeholderCardGuide from 'bento-common/sampleGuides/placeholderCardGuide';
import placeholderCarouselGuide from 'bento-common/sampleGuides/placeholderCarouselGuide';
import placeholderVideoGalleryGuide from 'bento-common/sampleGuides/placeholderVideoGalleryGuide';
import { addStepsToSampleGuide } from 'bento-common/utils/templates';

export type PreviewDataOverride = {
  [key: string]: any;
};

/**
 * DANGER: Many components here share the same value (`bento-embed`) therefore we can't
 * accurately rely on grabbing the defaults throught the map, otherwise we run the risk of
 * incorrectly setting defaults in some cases (i.e. inline vs inline contextual).
 *
 * @todo refactor
 */
export const defaultsByComponentMap: Record<
  BentoComponentsEnum | ComposedComponentsEnum,
  Partial<FullGuide>
> = {
  [BentoComponentsEnum.banner]: {
    designType: GuideDesignType.announcement,
    formFactor: GuideFormFactor.banner,
    isSideQuest: true,
  },
  [BentoComponentsEnum.tooltip]: {
    designType: GuideDesignType.everboarding,
    formFactor: GuideFormFactor.tooltip,
    isSideQuest: true,
  },
  [BentoComponentsEnum.modal]: {
    designType: GuideDesignType.announcement,
    formFactor: GuideFormFactor.modal,
    isSideQuest: true,
  },
  [BentoComponentsEnum.context]: {
    designType: GuideDesignType.everboarding,
    formFactor: GuideFormFactor.sidebar,
    isSideQuest: true,
  },
  [BentoComponentsEnum.legacy]: {
    formFactor: GuideFormFactor.legacy,
    isSideQuest: false,
  },
  [BentoComponentsEnum.inline]: {
    formFactor: GuideFormFactor.inline,
    isSideQuest: false,
  },
  [BentoComponentsEnum.sidebar]: {
    formFactor: GuideFormFactor.sidebar,
    isSideQuest: false,
  },
  [BentoComponentsEnum.inlineContext]: {
    formFactor: GuideFormFactor.inline,
    isSideQuest: true,
  },
  [ComposedComponentsEnum.flow]: {
    designType: GuideDesignType.everboarding,
    formFactor: GuideFormFactor.flow,
    isSideQuest: true,
  },
};

export const embedFormFactorForComponent: Record<
  BentoComponentsEnum,
  EmbedFormFactor
> = {
  [BentoComponentsEnum.banner]: EmbedFormFactor.banner,
  [BentoComponentsEnum.modal]: EmbedFormFactor.modal,
  [BentoComponentsEnum.context]: EmbedFormFactor.sidebar,
  [BentoComponentsEnum.legacy]: EmbedFormFactor.inline,
  [BentoComponentsEnum.inline]: EmbedFormFactor.inline,
  [BentoComponentsEnum.sidebar]: EmbedFormFactor.sidebar,
  [BentoComponentsEnum.tooltip]: EmbedFormFactor.tooltip,
  [BentoComponentsEnum.inlineContext]: EmbedFormFactor.inline,
};

const sampleGuidesByLayout = {
  [Theme.nested]: sampleStandardGuide,
  [Theme.flat]: sampleFlatGuide,
  [Theme.compact]: sampleCompactGuide,
  [Theme.timeline]: sampleTimelineGuide,
  [Theme.card]: placeholderCardGuide,
  [Theme.carousel]: placeholderCarouselGuide,
  [Theme.videoGallery]: placeholderVideoGalleryGuide,
};

function getSampleGuide(
  theme: Theme,
  component: BentoComponentsEnum | ComposedComponentsEnum,
  branching = false
): Omit<FullGuide, 'steps'> {
  let guide: Omit<FullGuide, 'steps'>;

  switch (component) {
    case BentoComponentsEnum.modal:
      guide = modalGuide;
      break;

    case BentoComponentsEnum.banner:
      guide = sampleBannerGuide;
      break;

    case BentoComponentsEnum.tooltip:
      guide = sampleTooltipGuide;
      // guide.formFactor=GuideFormFactor.flow;
      break;

    case ComposedComponentsEnum.flow:
      guide = sampleTooltipGuide;
      guide.formFactor = GuideFormFactor.flow;
      break;

    case BentoComponentsEnum.legacy:
    case BentoComponentsEnum.inline:
    case BentoComponentsEnum.sidebar:
    case BentoComponentsEnum.inlineContext:
      guide = branching
        ? sampleStandaloneBranchingStepGuide
        : sampleGuidesByLayout[theme];

      if (!guide) throw Error(`Unknown sample guide for: ${theme}`);
      break;

    case BentoComponentsEnum.context:
      guide = sampleStandardGuide;
      break;

    default:
      throw new Error(`Unknown sample guide for: ${component}`);
  }

  return addStepsToSampleGuide(guide);
}

/**
 * @todo unify with other similar functions out there
 */
export const getPreviewGuide = (
  theme: Theme,
  component: BentoComponentsEnum | ComposedComponentsEnum,
  branching: boolean,
  overrideData?: PreviewDataOverride
): FullGuide => {
  const guide = {
    ...getSampleGuide(theme, component, branching),
    ...defaultsByComponentMap[component],
    // disables any targeting logic
    pageTargeting: {
      type: GuidePageTargetingType.anyPage,
    },
    pageTargetingType: GuidePageTargetingType.anyPage,
    pageTargetingUrl: null,
  };

  if (overrideData) {
    for (const [key, value] of Object.entries(overrideData)) {
      set(guide, key, value);
    }
  }

  return transformedFullGuideAssociations(guide, true);
};

export const MAIN_PREVIEW_OPTIONS = [
  { label: 'Checklist (inline)', value: BentoComponentsEnum.inline },
  { label: 'Checklist (sidebar)', value: BentoComponentsEnum.sidebar },
  { label: 'Contextual guide', value: BentoComponentsEnum.sidebar },
  { label: 'Announcement', value: BentoComponentsEnum.modal },
];

export const GUIDES_CHECKLISTS_PREVIEW_OPTIONS = [
  { label: 'Inline', value: BentoComponentsEnum.inline },
  { label: 'Sidebar', value: BentoComponentsEnum.sidebar },
];

export const GUIDES_CONTEXTUAL_PREVIEW_OPTIONS = [
  { label: 'Tooltip', value: BentoComponentsEnum.tooltip },
  { label: 'Embedded guides', value: BentoComponentsEnum.inlineContext },
];

export const GUIDES_ANNOUNCEMENTS_PREVIEW_OPTIONS = [
  { label: 'Modal', value: BentoComponentsEnum.modal },
  {
    label: 'Banner (floating)',
    value: [BentoComponentsEnum.banner, BannerTypeEnum.floating],
  },
  {
    label: 'Banner (inline)',
    value: [BentoComponentsEnum.banner, BannerTypeEnum.inline],
  },
];

export const COMPONENTS_VISUAL_TAG_PREVIEW_OPTIONS = [
  { label: 'Dot', value: ContextTagType.dot },
  { label: 'Icon', value: ContextTagType.icon },
  { label: 'Badge', value: ContextTagType.badge },
  { label: 'Badge dot', value: ContextTagType.badgeDot },
  { label: 'Badge icon', value: ContextTagType.badgeIcon },
];

export const COMPONENTS_BORDERS_OR_BOXES_PREVIEW_OPTIONS = [
  { label: 'Inline', value: BentoComponentsEnum.inline },
  { label: 'Sidebar', value: BentoComponentsEnum.sidebar },
];

export const COMPONENTS_COMPLETED_SYLE_PREVIEW_OPTIONS = [
  { label: 'Inline', value: BentoComponentsEnum.inline },
  { label: 'Sidebar', value: BentoComponentsEnum.sidebar },
];

export const TAG_PULSE_LEVEL_OPTIONS = [
  { label: 'Standard', value: VisualTagPulseLevel.standard },
  { label: 'None', value: VisualTagPulseLevel.none },
];
