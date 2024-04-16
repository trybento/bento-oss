import { $enum } from 'ts-enum-util';

import {
  FormFactorStateKey,
  FullGuide,
  Guide,
  GuideShape,
  NpsSurvey,
  Step,
  StepCTA,
  StepInput,
  TaggedElement,
} from '../types/globalShoyuState';
import {
  AlignmentEnum,
  AllGuidesStyle,
  AtLeast,
  BannerStyle,
  BentoEvents,
  BranchingEntityType,
  CardStyle,
  CarouselStyle,
  ChecklistStyle,
  ComponentType,
  ContextTagTypeDimensionsType,
  CtaColorFields,
  CtaInput,
  CtasOrientation,
  DataSource,
  DefaultStepCtaText,
  DynamicAttributes,
  EmbedFormFactor,
  FormFactorStyle,
  GuideBaseState,
  GuideCompletionState,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuidesListEnum,
  GuideState,
  GuideTypeEnum,
  ModalStyle,
  OrientableFormFactorStyle,
  RuleTypeEnum,
  SplitTestState,
  StepBodyOrientation,
  StepCtaSettings,
  StepCtaStyle,
  StepCtaType,
  StepInputFieldSettings,
  StepInputFieldType,
  StepSeparationType,
  StepType,
  TemplateState,
  Theme,
  TooltipShowOn,
  TooltipStyle,
  VerticalAlignmentEnum,
  VideoGalleryStyle,
  VisualTagHighlightType,
  WithOptionalPicks,
} from '../types';
import {
  isInlineOrSidebarGuide,
  isSidebarGuide,
  isInlineGuide,
  isAnnouncementGuide,
  isBannerGuide,
  isModalGuide,
  isSidebarEmbed,
  isTooltipGuide,
  isFlowGuide,
} from '../utils/formFactor';
import { capitalizeFirstLetter } from '../utils/strings';
import { CTA_DEFAULT_EVENT_NAME } from '../utils/constants';
import { BentoUI } from '../types/preview';
import { isEqual, isNil, pick } from '../utils/lodash';
import {
  InlineEmptyBehaviour,
  SidebarVisibility,
  View,
} from '../types/shoyuUIState';
import { VideoSourceType } from '../types/slate';
import { guideNameOrFallback, stepNameOrFallback } from '../utils/naming';
import {
  ImageMediaMeta,
  ImageMediaReferenceSettings,
  MediaMeta,
  MediaReferenceSettings,
  MediaType,
  NumberAttributeMediaMeta,
  NumberAttributeMediaReferenceSettings,
  VideoMediaMeta,
  VideoMediaReferenceSettings,
} from '../types/media';
import { NpsSurveyState } from '../types/netPromoterScore';

export const removeWhiteSpaces = (str: string | null | undefined): string =>
  typeof str === 'string' ? str.replace(/\s/g, '') : '';

export const uniqueConcat = <T>(arr1: T[], arr2: T[]) => [
  ...new Set([...arr1, ...arr2]),
];

export const isSplitTestGuide = (type: GuideTypeEnum | undefined) =>
  type === GuideTypeEnum.splitTest;

export const isGuideInActiveSplitTest = (
  splitTestState: SplitTestState | undefined
) => splitTestState === SplitTestState.live;

export const isGuideInDraftSplitTest = (
  splitTestState: SplitTestState | undefined
) => splitTestState === SplitTestState.draft;

/** Is this guide state considered "live" or not */
export function isGuideStateActive(
  state: TemplateState | GuideBaseState | GuideState
) {
  switch (state) {
    case TemplateState.live:
    case GuideBaseState.active:
    case GuideState.active:
      return true;
    default:
      return false;
  }
}

/** CTA types that are mandatory for a step type */
export const getImplicitStepCtas = ({
  stepType,
  branchingMultiple,
  branchingType,
}: {
  stepType: StepType | undefined;
  branchingMultiple: boolean | undefined;
  branchingType: BranchingEntityType | undefined;
}): DefaultStepCta[] => {
  const settings = { ...getDefaultCtaSetting(null), implicit: true };

  if (isInputStep(stepType)) {
    return [
      {
        text: DefaultStepCtaText.submit,
        type: StepCtaType.complete,
        style: StepCtaStyle.solid,
        settings,
      },
    ];
  }

  if (
    isBranchingStep(stepType) &&
    branchingMultiple &&
    branchingType === BranchingEntityType.Module
  ) {
    return [
      {
        text: DefaultStepCtaText.continue,
        type: StepCtaType.complete,
        style: StepCtaStyle.solid,
        settings,
      },
    ];
  }

  return [];
};

export enum LibraryCreateEnum {
  guide = 'guide',
  everboarding = 'everboarding',
  announcements = 'announcements',
  tooltipsAndFlows = 'tooltipsAndFlows',
  module = 'module',
  nps = 'nps',
}

export type GuideCreateType = Exclude<
  LibraryCreateEnum,
  LibraryCreateEnum.module
>;

export enum OnboardingEnum {
  guide = 'guide',
  cyoa = 'cyoa',
}

export enum LibraryCreateTooltipType {
  tooltip = 'tooltip',
  flow = 'flow',
}

function themeCheckerFactory(expectedTheme: Theme) {
  return (theme?: Theme | null) => theme === expectedTheme;
}

export const getDefaultCtasOrientation = (
  formFactor: GuideFormFactor | undefined,
  theme: Theme | undefined
): CtasOrientation => {
  if (isCarouselTheme(theme)) {
    return CtasOrientation.spaceBetween;
  }
  if (isModalGuide(formFactor)) {
    return CtasOrientation.right;
  }
  return CtasOrientation.left;
};

export const {
  isFlatTheme,
  isCompactTheme,
  isNestedTheme,
  isTimelineTheme,
  isCardTheme,
  isCarouselTheme,
  isVideoGalleryTheme,
} = Object.fromEntries(
  $enum(Theme)
    .getEntries()
    .map(([k, t]) => [
      `is${capitalizeFirstLetter(k)}Theme`,
      themeCheckerFactory(t),
    ])
);

type GuideThemeFlags = {
  isNested: boolean;
  isCompact: boolean;
  isFlat: boolean;
  isTimeline: boolean;
  isCard: boolean;
  isCarousel: boolean;
  isVideoGallery: boolean;
};

export const getGuideThemeFlags = (theme: Theme | undefined) =>
  Object.fromEntries(
    $enum(Theme)
      .getEntries()
      .map(([k, v]) => [`is${capitalizeFirstLetter(k)}`, v === theme])
  ) as GuideThemeFlags;

