import {
  getGuideThemeFlags,
  isCardTheme,
  isCarouselTheme,
  isCompactTheme,
  isVideoGalleryTheme,
} from '../data/helpers';
import { EmbedFormFactor, GuideFormFactor, Theme } from '../types';
import {
  FormFactorStateKey,
  Guide,
  InlineEmbedEntityId,
} from '../types/globalShoyuState';
import { INLINE_CONTEXT_FORM_FACTOR_PREFIX } from './constants';

const embedFormFactorHelper =
  (embedFormFactor: EmbedFormFactor) =>
  (formFactor: FormFactorStateKey): boolean =>
    formFactor === embedFormFactor;

export const isInlineEmbed = embedFormFactorHelper(EmbedFormFactor.inline);
export const isSidebarEmbed = embedFormFactorHelper(EmbedFormFactor.sidebar);
export const isModalEmbed = embedFormFactorHelper(EmbedFormFactor.modal);
export const isBannerEmbed = embedFormFactorHelper(EmbedFormFactor.banner);
export const isTooltipEmbed = embedFormFactorHelper(EmbedFormFactor.tooltip);

const guideFormFactorHelper =
  (guideFormFactor: GuideFormFactor) =>
  (formFactor: GuideFormFactor | null | undefined): boolean =>
    formFactor === guideFormFactor;

export const isInlineOrSidebarGuide = guideFormFactorHelper(
  GuideFormFactor.legacy
);
export const isInlineGuide = guideFormFactorHelper(GuideFormFactor.inline);
export const isSidebarGuide = guideFormFactorHelper(GuideFormFactor.sidebar);
export const isBannerGuide = guideFormFactorHelper(GuideFormFactor.banner);
export const isModalGuide = guideFormFactorHelper(GuideFormFactor.modal);
export const isTooltipGuide = guideFormFactorHelper(GuideFormFactor.tooltip);
export const isFlowGuide = guideFormFactorHelper(GuideFormFactor.flow);
export const isLegacyGuide = guideFormFactorHelper(GuideFormFactor.legacy);

export const isAnnouncementGuide = (
  formFactor: GuideFormFactor | null | undefined
) => isBannerGuide(formFactor) || isModalGuide(formFactor);

export const isModulelessGuide = (theme: Theme, formFactor: GuideFormFactor) =>
  isCompactTheme(theme) ||
  isCarouselTheme(theme) ||
  isCardTheme(theme) ||
  isVideoGalleryTheme(theme) ||
  isAnnouncementGuide(formFactor) ||
  isTooltipGuide(formFactor);

export const isInlineContextualGuide = (theme: Theme | undefined) =>
  isCardTheme(theme) || isCarouselTheme(theme) || isVideoGalleryTheme(theme);

/**
 * The same as `isInlineContextualGuide` above, but for SQL queries
 */
export const isInlineContextualGuideSql = (themeColumnName = 'theme') =>
  `${themeColumnName} IN ('${Theme.card}', '${Theme.carousel}', '${Theme.videoGallery}')`;

/** Guide types where step details aren't exposed */
export const areStepDetailsHidden = (
  formFactor: GuideFormFactor,
  theme: Theme
) =>
  isAnnouncementGuide(formFactor) ||
  isCardTheme(theme) ||
  isTooltipGuide(formFactor);

/** Whether a guide contains only one step regardless of its configuration. */
export const hasOnlyOneStep = (guide: Guide | undefined): boolean =>
  (guide?.steps?.length || 0) <= 1 || false;

/**
 * Whether a guide contains only one step due to its configuration.
 *
 * NOTE: Does not include CYOA or any other guides that could have multiple steps, even
 * if the guide only contains a single step.
 */
export const isSingleStepGuide = (
  theme: Theme | undefined,
  formFactor: GuideFormFactor | undefined
): boolean =>
  isInlineContextualGuide(theme) ||
  isAnnouncementGuide(formFactor) ||
  isTooltipGuide(formFactor);

export const isStandardMultiStepTheme = (theme: Theme | undefined) => {
  const { isNested, isFlat, isCompact, isTimeline } = getGuideThemeFlags(theme);
  return isNested || isFlat || isCompact || isTimeline;
};

export const supportsUpdatedMediaHandling = (
  theme: Theme | undefined,
  formFactor: GuideFormFactor | undefined
) =>
  isCardTheme(theme) ||
  isModalGuide(formFactor) ||
  isTooltipGuide(formFactor) ||
  isFlowGuide(formFactor);

export const getEverboardingInlineFormFactor = (embedId: InlineEmbedEntityId) =>
  `${INLINE_CONTEXT_FORM_FACTOR_PREFIX}${embedId}` as FormFactorStateKey;

export const getInlineEmbedIdFromFormFactor = (
  formFactor: FormFactorStateKey | undefined
): InlineEmbedEntityId | undefined => {
  if (
    !!formFactor &&
    formFactor.startsWith(INLINE_CONTEXT_FORM_FACTOR_PREFIX)
  ) {
    return formFactor.replace(
      INLINE_CONTEXT_FORM_FACTOR_PREFIX,
      ''
    ) as InlineEmbedEntityId;
  }
  return undefined;
};

export const isSidebarInjectedAsInline = (
  theme: Theme | undefined,
  isSideQuest: boolean | undefined,
  formFactor: GuideFormFactor | undefined
): boolean =>
  !!isSideQuest &&
  !isInlineContextualGuide(theme) &&
  isInlineEmbed(formFactor!);

//
// Holistic checks
//
// The helpers below are meant to holistically check all relevant attributes according to our data model
// to ultimately determine the "form factor" of any given Guide/Template/etc.
//
// The goal is to help standardize checks performed in many different places and require less code duplication.
//

type BaseGuideTarget<A> = A & {
  formFactor: GuideFormFactor;
  isSideQuest: boolean;
  theme: Theme;
};

/**
 * NOTE: Currently, we don't care about which theme an announcement comes from, but
 * we assume it is going to be Nested (aka standard).
 */
export const isAnnouncement = <A>(
  target: Omit<BaseGuideTarget<A>, 'theme'>
): Boolean => {
  return target.isSideQuest && isAnnouncementGuide(target.formFactor);
};

export const isCarousel = <A>(target: BaseGuideTarget<A>): Boolean => {
  return (
    target.isSideQuest &&
    isInlineGuide(target.formFactor) &&
    isCarouselTheme(target.theme)
  );
};

export const isSidebarContextualGuide = <A>(target: BaseGuideTarget<A>) => {
  return (
    (target.isSideQuest && isSidebarGuide(target.formFactor)) ||
    isSidebarInjectedAsInline(
      target.theme,
      target.isSideQuest,
      target.formFactor
    )
  );
};

/**
 * Checks whether the given target is a contextual checklist, regardless of how it
 * is location targeted (i.e. tag, specific page, shown in guides list, etc.)
 */
export const isContextualChecklist = <A>(target: BaseGuideTarget<A>) => {
  return (
    !!target.isSideQuest &&
    isSidebarGuide(target.formFactor) &&
    !isInlineContextualGuide(target.theme)
  );
};

export const usesFirstStepTagLocation = (
  formFactor: GuideFormFactor | undefined
) => isFlowGuide(formFactor);