export const GUIDE_STYLE_LABELS: Record<
  Exclude<LibraryCreateEnum, LibraryCreateEnum.module | LibraryCreateEnum.nps>,
  string
> = {
  [LibraryCreateEnum.guide]: 'Onboarding',
  [LibraryCreateEnum.everboarding]: 'Contextual guides',
  [LibraryCreateEnum.announcements]: 'Announcement',
  [LibraryCreateEnum.tooltipsAndFlows]: 'Tooltips and flows',
};

export const ONBOARDING_LABELS: Record<OnboardingEnum, string> = {
  [OnboardingEnum.guide]: 'Onboarding checklist',
  [OnboardingEnum.cyoa]: 'CYOA',
};

export const TOOLTIP_LABELS: Record<LibraryCreateTooltipType, string> = {
  [LibraryCreateTooltipType.tooltip]: 'Tooltip',
  [LibraryCreateTooltipType.flow]: 'Flow',
};

export const THEME_LABELS: Record<Theme, string> = {
  [Theme.flat]: 'Flat',
  [Theme.nested]: 'Nested',
  [Theme.compact]: 'Compact',
  [Theme.timeline]: 'Timeline',
  [Theme.card]: 'Card',
  [Theme.carousel]: 'Carousel',
  [Theme.videoGallery]: 'Video gallery',
};

export const getThemeOptions = (themes: Theme[]) =>
  themes.map((t) => ({ label: THEME_LABELS[t], value: t }));

export const ORIENTATION_LABELS: Record<StepBodyOrientation, string> = {
  [StepBodyOrientation.horizontal]: 'Wide',
  [StepBodyOrientation.vertical]: '',
};

export const VIEWED_FROM = {
  [EmbedFormFactor.inline]: 'embed_inline',
  [EmbedFormFactor.sidebar]: 'embed_sidebar',
  [EmbedFormFactor.modal]: 'embed_modal',
};

export const SOURCE_LABELS = {
  [DataSource.bento]: 'Bento',
  [DataSource.snippet]: 'Direct: JS snippet',
  [DataSource.api]: 'Direct: JS Snippet',
  [DataSource.import]: 'Direct: CSV import',
};

export const rawTooltipTitleForGuide = (
  designType: GuideDesignType | undefined,
  guideName: string | null | undefined,
  stepName: string | null | undefined
) => {
  if (designType === GuideDesignType.announcement || !stepName) {
    return guideNameOrFallback(guideName);
  }
  return stepNameOrFallback(stepName);
};

/**
 * Visual tagged elements take the title of their parent step if there is one but otherwise
 * the guide, except for announcements, which always take the title of the guide.
 */
export const tooltipTitleForGuide = (
  step: Pick<Step, 'name'> | null | undefined,
  guide:
    | WithOptionalPicks<Pick<Guide, 'name' | 'designType'>, 'name'>
    | null
    | undefined
): string => {
  return rawTooltipTitleForGuide(
    guide?.designType,
    guideNameOrFallback(guide?.name),
    step?.name
  );
};

export const EmbedFormFactorsForGuideFormFactor: Record<
  GuideFormFactor,
  EmbedFormFactor[]
> = {
  [GuideFormFactor.legacy]: [EmbedFormFactor.inline, EmbedFormFactor.sidebar],
  [GuideFormFactor.inline]: [EmbedFormFactor.inline],
  [GuideFormFactor.sidebar]: [EmbedFormFactor.sidebar],
  [GuideFormFactor.modal]: [EmbedFormFactor.modal],
  [GuideFormFactor.banner]: [EmbedFormFactor.banner],
  [GuideFormFactor.tooltip]: [EmbedFormFactor.tooltip],
  [GuideFormFactor.flow]: [EmbedFormFactor.flow],
};

export const isGuideEligibleToHideCompletedSteps = (theme: Theme | undefined) =>
  isFlatTheme(theme) || isCompactTheme(theme);

export function isGuideAllowedForEmbed(
  embedFF: EmbedFormFactor,
  guideFF: GuideFormFactor
) {
  return EmbedFormFactorsForGuideFormFactor[guideFF].includes(embedFF);
}

export function getEmbedFormFactorsForGuide(
  guide: FullGuide | Guide | undefined,
  formFactor: FormFactorStateKey | undefined
): FormFactorStateKey[] {
  return (
    (guide &&
      (!guide.isPreview || !formFactor) &&
      EmbedFormFactorsForGuideFormFactor[guide.formFactor]) ||
    (formFactor ? [formFactor!] : [])
  );
}

export function getEmbedFormFactorForContextualTagGuide(
  guide: FullGuide | Guide | undefined,
  formFactor: FormFactorStateKey | undefined
): FormFactorStateKey {
  const formFactors = getEmbedFormFactorsForGuide(guide, formFactor);
  if (formFactors.length > 1) {
    return EmbedFormFactor.sidebar;
  }
  return formFactors[0];
}

export const GuideFormFactorsForEmbedFormFactor = (
  Object.entries(EmbedFormFactorsForGuideFormFactor) as [
    GuideFormFactor,
    EmbedFormFactor[]
  ][]
).reduce(
  (map, [guideFF, embedFFs]) => {
    embedFFs.forEach((embedFF) =>
      map[embedFF].push(guideFF as GuideFormFactor)
    );
    return map;
  },
  Object.fromEntries<GuideFormFactor[]>(
    $enum(EmbedFormFactor)
      .getValues()
      .map((ff) => [ff, []])
  ) as Record<EmbedFormFactor, GuideFormFactor[]>
);

/**
 * Returns true if a guide is completed or done.
 */
export const isFinishedGuide = (guide?: Guide | FullGuide): boolean =>
  !!(
    guide?.isComplete ||
    guide?.isDone ||
    guide?.completionState === GuideCompletionState.complete ||
    guide?.completionState === GuideCompletionState.done
  );

export const isIncompleteGuide = (guide?: Guide | FullGuide) =>
  !isFinishedGuide(guide) ||
  guide?.completionState === GuideCompletionState.incomplete;

/**
 * Returns true if the survey has been answered or dismissed.
 */
export const isFinishedSurvey = (survey?: NpsSurvey): boolean =>
  !isIncompleteSurvey(survey);

/**
 * Returns true if the survey has NOT been answered/dismissed.
 */
export const isIncompleteSurvey = (survey?: NpsSurvey): boolean => {
  return !survey?.answeredAt && !survey?.dismissedAt;
};

/**
 * Returns true if the guide is saved, but not completed.
 *
 * Warning: We can't just rely on the saved indicator just because
 * savedAt is not always cleared when a previously
 * saved guide is marked as completed.
 */
export const isSavedGuide = (guide?: Guide | FullGuide): boolean => {
  return !isFinishedGuide(guide) && !!guide?.savedAt;
};

export const isBranchingStep = (
  stepOrType?: null | StepType | AtLeast<Step, 'stepType'>
) => {
  const stepType = (stepOrType as Step)?.stepType || (stepOrType as StepType);
  return (
    stepType === StepType.branching || stepType === StepType.branchingOptional
  );
};

export const isInputStep = (stepType: null | StepType | undefined) =>
  stepType === StepType.input;

export const isRequiredInputStep = (
  stepType: null | StepType | undefined,
  inputs: StepInput[] | undefined
) => isInputStep(stepType) && inputs?.some((i) => i.settings?.required);

export const isGuideBranchingStep = (step: Step) =>
  isBranchingStep(step.stepType) &&
  step.branching?.type === BranchingEntityType.Guide;

export const isSerialCyoa = (
  branchingEntityType: BranchingEntityType | undefined,
  branchingMultiple: boolean | undefined
) =>
  branchingEntityType &&
  branchingEntityType !== BranchingEntityType.Module &&
  branchingMultiple;

export const isLastIncompleteDropdownInStep = (
  dropdownId: string,
  step?: Step
) => {
  if (!step) return false;
  const unselectedDropdowns = (step.bodySlate || []).filter(
    (element) => element.type === 'select' && element.selectedValue
  );
  return (
    unselectedDropdowns.length === 1 && unselectedDropdowns[0].id === dropdownId
  );
};

/**
 * @deprecated use `original` from `immer` instead
 * @see https://immerjs.github.io/immer/pitfalls/#drafts-arent-referentially-equal
 */
export const deProxify = <D>(data: D) => JSON.parse(JSON.stringify(data)) as D;

export interface DefaultStepCtaGetterArgs {
  stepType: StepType | undefined;
  branchingMultiple: boolean | undefined;
  branchingType: BranchingEntityType | undefined;
  guideFormFactor: GuideFormFactor | undefined;
  theme: Theme | undefined;
}

export type DefaultStepCta = {
  text: string;
  type: StepCTA['type'];
  style: StepCtaStyle;
  settings?: StepCtaSettings;
};

export const MAX_STEP_CTA_TEXT_LENGTH = 25;
export const getMaxStepCtaCount = ({
  stepType,
  branchingMultiple,
  branchingType,
}: {
  stepType: StepType | undefined;
  branchingMultiple: boolean | undefined;
  branchingType: BranchingEntityType | undefined;
}) => {
  if (
    isBranchingStep(stepType) &&
    branchingMultiple &&
    branchingType === BranchingEntityType.Module
  )
    return 1;
  return 2;
};

export const isNavigationCta = (type: StepCtaType | undefined): boolean =>
  type === StepCtaType.back || type === StepCtaType.next;

export const isLaunchCta = (type: StepCtaType | undefined): boolean =>
  type === StepCtaType.launch;

export const isUrlCta = (type: StepCtaType | undefined): boolean =>
  type === StepCtaType.url || type === StepCtaType.urlComplete;

export const getDefaultStyleForCtaType = ({
  type,
  guideFormFactor,
}: {
  type: StepCtaType;
  guideFormFactor: GuideFormFactor | undefined;
}): StepCtaStyle => {
  if (isBannerGuide(guideFormFactor) || isTooltipGuide(guideFormFactor)) {
    return StepCtaStyle.link;
  }

  switch (type) {
    case StepCtaType.complete:
    case StepCtaType.url:
    case StepCtaType.urlComplete:
    case StepCtaType.launch:
      return StepCtaStyle.solid;

    case StepCtaType.skip:
    case StepCtaType.save:
    case StepCtaType.event:
    case StepCtaType.next:
    case StepCtaType.back:
      return StepCtaStyle.link;
  }
};

export const getDefaultTextForCtaType = ({
  type,
  stepType,
  guideFormFactor,
}: {
  type: StepCtaType;
  stepType: StepType | undefined;
  guideFormFactor: GuideFormFactor | undefined;
}): string => {
  if (!type) return '';

  switch (type) {
    case StepCtaType.complete: {
      if (
        isModalGuide(guideFormFactor) ||
        isBannerGuide(guideFormFactor) ||
        isTooltipGuide(guideFormFactor) ||
        stepType === StepType.optional ||
        stepType === StepType.branchingOptional
      ) {
        return DefaultStepCtaText.done;
      }

      if (stepType === StepType.fyi) return DefaultStepCtaText.next;
      if (isInputStep(stepType)) return DefaultStepCtaText.submit;

      return DefaultStepCtaText.markAsComplete;
    }

    case StepCtaType.skip:
      return DefaultStepCtaText.skip;

    case StepCtaType.save:
      return DefaultStepCtaText.saveForLater;

    case StepCtaType.launch:
      return DefaultStepCtaText.learnMore;

    case StepCtaType.urlComplete:
    case StepCtaType.url:
    case StepCtaType.event: {
      if (isBannerGuide(guideFormFactor)) return DefaultStepCtaText.readMore;
      return DefaultStepCtaText.tryIt;
    }
    case StepCtaType.next:
      return DefaultStepCtaText.next;
    case StepCtaType.back:
      return DefaultStepCtaText.back;
  }
};

/**
 * Combine CTA arrays while keeping
 * one CTA per type, having implicit CTAs
 * higher priority.
 */
const concatImplicitCtas = (
  implicitCtas: Array<StepCTA | DefaultStepCta>,
  ctas: StepCTA[]
) => {
  const implicitCtaTypes = implicitCtas.map((iCta) => iCta.type);
  return [
    ...implicitCtas,
    ...ctas.filter((cta) => !implicitCtaTypes.includes(cta.type)),
  ];
};

// Reference: https://www.figma.com/file/8s4r533IgK6mjYeJS25Lmt/Step-settings-%7C-Guide-Template---Content-tab?node-id=316%3A34126
export const getDefaultStepCtas = ({
  stepType,
  branchingMultiple,
  branchingType,
  guideFormFactor,
  theme,
}: DefaultStepCtaGetterArgs): DefaultStepCta[] => {
  const commonTextArgs: Omit<
    DefaultStepCtaGetterArgs,
    'theme' | 'branchingMultiple' | 'branchingType'
  > = {
    stepType,
    guideFormFactor,
  };

  const { isFlat, isCard, isCarousel } = getGuideThemeFlags(theme);

  const settings: StepCtaSettings = getDefaultCtaSetting(guideFormFactor);

  const implicitCtas = getImplicitStepCtas({
    stepType,
    branchingMultiple,
    branchingType,
  });

  if (isCarousel) {
    return concatImplicitCtas(implicitCtas, [
      {
        text: getDefaultTextForCtaType({
          type: StepCtaType.back,
          ...commonTextArgs,
        }),
        type: StepCtaType.back,
        style: StepCtaStyle.link,
        settings,
      },
      {
        text: getDefaultTextForCtaType({
          type: StepCtaType.next,
          ...commonTextArgs,
        }),
        type: StepCtaType.next,
        style: StepCtaStyle.link,
        settings,
      },
    ]);
  }

  if (
    (isFlat && !isInputStep(stepType)) ||
    isBannerGuide(guideFormFactor) ||
    stepType === StepType.branching
  ) {
    return implicitCtas;
  }

  if (isModalGuide(guideFormFactor)) {
    return concatImplicitCtas(implicitCtas, [
      {
        text: getDefaultTextForCtaType({
          type: StepCtaType.save,
          ...commonTextArgs,
        }),
        type: StepCtaType.save,
        style: getDefaultStyleForCtaType({
          type: StepCtaType.save,
          guideFormFactor,
        }),
        settings,
      },
      {
        text: getDefaultTextForCtaType({
          type: StepCtaType.complete,
          ...commonTextArgs,
        }),
        type: StepCtaType.complete,
        style: getDefaultStyleForCtaType({
          type: StepCtaType.complete,
          guideFormFactor,
        }),
        settings,
      },
    ]);
  }

  if (isTooltipGuide(guideFormFactor) || isFlowGuide(guideFormFactor)) {
    return concatImplicitCtas(implicitCtas, [
      {
        text: getDefaultTextForCtaType({
          type: StepCtaType.complete,
          ...commonTextArgs,
        }),
        type: StepCtaType.complete,
        style: getDefaultStyleForCtaType({
          type: StepCtaType.complete,
          guideFormFactor,
        }),
        settings,
      },
    ]);
  }

  if (isCard) {
    return concatImplicitCtas(implicitCtas, [
      {
        text: DefaultStepCtaText.tryIt,
        type: StepCtaType.complete,
        style: StepCtaStyle.solid,
        settings,
      },
    ]);
  }

  switch (stepType) {
    case StepType.optional:
    case StepType.branchingOptional:
      return concatImplicitCtas(implicitCtas, [
        {
          text: getDefaultTextForCtaType({
            type: StepCtaType.complete,
            ...commonTextArgs,
          }),
          type: StepCtaType.complete,
          style: getDefaultStyleForCtaType({
            type: StepCtaType.complete,
            guideFormFactor,
          }),
          settings,
        },
        {
          text: getDefaultTextForCtaType({
            type: StepCtaType.skip,
            ...commonTextArgs,
          }),
          type: StepCtaType.skip,
          style: getDefaultStyleForCtaType({
            type: StepCtaType.skip,
            guideFormFactor,
          }),
          settings,
        },
      ]);

    case StepType.fyi:
      return concatImplicitCtas(implicitCtas, [
        {
          text: getDefaultTextForCtaType({
            type: StepCtaType.complete,
            ...commonTextArgs,
          }),
          type: StepCtaType.complete,
          style: getDefaultStyleForCtaType({
            type: StepCtaType.complete,
            guideFormFactor,
          }),
          settings,
        },
      ]);

    case StepType.input:
      return implicitCtas;

    default:
      return concatImplicitCtas(implicitCtas, [
        {
          text: getDefaultTextForCtaType({
            type: StepCtaType.complete,
            ...commonTextArgs,
          }),
          type: StepCtaType.complete,
          style: getDefaultStyleForCtaType({
            type: StepCtaType.complete,
            guideFormFactor,
          }),
          settings,
        },
        {
          text: getDefaultTextForCtaType({
            type: StepCtaType.skip,
            ...commonTextArgs,
          }),
          type: StepCtaType.skip,
          style: getDefaultStyleForCtaType({
            type: StepCtaType.skip,
            guideFormFactor,
          }),
          settings,
        },
      ]);
  }
};

/**
 * Default CTAs for branching.
 *
 * Consolidate with 'getDefaultStepCtas' if CTA is added to miso.
 */
export const getDefaultBranchingCtas = (): DefaultStepCta[] => [
  {
    text: 'Continue',
    type: StepCtaType.complete,
    style: StepCtaStyle.solid,
    settings: getDefaultCtaSetting(null),
  },
];

export const hasOnlyDefaultCtas = (
  ctas: CtaInput[],
  stepType: StepType | undefined,
  guideFormFactor: GuideFormFactor | undefined,
  theme: Theme | undefined
): boolean => {
  const sanitizedCtas = ctas.filter((cta) => !cta.settings?.implicit);
  const defaults = getDefaultStepCtas({
    stepType,
    branchingMultiple: undefined,
    branchingType: undefined,
    guideFormFactor,
    theme,
  });

  return (
    sanitizedCtas.length === defaults.length &&
    defaults.every((expected, i) =>
      isEqual(
        expected,
        pick(sanitizedCtas[i], Object.keys(expected) as (keyof CtaInput)[])
      )
    )
  );
};

export const getDefaultCtaSetting = (
  guideFormFactor?: GuideFormFactor | null
): StepCtaSettings => {
  if (isBannerGuide(guideFormFactor) || isTooltipGuide(guideFormFactor))
    return {
      bgColorField: CtaColorFields.guideTextColor,
      textColorField: CtaColorFields.guideBackgroundColor,
      eventName: CTA_DEFAULT_EVENT_NAME,
      markComplete: false,
      opensInNewTab: false,
    };

  return {
    bgColorField: CtaColorFields.primaryColorHex,
    textColorField: CtaColorFields.white,
    eventName: CTA_DEFAULT_EVENT_NAME,
    markComplete: false,
    opensInNewTab: false,
  };
};

export const ctaColorFieldToHexValue = (
  uiSettings:
    | AtLeast<
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
  colorField: string | undefined,
  /** Mainly used in the admin UI since it can't tell colors that the embed will inherit. */
  undefinedFallback?: Partial<Record<CtaColorFields | 'default', string>>,
  colorFieldFallback?: CtaColorFields
) => {
  const result: {
    value: string | undefined;
    /** Wether the color is being inherited. */
    isFallback: boolean;
  } = {
    value: '',
    isFallback: false,
  };

  const [, additionalColorIndex] =
    colorField?.split(additionalColorOptionPrefix) || [];

  if (!Number.isNaN(Number(additionalColorIndex))) {
    const newValue =
      uiSettings?.additionalColors?.[additionalColorIndex]?.value;

    if (!newValue && colorFieldFallback) {
      // Re attempt converting color field to hex value.
      return ctaColorFieldToHexValue(
        uiSettings,
        formFactorStyle,
        guideFormFactor,
        colorFieldFallback,
        undefinedFallback,
        undefined
      );
    }
    result.value = newValue;
  } else {
    switch (colorField as CtaColorFields) {
      case CtaColorFields.primaryColorHex:
        result.value = uiSettings?.primaryColorHex;
        break;
      case CtaColorFields.secondaryColorHex:
        result.value = uiSettings?.secondaryColorHex;
        break;
      case CtaColorFields.guideBackgroundColor:
        result.value = formFactorStyle?.backgroundColor;
        if (!result.value) {
          result.value =
            uiSettings?.primaryColorHex ||
            undefinedFallback?.guideBackgroundColor;
          result.isFallback = true;
        }
        break;
      case CtaColorFields.guideTextColor:
        result.value = formFactorStyle?.textColor;
        if (!result.value) {
          if (isBannerGuide(guideFormFactor)) result.value = '#FFFFFF';
          else {
            result.value =
              uiSettings?.fontColorHex || undefinedFallback?.guideTextColor;
            result.isFallback = true;
          }
        }
        break;
      case CtaColorFields.white:
        result.value = '#FFFFFF';
        break;
      default:
        result.value = undefinedFallback?.default;
        break;
    }
  }

  return result;
};

/** Get the hex color values that a CTA will use. */
export const parseCtaColors = (
  cta: StepCTA,
  formFactor: GuideFormFactor,
  formFactorStyle: FormFactorStyle | undefined,
  uiSettings: Pick<
    BentoUI,
    | 'primaryColorHex'
    | 'secondaryColorHex'
    | 'fontColorHex'
    | 'additionalColors'
  >
): { background: string | undefined; color: string | undefined } => {
  const colorKeys: {
    settingKey: keyof StepCtaSettings;
    resultKey: keyof ReturnType<typeof parseCtaColors>;
  }[] = [
    { settingKey: 'bgColorField', resultKey: 'background' },
    { settingKey: 'textColorField', resultKey: 'color' },
  ];

  const defaultSettings = getDefaultCtaSetting(formFactor);

  return colorKeys.reduce((acc, color) => {
    acc[color.resultKey] = ctaColorFieldToHexValue(
      uiSettings,
      formFactorStyle as CardStyle | TooltipStyle | BannerStyle,
      formFactor,
      cta.settings?.[color.settingKey] as CtaColorFields,
      undefined,
      defaultSettings[color.settingKey] as CtaColorFields
    ).value;
    return acc;
  }, {} as ReturnType<typeof parseCtaColors>);
};

/** Determine if it's a CTA that results in step completion */
export const isCtaCompletionAction = (
  type: StepCtaType,
  formFactor: GuideFormFactor
) => {
  switch (type) {
    case StepCtaType.skip:
    case StepCtaType.save:
      return false;
    case StepCtaType.url:
      if (
        isTooltipGuide(formFactor) ||
        isFlowGuide(formFactor) ||
        isAnnouncementGuide(formFactor)
      )
        return true;
      else return false;
    case StepCtaType.urlComplete:
    default:
      return true;
  }
};

export const getImplicitAllowedStepCtaTypes = ({
  stepType,
  branchingMultiple,
  branchingType,
}) => {
  if (
    isInputStep(stepType) ||
    (isBranchingStep(stepType) &&
      branchingMultiple &&
      branchingType === BranchingEntityType.Module)
  ) {
    return [StepCtaType.complete];
  }

  return [];
};

export const getAllowedStepCtaTypes = ({
  stepType,
  branchingMultiple,
  branchingType,
  guideFormFactor,
  theme,
}: {
  stepType: StepType | undefined;
  branchingMultiple: boolean | undefined;
  branchingType: BranchingEntityType | undefined;
  guideFormFactor: GuideFormFactor | undefined;
  theme?: Theme;
}): StepCtaType[] => {
  const { isCarousel, isNested } = getGuideThemeFlags(theme);
  const navigationCtas =
    (isInlineOrSidebarGuide(guideFormFactor) ||
      isInlineGuide(guideFormFactor) ||
      isSidebarGuide(guideFormFactor)) &&
    (isCarousel || isNested)
      ? [StepCtaType.back, StepCtaType.next]
      : [];
  const implicitAllowedTypes = getImplicitAllowedStepCtaTypes({
    stepType,
    branchingMultiple,
    branchingType,
  });

  if (isFlowGuide(guideFormFactor)) {
    return uniqueConcat(implicitAllowedTypes, [
      StepCtaType.complete,
      StepCtaType.url,
      StepCtaType.urlComplete,
    ]);
  }

  if (isModalGuide(guideFormFactor)) {
    return uniqueConcat(implicitAllowedTypes, [
      StepCtaType.save,
      StepCtaType.complete,
      StepCtaType.url,
      StepCtaType.urlComplete,
      StepCtaType.launch,
      StepCtaType.event,
    ]);
  }

  if (isBannerGuide(guideFormFactor)) {
    return uniqueConcat(implicitAllowedTypes, [
      StepCtaType.complete,
      StepCtaType.url,
      StepCtaType.urlComplete,
      StepCtaType.launch,
      StepCtaType.event,
    ]);
  }

  if (isBranchingStep(stepType)) {
    return uniqueConcat(implicitAllowedTypes, navigationCtas);
  }

  if (stepType === StepType.fyi) {
    return uniqueConcat(implicitAllowedTypes, [
      StepCtaType.complete,
      StepCtaType.url,
      StepCtaType.urlComplete,
      StepCtaType.launch,
      StepCtaType.event,
      ...navigationCtas,
    ]);
  }

  if (isCarousel)
    return uniqueConcat(
      implicitAllowedTypes,
      [...Object.values(StepCtaType), StepCtaType.launch].filter(
        (type) =>
          type !== StepCtaType.save &&
          type !== StepCtaType.skip &&
          type !== StepCtaType.complete
      )
    );

  if (isNested)
    return uniqueConcat(
      implicitAllowedTypes,
      [...Object.values(StepCtaType), StepCtaType.launch].filter(
        (type) => type !== StepCtaType.save
      )
    );

  return uniqueConcat(
    implicitAllowedTypes,
    [...Object.values(StepCtaType), StepCtaType.launch].filter(
      (type) =>
        type !== StepCtaType.save &&
        type !== StepCtaType.back &&
        type !== StepCtaType.next
    )
  );
};

export const duplicateName = (name: string | undefined | null) =>
  name ? `${name} (Copy)` : '';

/** Max number of guides we allow when resetting */
export const MAX_GUIDE_RESET = 50;

export const isBentoEvent = (eventName: string | null | undefined): boolean =>
  eventName === BentoEvents.account || eventName === BentoEvents.user;

export const massageStepInputSettings = (
  inputType: StepInputFieldType | undefined | null,
  settings: StepInputFieldSettings | undefined | null
) => {
  switch (inputType) {
    case StepInputFieldType.text:
      return {
        ...(settings || {}),
        maxValue: 100,
      };
    case StepInputFieldType.email:
      return {
        ...(settings || {}),
        maxValue: 320,
      };
    case StepInputFieldType.paragraph:
      return {
        ...(settings || {}),
        maxValue: 1000,
      };
    case StepInputFieldType.nps:
      return {
        ...(settings || {}),
        minLabel: 'Less likely',
        maxLabel: 'More likely',
        minValue: 0,
        maxValue: 10,
      };

    default:
      return { ...(settings || {}) };
  }
};

/** Determine if object has a key, even if it is undefined. */
export const hasKey = (obj: object, key: string) =>
  typeof obj === 'object' && key in obj;

export const isBox = (type: StepSeparationType | undefined) => {
  return type === StepSeparationType.box;
};

export const isBorder = (type: StepSeparationType | undefined) => {
  return type === StepSeparationType.border;
};

type StepSeparationFlags = {
  isBordered: boolean;
  isBoxed: boolean;
};

export const getStepSeparationFlags = (
  type: StepSeparationType | undefined
) => {
  return Object.fromEntries(
    $enum(StepSeparationType)
      .getEntries()
      .map(([k, v]) => [`is${capitalizeFirstLetter(k)}ed`, v === type])
  ) as StepSeparationFlags;
};

type SidebarVisibilityFlags = {
  isShow: boolean;
  isActiveGuides: boolean;
  isActiveOnboardingGuides: boolean;
  isHide: boolean;
};

/**
 * Best used when combinations of flags need to be assessed.
 */
export const getSidebarVisibilityFlags = (
  type: SidebarVisibility | undefined
) => {
  return Object.fromEntries(
    $enum(SidebarVisibility)
      .getEntries()
      .map(([k, v]) => [`is${capitalizeFirstLetter(k)}`, v === type])
  ) as SidebarVisibilityFlags;
};

export const maxAdditionalColors = 3;

export const additionalColorOptionPrefix = 'orgAdditionalColor';

export const isBranchingTypeSupported = ({
  entityType,
  theme,
  isCyoa,
}: {
  entityType: BranchingEntityType;
  theme: Theme | undefined;
  isCyoa: boolean | undefined;
}) => {
  switch (entityType) {
    case BranchingEntityType.Module: {
      return !isCyoa;
    }
    case BranchingEntityType.Guide:
    case BranchingEntityType.Template: {
      return !isCarouselTheme(theme);
    }

    default: {
      return true;
    }
  }
};

/**
 * Determines guide that are allowed per formFactor based
 * on various settings.
 * Sidebar reference: https://docs.google.com/spreadsheets/d/12_Q4PXdznohQzqcYN4JeHInoXx-Ud5M3pq5eZ7otAb8/edit#gid=1348331741.
 */
export const allowedGuideTypesSettings = (
  sidebarVisibility: SidebarVisibility | undefined,
  formFactor: FormFactorStateKey | undefined
): {
  /** Saved for later guides are always allowed. */
  none: boolean;
  activeOnboarding: boolean;
  completed: boolean;
  everboarding: boolean;
  cyoa: boolean;
} => {
  if (!isSidebarEmbed(formFactor!))
    return {
      none: false,
      activeOnboarding: true,
      completed: true,
      everboarding: true,
      cyoa: true,
    };

  const _sidebarVisibility = sidebarVisibility || SidebarVisibility.show;

  const { isShow, isHide, isActiveGuides } =
    getSidebarVisibilityFlags(_sidebarVisibility);

  return {
    none: isHide,
    activeOnboarding: !isHide,
    completed: isShow,
    everboarding: isShow || isActiveGuides,
    cyoa: !isHide,
  };
};

export const guideListConfig: Record<
  GuidesListEnum,
  {
    view: View;
    key: keyof Pick<
      AllGuidesStyle,
      | 'allGuidesTitle'
      | 'activeGuidesTitle'
      | 'previousGuidesTitle'
      | 'previousAnnouncementsTitle'
    >;
  }
> = {
  [GuidesListEnum.all]: { view: View.activeGuides, key: 'allGuidesTitle' },
  [GuidesListEnum.onboarding]: {
    view: View.allOnboardingGuides,
    key: 'activeGuidesTitle',
  },
  [GuidesListEnum.previousOnboarding]: {
    view: View.previousOnboardingGuides,
    key: 'previousGuidesTitle',
  },
  [GuidesListEnum.previousAnnouncement]: {
    view: View.previousAnnouncements,
    key: 'previousAnnouncementsTitle',
  },
};

export const viewToGuideListMap: Partial<Record<View, GuidesListEnum>> =
  Object.entries(guideListConfig).reduce((acc, [k, v]) => {
    acc[v.view] = k;
    return acc;
  }, {});

/* Examples:
 * - For an account variable:
 *   {{account:name}}
 *
 * - For a user variable:
 *   {{user:fullName}}
 */
export const DYNAMIC_ATTRIBUTE_REGEX = /{{([\s\S]+?)}}/g;

export const interpolateAttributes = (
  uncastContent: string | any,
  attributes: DynamicAttributes,
  defaultIfNoMatch?: string
): string | any => {
  if (typeof uncastContent === 'string') {
    return uncastContent.replace(DYNAMIC_ATTRIBUTE_REGEX, (_, token) =>
      attributes[token]
        ? `${attributes[token]}`
        : isNil(defaultIfNoMatch)
        ? token
        : defaultIfNoMatch
    );
  }
  return uncastContent;
};

export const extractAttributesInString = (str: string): string[] => {
  return typeof str === 'string'
    ? (str.match(DYNAMIC_ATTRIBUTE_REGEX) as any as string[]) || []
    : [];
};

/**
 * Replaces dynamic attributes in URLs
 * with "any" wildcards in order to allow previews
 * to show correctly in pages that match the format.
 */
export const sanitizeAttributesForPreview = (
  url: string | undefined
): string | undefined => {
  if (typeof url !== 'string') return url;
  const result = url.replace(DYNAMIC_ATTRIBUTE_REGEX, '[^/]+');
  return result;
};

export const sanitizeAttributesAndExtract = (
  url: string | undefined
): [string | undefined, string[]] => {
  if (typeof url !== 'string') return [url, []];
  const attrsFound: string[] = [];

  const result = url.replace(DYNAMIC_ATTRIBUTE_REGEX, (_, token) => {
    attrsFound.push(token);
    return '[^/]+';
  });

  return [result, attrsFound];
};

/**
 * Check if the rule type is of relative date targeting
 *
 * Important because even though the attribute value will be of "date" type, the data point
 *   we compare against will be a number, e.g. "3 days ago"
 */
export const isRelativeDateTargeting = (ruleType: RuleTypeEnum) =>
  ruleType === RuleTypeEnum.relativeExactly ||
  ruleType === RuleTypeEnum.relativeMoreThan ||
  ruleType === RuleTypeEnum.relativeLessThan;

export const isStringSearchTargeting = (ruleType: RuleTypeEnum) =>
  ruleType === RuleTypeEnum.stringContains ||
  ruleType === RuleTypeEnum.stringDoesNotContain;

export const isStringArrayTargeting = (ruleType: RuleTypeEnum) =>
  [
    RuleTypeEnum.all,
    RuleTypeEnum.any,
    RuleTypeEnum.none,
    RuleTypeEnum.only,
  ].includes(ruleType);

export const isEmptyCheckTargeting = (ruleType: RuleTypeEnum) =>
  [RuleTypeEnum.isEmpty, RuleTypeEnum.isNotEmpty].includes(ruleType);

export const sortFinishedGuides = (asc: boolean) => (g1: Guide, g2: Guide) => {
  const date1 = (g1.completedAt || g1.doneAt)?.getTime() || 0;
  const date2 = (g2.completedAt || g2.doneAt)?.getTime() || 0;
  return asc ? date1 - date2 : date2 - date1;
};

export const getCompatibleThemes = (theme: Theme): Theme[] => {
  const onboarding = [Theme.nested, Theme.flat, Theme.compact, Theme.timeline];
  if (onboarding.includes(theme)) return onboarding;
  return [];
};

/**
 * Remove templates that don't form
 * part of the priority ranking sequence
 *
 * formFactor should be GuideForFactor, but in most cases this will be used with
 *   relay version which cause typing errors
 */
export const isTemplateRankable = (
  templateLike: AtLeast<{ formFactor?: string }, 'formFactor'>
) => templateLike.formFactor !== GuideFormFactor.inline;

export const getButtonClickUrlTarget = (
  url: string | undefined | null,
  host: string
): '_blank' | '_self' => {
  if (
    url &&
    ((url.includes('http') && !url.includes(host)) || url.includes('mailto'))
  ) {
    return '_blank';
  }
  return '_self';
};

export interface VideoUrls {
  video: string;
  thumbnail: string;
}

export const videoTypeToSource = (videoType: string | undefined | null) =>
  (videoType || '').replace('-video', '') as VideoSourceType;

/**
 * Get the video and thumbnail URLs
 * for various video platforms.
 */
export const getVideoUrls = async (
  videoId: string,
  source: VideoSourceType,
  /** Needed for server */
  customFetch?: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>
): Promise<VideoUrls> => {
  const isClient = typeof window === 'object';
  if (!isClient && !customFetch) {
    console.warn('[BENTO] (getVideoUrls) fetch method not supported');
    return {
      video: '',
      thumbnail: '',
    };
  }

  const _fetch = customFetch || fetch;

  switch (source) {
    case 'youtube':
      return {
        video: `https://www.youtube.com/embed/${videoId}`,
        thumbnail: `http://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      };

    /**
     * Using oembed mechanism from their library.
     * See https://cdn.loom.com/loom-embed/v1.0.4/index.html
     * for more details.
     */
    case 'loom': {
      let thumbnail = '';
      try {
        const response = await (
          await _fetch(
            `https://www.loom.com/v1/oembed?url=https://www.loom.com/share/${videoId}`
          )
        ).json();
        thumbnail = response.thumbnail_url;
      } catch (e) {
        console.debug(
          `[BENTO] (getVideoUrls) Loom video ID not found: ${videoId}`,
          e
        );
      }
      return {
        video: `https://www.loom.com/embed/${videoId}`,
        thumbnail,
      };
    }

    case 'vidyard':
      return {
        video: `https://play.vidyard.com/${videoId}`,
        thumbnail: `https://play.vidyard.com/${videoId}.jpg`,
      };

    case 'wistia':
      return {
        video: `https://fast.wistia.net/embed/iframe/${videoId}`,
        thumbnail: `https://fast.wistia.net/embed/medias/${videoId}/swatch`,
      };

    case 'vimeo': {
      let thumbnail = '';
      try {
        const response = await (
          await _fetch(
            `https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/${videoId}&width=480&height=360`
          )
        ).json();
        thumbnail = response.thumbnail_url;
      } catch (e) {
        console.debug(
          `[BENTO] (getVideoUrls) Vimeo video ID not found: ${videoId}`,
          e
        );
      }
      return {
        video: `https://player.vimeo.com/video/${videoId}`,
        thumbnail,
      };
    }

    default: {
      console.debug(
        `[BENTO] (getVideoUrls) Video source ${source} not implemented`
      );
      return {
        video: '',
        thumbnail: '',
      };
    }
  }
};

export const getPercentage = (
  numerator: number,
  denominator: number,
  options?: { decimals?: number; fallback?: string }
): string => {
  const result = (numerator / denominator) * 100;
  return Number.isFinite(result)
    ? result
      ? `${result.toFixed(options?.decimals ?? 1)}%`
      : '0%'
    : options?.fallback ?? '-';
};

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  [MediaType.image]: 'Image/gif',
  [MediaType.video]: 'Video',
  [MediaType.numberAttribute]: 'Dynamic attribute: number',
};

export const mediatypeOptions = $enum(MediaType)
  .getValues()
  .map((t) => ({ label: MEDIA_TYPE_LABELS[t], value: t }));

export const getMaxMediaAllowed = (formFactor: GuideFormFactor | undefined) => {
  switch (formFactor) {
    default:
      return 1;
  }
};

export const verticalAlignmentOptions = $enum(VerticalAlignmentEnum)
  .getValues()
  .map((v) => ({ label: capitalizeFirstLetter(v), value: v }));

export const horizontalAlignmentOptions = $enum(AlignmentEnum)
  .getValues()
  .map((v) => ({ label: capitalizeFirstLetter(v), value: v }));

export const getParsedFormFactorStyle = (ffs: FormFactorStyle | undefined) =>
  ffs
    ? {
        cardFormFactorStyle: ffs as CardStyle,
        tooltipFormFactorStyle: ffs as TooltipStyle,
        bannerFormFactorStyle: ffs as BannerStyle,
        checklistFormFactorStyle: ffs as ChecklistStyle,
        modalFormFactorStyle: ffs as ModalStyle,
        videoGalleryFormFactorStyle: ffs as VideoGalleryStyle,
        carouselFormFactorStyle: ffs as CarouselStyle,
        orientableFormFactorStyle: ffs as OrientableFormFactorStyle,
      }
    : {};

export const getParsedMediaSettings = (
  settings: MediaReferenceSettings | undefined
) =>
  settings
    ? {
        imageSettings: settings as ImageMediaReferenceSettings,
        videoSettings: settings as VideoMediaReferenceSettings,
        numberAttributeSettings:
          settings as NumberAttributeMediaReferenceSettings,
      }
    : {};

export const getParsedMediaMeta = (meta: MediaMeta | undefined) =>
  meta
    ? {
        imageMeta: meta as ImageMediaMeta,
        videoMeta: meta as VideoMediaMeta,
        numberAttributeMeta: meta as NumberAttributeMediaMeta,
      }
    : {};

export const formatChoiceKey = (label: string | null | undefined): string => {
  return label
    ? label
        .replace(/\s/g, '_')
        .replace(/[^a-zA-Z0-9_.-]/g, '')
        .toLowerCase()
    : '';
};

export const slugify = (name: string): string => {
  return name.toLocaleLowerCase().replace(/\s/g, '-').replace(/[^\w]/gi, '');
};

export const zendeskPreviewFlag = {
  get: () => {
    return !!(window as any).previewZendeskChat as boolean;
  },
  set: (value: boolean) => {
    (window as any).previewZendeskChat = value;
  },
};

export const ContextTagDimensionsByType: ContextTagTypeDimensionsType = {
  dot: { width: 16, height: 16, padding: 0 },
  icon: { width: 32, height: 32, padding: 0 },
  badge: { width: 44, height: 24, padding: 7 },
  badge_dot: { width: 54, height: 24, padding: 7 },
  badge_icon: { width: 56, height: 24, padding: 7 },
  highlight: { width: 0, height: 0, padding: 0 },
};

export const noopCbWrapper = (cb: (...args: any[]) => void) => cb;

export const showResourceCenterInline = (
  inlineBehavior: InlineEmptyBehaviour
) => inlineBehavior !== InlineEmptyBehaviour.hide;

export const isPageTargetedTypeFactory =
  (type: GuidePageTargetingType) =>
  (
    guide?: AtLeast<Guide | FullGuide, 'pageTargeting' | 'pageTargetingType'>
  ) => {
    return (guide?.pageTargeting?.type ?? guide?.pageTargetingType) === type;
  };

export const isPageTargetedGuide = isPageTargetedTypeFactory(
  GuidePageTargetingType.specificPage
);
export const isVisualTagTargetedGuide = isPageTargetedTypeFactory(
  GuidePageTargetingType.visualTag
);
export const isInlineTargetedGuide = isPageTargetedTypeFactory(
  GuidePageTargetingType.inline
);
export const isAnyPageTargetedGuide = isPageTargetedTypeFactory(
  GuidePageTargetingType.anyPage
);

const isDesignTypeFactory =
  (guideDesignType: GuideDesignType) =>
  (designType: GuideDesignType | null | undefined): boolean =>
    designType === guideDesignType;

export const isAnnouncement = isDesignTypeFactory(GuideDesignType.announcement);
export const isOnboarding = isDesignTypeFactory(GuideDesignType.onboarding);
export const isEverboarding = isDesignTypeFactory(GuideDesignType.everboarding);

/**
 * Used for mapping template properties to categories displayed in UI
 */
export const getComponentType = ({
  designType,
  formFactor,
  theme,
  isCyoa,
  type,
}: GuideShape): ComponentType => {
  if (isCyoa) return ComponentType.cyoa;
  if (isSplitTestGuide(type)) return ComponentType.splitTest;
  if (isBannerGuide(formFactor)) return ComponentType.banner;
  if (isModalGuide(formFactor)) return ComponentType.modal;
  if (formFactor === GuideFormFactor.tooltip) return ComponentType.tooltip;
  if (formFactor === GuideFormFactor.flow) return ComponentType.flow;
  if (theme === Theme.card) return ComponentType.card;
  if (theme === Theme.carousel) return ComponentType.carousel;
  if (theme === Theme.videoGallery) return ComponentType.videoGallery;
  if (designType === GuideDesignType.everboarding)
    return ComponentType.contextual;

  return ComponentType.onboarding;
};

const npsSurveyStateRankingOrder: NpsSurveyState[] = [
  NpsSurveyState.live,
  NpsSurveyState.draft,
  NpsSurveyState.stopped,
];

export const npsSurveyStateRankings = npsSurveyStateRankingOrder.reduce(
  (acc, state, i) => {
    acc[state] = npsSurveyStateRankingOrder.length - i - 1;
    return acc;
  },
  {} as Record<NpsSurveyState, number>
);

const splitTestStateRankingOrder: SplitTestState[] = [
  SplitTestState.live,
  SplitTestState.draft,
  SplitTestState.stopped,
];

export const splitTestStateRankings = splitTestStateRankingOrder.reduce(
  (acc, state, i) => {
    acc[state] = splitTestStateRankingOrder.length - i - 1;
    return acc;
  },
  {} as Record<SplitTestState, number>
);

/**
 * Determines whether a tag should be considered intrusive.
 * @todo unit test
 */
export const isIntrusiveTag = (
  tag: TaggedElement,
  guide: Guide | undefined
) => {
  return (
    // tag is of overlay type
    tag.style?.type === VisualTagHighlightType.overlay ||
    // or tag belongs to a flow/tooltip and is set to show on page load
    ((isTooltipGuide(tag.formFactor) || isFlowGuide(tag.formFactor)) &&
      (guide?.formFactorStyle as TooltipStyle)?.tooltipShowOn ===
        TooltipShowOn.load)
  );
};
