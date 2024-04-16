import {
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideState,
  GuideTypeEnum,
  Theme,
  FormFactorStyle,
  AtLeast,
  EmbedFormFactor,
  InternalTrackEvents,
  ActionPayloads,
  ActionNames,
  AttributeType,
  AttributeValueType,
  BranchingEntityType,
  StepCtaType,
  StepCtaStyle,
  StepAutoCompleteInteractionType,
  StepType,
  StepInputFieldType,
  StepInputFieldSettings,
  VisualTagStyleSettings,
  InjectionPosition,
  withFormFactorStyle,
  ModalStyle,
  TooltipStyle,
  BannerStyle,
  BranchingStyle,
  InjectionAlignment,
  CardStyle,
  ChecklistStyle,
  StepCtaSettings,
  GuideCompletionState,
} from '../types';
import { KbArticle } from './integrations';
import { Media, MediaReferenceSettings } from './media';
import {
  NpsFollowUpQuestionType,
  NpsFormFactor,
  NpsSurveyPageTargeting,
} from './netPromoterScore';
import { WithTypename } from './utils';
import { noopCbWrapper } from '../data/helpers';

/**
 * WARNING:
 * You should update the schema processors whenever a new Date
 * field is added/removed within the types below, as well
 * as the store's persistence deserialization method.
 *
 * @file apps/shoyu/src/stores/mainStore/schema.ts
 * @file apps/shoyu/src/stores/mainStore/index.ts
 */

/**
 * Determines the known list of typenames in use within the embed,
 * allowing us to rely on the `__typename` properties to differentiate between
 * different types of objects.
 *
 * @todo add remaining typenames
 */
export enum EmbedTypenames {
  guide = 'EmbedGuide',
  npsSurvey = 'EmbedNpsSurvey',
}

export type EmbedTypenamesToType = {
  [EmbedTypenames.guide]: Guide | FullGuide;
  [EmbedTypenames.npsSurvey]: NpsSurvey;
};

/** string alone is for miso transformers support */
type EntityId<T extends string> = (string & { __type: T }) | string;

export type Organization = {
  name: string;
  domain: string;
  entityId: string;
  onboardingUrlPath?: string | null;
  enabledFeatureFlags?: string[] | null;
};

export type Account = {
  id: string;
  name: string;
};

export type AccountUser = {
  entityId: string;
  id: string;
  fullName?: string | null;
  email?: string | null;
};

export type GuideBaseEntityId = EntityId<'guideBase'>;
export type GuideBase = {
  entityId: GuideBaseEntityId;
};

export enum GuideHydrationState {
  hydrating = 'hydrating',
  hydrated = 'hydrated',
  failed = 'failed',
}

export type GuidePageTargeting = {
  type: GuidePageTargetingType;
  url?: string | null;
};
export type GuideEntityId = EntityId<'guide'>;
export type Guide = WithTypename<
  {
    entityId: GuideEntityId;
    name: string;
    /** @deprecated use `name` instead */
    displayTitle?: string;
    description?: string | null;
    type: GuideTypeEnum;
    theme: Theme;
    isSideQuest: boolean;
    isCyoa: boolean;
    canResetOnboarding: boolean;
    branchedFromGuide?: GuideEntityId;
    branchedFromChoice?: {
      choiceKey?: BranchingChoiceKey;
      branchingKey?: BranchingKey;
    };
    formFactor: GuideFormFactor;
    formFactorStyle?: FormFactorStyle;
    designType: GuideDesignType;
    state?: GuideState;

    completionState?: GuideCompletionState;
    /** @deprecated use completionState instead */
    isComplete: boolean;
    /** @deprecated use completionState instead */
    isDone: boolean;
    isViewed: boolean;
    /** Whether this guide was launched from another */
    isDestination: boolean;
    completedAt?: Date;
    doneAt?: Date;
    savedAt?: Date;
    completedStepsCount: number;
    totalSteps: number;
    firstIncompleteModule: ModuleEntityId | undefined;
    firstIncompleteStep: StepEntityId | undefined;
    pageTargeting?: GuidePageTargeting;
    nextGuide?: GuideEntityId | null;
    previousGuide?: GuideEntityId | null;
    /** The order this guide was launched to the user, starting at 0. */
    orderIndex: number;
    /** Tagged elements associated with this guide or any of its steps */
    taggedElements: TaggedElementEntityId[];

    // these wouldn't be included if we haven't yet fetched the full nested structure
    // of the guide yet either because this guide hasn't been selected/activated yet
    // or it's a branch from some other branching step
    modules?: ModuleEntityId[];
    steps?: StepEntityId[]; // flattened ordered list of steps in the guide
    /** indicates if the guide have recently become available */
    isNew?: boolean;
    /** Whether this is a preview */
    isPreview?: boolean;
    hydrationState?: GuideHydrationState;

    // used for guides loaded event
    guideBase?: GuideBase;
    stepsByState?: Record<StepState | 'viewed', Pick<Step, 'name'>[]>;
    // used for available guides card info
    stepsInfo?: Pick<Step, 'name' | 'bodySlate'>[];
    /** @deprecated please use `pageTargeting` instead  */
    pageTargetingType: GuidePageTargetingType;
    /** @deprecated please use `pageTargeting` instead  */
    pageTargetingUrl: string | null;
  },
  EmbedTypenames.guide
>;

export type ModalGuide = withFormFactorStyle<Guide, ModalStyle>;
export type BannerGuide = withFormFactorStyle<Guide, BannerStyle>;
export type TooltipGuide = withFormFactorStyle<Guide, TooltipStyle>;
export type CardGuide = withFormFactorStyle<Guide, CardStyle>;
export type ChecklistGuide = withFormFactorStyle<Guide, ChecklistStyle>;

export type FullGuide = Omit<Guide, 'modules' | 'steps' | 'taggedElements'> & {
  modules: FullModule[];
  steps: Step[];
  taggedElements: TaggedElement[];
  designType?: GuideDesignType;
};

export type ModuleEntityId = EntityId<'module'>;
export type Module = {
  entityId: ModuleEntityId;
  name: string;
  // these may be undefined if this is a prefetched module for a branching step
  guide?: GuideEntityId;
  steps?: StepEntityId[];
  nextModule?: ModuleEntityId;
  previousModule?: ModuleEntityId;
  orderIndex: number;
  totalStepsCount: number;
  completedStepsCount: number;
  isComplete: boolean;
  firstIncompleteStep?: StepEntityId;
  /** Whether this is a preview instance */
  isPreview?: boolean;
  isNew?: boolean;
};

export type FullModule = Omit<Module, 'steps'> & { steps: Step[] };

export enum BranchingFormFactor {
  dropdown = 'dropdown',
  cards = 'cards',
}

/** Target data associated to the branch */
export type BranchingTargetData = {
  name: string | undefined;
  /** Branches set to no target should be undefined. */
  entityId: GuideEntityId | ModuleEntityId | undefined;
  type: BranchingEntityType | undefined;
  completedAt?: Date;
};

export type BranchingChoiceKey = EntityId<'branching choice'>;
export type BranchingChoice = {
  /** The key for this branch. */
  key: BranchingChoiceKey;
  /** The label for this branch. */
  label: string;
  /** Indicates if this branch is currently selected. */
  selected: boolean;
  /** Style according to form factor */
  style: BranchingStyle;
  /** Target data associated to the branch */
  targetData?: BranchingTargetData;
};

export type BranchingKey = EntityId<'branching'>;
export type BranchingData = {
  key: BranchingKey; // formerly step.branchingKey
  type: BranchingEntityType;
  question: string; // formerly step.branchingQuestion
  multiSelect: boolean; // formerly step.branchingMultiple
  dismissDisabled: boolean; // step.branchingDismissDisabled
  formFactor: BranchingFormFactor; // formerly step.branchingFormFactor
  branches: BranchingChoice[]; // somewhat formerly step.branchingChoices
};

export type StepInputEntityId = EntityId<'step input'>;
export type StepInput = {
  entityId: StepInputEntityId;
  label: string;
  type: StepInputFieldType;
  answer: string | null;
  settings: StepInputFieldSettings | null;
};

export type StepInputAnswer = {
  /** The input step base entity id */
  entityId: string;
  /** The actual answer for the input, if any */
  answer?: string | null;
};

/**
 * Currently, this actually maps to a template entityId,
 * but I'm calling it as a "destination" for now, and this
 * will be diferrent
 */
export type DestinationKey = EntityId<'destination'>;

export type StepCTADestination = {
  key: DestinationKey;
  designType: GuideDesignType;
  formFactor: GuideFormFactor;
  pageTargeting: GuidePageTargeting;
};

export type StepCTAEntityId = EntityId<'stepCTA'>;
export type StepCTA = {
  entityId?: StepCTAEntityId;
  text: string;
  type: StepCtaType;
  style: StepCtaStyle;
  settings?: StepCtaSettings;
  // TODO: Deprecate 'label'
  label?: string;
  url?: string;
  destination?: StepCTADestination;
  eventMessage?: string;
  collapseSidebar?: boolean;
  disabled?: boolean;
};

export enum StepState {
  complete = 'complete',
  incomplete = 'incomplete',
  skipped = 'skipped',
}

export type StepEntityId = EntityId<'step'>;
export type Step = {
  entityId: StepEntityId;
  name: string;
  stepType: StepType;
  state: StepState;
  bodySlate: any;

  module: ModuleEntityId;
  guide: GuideEntityId;
  orderIndex: number;
  hasViewedStep: boolean;
  ctaClicked?: boolean;
  ctaEntityId?: StepCTAEntityId;
  isComplete: boolean;
  completedAt?: Date;
  completedByUser?: AccountUser;
  wasCompletedAutomatically: boolean;
  manualCompletionDisabled: boolean;
  mediaReferences: MediaReference[];
  nextStep?: StepEntityId;
  inputs?: StepInput[];
  previousStep?: StepEntityId;
  branching?: BranchingData;
  ctas?: StepCTA[];
  /**
   * This is only present on steps passed from the WYSIWYG. We use this in
   * information in the `previewGuideSet` action to patch in auto-complete
   * interactions for WYSIWYG previews.
   */
  autoCompleteInteraction?: StepAutoCompleteInteraction;
  /** Whether this is a preview instance */
  isPreview?: boolean;
};

export type MediaReferenceEntityId = EntityId<'mediaReference'>;
export type MediaReference = {
  entityId?: MediaReferenceEntityId;
  media: Media;
  settings: MediaReferenceSettings;
};

export enum ContextTagType {
  dot = 'dot',
  icon = 'icon',
  badge = 'badge',
  badgeDot = 'badge_dot',
  badgeIcon = 'badge_icon',
  highlight = 'highlight',
}

export enum ContextTagAlignment {
  topRight = 'top_right',
  topLeft = 'top_left',
  bottomRight = 'bottom_right',
  bottomLeft = 'bottom_left',
  centerLeft = 'center_left',
  centerRight = 'center_right',
}

export enum ContextTagTooltipAlignment {
  left = 'left',
  right = 'right',
  top = 'top',
  bottom = 'bottom',
}

export type TaggedElementEntityId = EntityId<'tag'>;
export type TaggedElement = {
  entityId: TaggedElementEntityId;
  /**
   * Indicates the "placeholder URL" for wildcard/dynamic urls.
   * This is useful within previews and shouldn't ever be used outside of the Admin
   * context, therefore is marked as optional here.
   *
   * WARNING: For the embed context, use `wildcardUrl` instead.
   */
  url?: string;
  /**
   * The dynamic URL (can contain wildcard, regexp and dynamic attributes),
   * interpolated with the actual values so that it can be used to redirect users to
   * the guide context.
   *
   * NOTE: If RegExp or wildcards are used, this will fail redirects and there is nothing
   * we can do to infer where to redirect the user to ouside of the Admin context.
   */
  wildcardUrl: string;
  elementSelector: string;
  type: ContextTagType;
  alignment: ContextTagAlignment;
  xOffset: number;
  yOffset: number;
  tooltipAlignment: ContextTagTooltipAlignment;
  tooltipTitle: string;
  step?: StepEntityId; // in the future tags might not be for a specific step
  guide: GuideEntityId;
  isSideQuest: boolean;
  designType: GuideDesignType;
  formFactor: GuideFormFactor;
  relativeToText: boolean;
  style?: VisualTagStyleSettings;
  dismissedAt: Date | undefined | null;

  // not retrieved from the server
  /** Whether this is a preview instance */
  isPreview?: boolean;
  /** Scrolls to the element when not in the viewport */
  scrollIntoView?: boolean;
  /** Immediately show up or trigger related guide to show up */
  forcefullyOpen?: boolean;
};

export type StepAutoCompleteInteractionEntityId =
  EntityId<'stepAutoCompleteInteraction'>;
export type StepAutoCompleteInteraction = {
  entityId: StepAutoCompleteInteractionEntityId;
  url: string;
  wildcardUrl: string;
  elementSelector: string;
  type: StepAutoCompleteInteractionType;
  step: StepEntityId;
  guide: GuideEntityId;
  /** Whether this is a preview instance */
  isPreview?: boolean;
};

export type FormFactorStateKey = EmbedFormFactor | NpsFormFactor | string;
export type FormFactorState = {
  id: FormFactorStateKey;
  formFactor: EmbedFormFactor;
  renderedFormFactor: EmbedFormFactor;
  guides: GuideEntityId[]; // in the order they were launched to the user
  /** When the last selection/unselection was made */
  selectedAt?: Date;
  selectedGuide?: GuideEntityId;
  selectedModule?: ModuleEntityId;
  selectedStep?: StepEntityId;
  article?: KbArticle;
  /** Initial selected state when recovering from client storage */
  initialGuide?: GuideEntityId;
  /** Whether this is a preview instance */
  isPreview?: boolean;
  sidebarStateId?: string;
};

export type BranchingPathBase = {
  choiceKey: BranchingChoiceKey;
  branchingKey: BranchingKey;
  orderIndex: number;
};

export type BranchingPath = BranchingPathBase & {
  guide?: GuideEntityId;
  module?: ModuleEntityId;
};

export type BranchingPathWithResource = BranchingPathBase & {
  guide?: FullGuide;
  module?: FullModule;
};

export type BranchingPaths = {
  paths: Record<BranchingChoiceKey, BranchingPath>;
  guides: Record<GuideEntityId, Guide>;
  modules: Record<ModuleEntityId, Module>;
  steps: Record<StepEntityId, Step>;
};

export type InlineEmbedEntityId = EntityId<'inlineEmbed'>;

export type InlineEmbed = {
  entityId: InlineEmbedEntityId;
  url: string;
  wildcardUrl: string;
  elementSelector: string;
  position: InjectionPosition;
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
  leftMargin: number;
  maxWidth?: number;
  alignment?: InjectionAlignment;
  templateEntityId?: string;
  guide?: GuideEntityId;
  padding: number;
  borderRadius: number;
  previewId?: string;
};

export type NpsSurveyEntityId = EntityId<'npsSurvey'>;

/**
 * Net Promoter Score (NPS) entity.
 *
 * Holds information about NPS surveys available to the end-user.
 */
export type NpsSurvey = WithTypename<
  {
    entityId: NpsSurveyEntityId;
    /** Name of the NPS Survey (not shown to the end-user) */
    name?: string;
    /** Which form factor the NPS uses */
    formFactor: NpsFormFactor;
    /**
     * Presentation styles based on the form factor
     * @todo refine type
     **/
    formFactorStyles: Record<string, any>;
    /** NPS question to pose */
    question: string;
    /** Follow-up question to showcase */
    fupType: NpsFollowUpQuestionType;
    /**
     * Follow-up settings
     * @todo refine type
     **/
    fupSettings: Record<string, any>;
    /** Sort order of this NPS survey in relation to Guides and other NPS surveys */
    orderIndex: number;
    /** Page targeting details */
    pageTargeting: NpsSurveyPageTargeting;
    /** Moment when this was first seen */
    firstSeenAt?: Date;
    /** Moment when this was answered */
    answeredAt?: Date;
    /** Moment when this was dismissed */
    dismissedAt?: Date;
    /** Whether this is a preview instance */
    isPreview?: boolean;
  },
  EmbedTypenames.npsSurvey
>;

/**
 * NOTE: Remember to check whether the logic to sanitize the state before persisting
 * needs to be changed when you add new root-level items that can contain preview information
 * or you create new keys that shouldn't be persisted.
 */
export type GlobalState = {
  guides: Record<GuideEntityId, Guide>;
  modules: Record<ModuleEntityId, Module>;
  steps: Record<StepEntityId, Step>;
  formFactors: Record<FormFactorStateKey, FormFactorState>;
  taggedElements: Record<TaggedElementEntityId, TaggedElement>;
  stepAutoCompleteInteractions: Record<
    StepAutoCompleteInteractionEntityId,
    StepAutoCompleteInteraction
  >;
  branchingPaths: BranchingPaths;
  inlineEmbeds: Record<InlineEmbedEntityId, InlineEmbed>;
  /** NPS surveys available to the end-user */
  npsSurveys: Record<NpsSurveyEntityId, NpsSurvey>;
  /** Determines if the store has been fully initialized */
  initialized: Date | undefined;
};

export type AvailableGuidesChangedAction = {
  type: 'availableGuidesChanged';
  availableGuides: Guide[];
  keepExistingSelections?: boolean;
};

export type GuideChangedAction = {
  type: 'guideChanged';
  guide: AtLeast<FullGuide, 'entityId'>;
};

export type GuideHydrationFailedAction = {
  type: 'guideHydrationFailed';
  guide: GuideEntityId;
};

export type GuideSavedAction = {
  type: 'guideSaved';
  guide: GuideEntityId;
};

export type GuideViewedAction = {
  type: 'guideViewed';
  formFactor: FormFactorStateKey;
  eventType:
    | InternalTrackEvents.guideViewingEnded
    | InternalTrackEvents.guideViewingStarted;
  guide: GuideEntityId | undefined;
};

export type StepChangedAction = {
  type: 'stepChanged';
  step: AtLeast<Step, 'entityId'>;
  updateCompletionOnServer?: boolean;
  onComplete?: () => void;
};

export type StepAutoCompleteInteractionTriggeredAction = {
  type: 'stepAutoCompleteInteractionTriggered';
  /** The ID of the step auto-complete interaction that was triggered */
  interactionEntityId: StepAutoCompleteInteractionEntityId;
  /** The URL of the page where the interaction was triggered from */
  currentPageUrl: string | undefined;
};

export type StepAutoCompleteInteractionsChangedAction = {
  type: 'stepAutoCompleteInteractionsChanged';
  stepAutoCompleteInteractions: StepAutoCompleteInteraction[];
};

export type GuideSelectedAction = {
  type: 'guideSelected';
  formFactor: FormFactorStateKey;
  guide: GuideEntityId | null | undefined;
  keepExistingSelections?: boolean;
};

export type GuideHydrationStartedAction = {
  type: 'guideHydrationStarted';
  guide: GuideEntityId;
};

export type ModuleSelectedAction = {
  type: 'moduleSelected';
  formFactor: FormFactorStateKey;
  module: ModuleEntityId | undefined;
};

export type StepSelectedAction = {
  type: 'stepSelected';
  formFactor: FormFactorStateKey;
  step: StepEntityId | undefined;
};

export type ArticleSelectedAction = {
  type: 'articleSelected';
  formFactor: FormFactorStateKey;
  article: KbArticle | undefined;
};

export type StepViewedAction = {
  type: 'stepViewed';
  formFactor: FormFactorStateKey;
  eventType:
    | InternalTrackEvents.stepViewingEnded
    | InternalTrackEvents.stepViewingStarted;
  step: StepEntityId | undefined;
};

export type OnboardingResetAction = {
  type: 'onboardingReset';
  formFactor: FormFactorStateKey;
};

export type ModuleBranchingResetAction = {
  type: 'moduleBranchingReset';
  stepEntityId: StepEntityId;
};

export type BranchingPathSelectedAction = {
  type: 'branchingPathSelected';
  branchingKey: BranchingKey;
  choiceKeys: BranchingChoiceKey[];
  choiceLabels: string[];
  stepEntityId: StepEntityId;
  updateCompletionOnServer: boolean;
};

export type BranchingPathsSubmittedAction = {
  type: 'branchingPathsSubmitted';
  stepEntityId: StepEntityId | undefined;
};

export type TagDismissedAction = {
  type: 'tagDismissed';
  tag: TaggedElementEntityId;
  /** Useful to revert tag dismissal within previews */
  revert?: true;
};

export type ContextualDismissedAction = {
  type: 'contextualDismissed';
  formFactor: FormFactorStateKey;
  guideEntityId: GuideEntityId | undefined;
};

export type BranchingPathsChangedAction = {
  type: 'branchingPathsChanged';
  branchingPaths: BranchingPathWithResource[];
};

export type InlineEmbedsChangedAction = {
  type: 'inlineEmbedsChanged';
  inlineEmbeds: InlineEmbed[];
};

export type NpsSurveysChangedAction = {
  type: 'npsSurveysChanged';
  npsSurveys: NpsSurvey[];
};

export type ModalSeenAction = {
  type: 'modalSeen';
  guide: GuideEntityId;
};

export type ModalSeenEntry = {
  guide: GuideEntityId;
  expireAt?: Date;
};

export type ModalsSeenEntries = Record<GuideEntityId, ModalSeenEntry>;

export type LaunchCtaClickedAction = {
  type: 'launchCtaClicked';
  stepEntityId: StepEntityId;
  ctaEntityId: StepCTAEntityId;
  destinationKey: DestinationKey;
  /** Whether to mark the step as complete */
  markComplete: boolean;
  appLocation: string | undefined;
  onSuccess?: (guide: FullGuide) => void;
  onError?: () => void;
  onComplete?: () => void;
};

type StepCtaClickedInteractionHandler = (...args: any[]) => void;

export type StepCtaClickedAction<
  LockAirTraffic extends StepCtaClickedInteractionHandler = StepCtaClickedInteractionHandler,
  UnlockAirTraffic extends StepCtaClickedInteractionHandler = StepCtaClickedInteractionHandler,
  StartJourney extends StepCtaClickedInteractionHandler = StepCtaClickedInteractionHandler,
  EndJourney extends StepCtaClickedInteractionHandler = StepCtaClickedInteractionHandler,
  ToggleSidebar extends StepCtaClickedInteractionHandler = StepCtaClickedInteractionHandler,
  OpenSidebarLater extends StepCtaClickedInteractionHandler = StepCtaClickedInteractionHandler
> = {
  type: 'stepCtaClicked';
  /** Step entity id of which the clicked CTA belongs to */
  stepEntityId: StepEntityId;
  /** The clicked Step CTA */
  cta: StepCTA;
  /** The organization domain, which is relevant to determine whether a link  */
  organizationDomain: string;
  /** The URL of the page where the interaction was triggered from */
  currentPageUrl: string | undefined;
  /** Whether this Step can be marked as incomplete as a side effect of this interaction */
  canIncomplete: boolean;
  /** Callback fn responsible for locking air traffic */
  lockAirTrafficHandler: LockAirTraffic;
  /** Callback fn responsible for unlocking air traffic */
  unlockAirTrafficHandler: UnlockAirTraffic;
  /** Callback fn responsible for starting a journey */
  startJourneyHandler: StartJourney;
  /** Callback fn responsible for ending a journey */
  endJourneyHandler: EndJourney;
  /** Callback fn responsible for toggling the sidebar */
  toggleSidebar: ToggleSidebar;
  /** Callback fn responsible for setting the sidebar open in the next session */
  openSidebarLaterHandler: OpenSidebarLater;
  /**
   * Callback fn to run before record step completion
   * @default {@link noopCbWrapper}
   */
  beforeCompletionHandler?: (
    cb: (...args: any[]) => void
  ) => (...a: any[]) => void;
};

export type TaggedElementFlagSetAction = {
  type: 'taggedElementFlagSet';
  taggedElementEntityId: TaggedElementEntityId;
  scrollIntoView?: boolean;
  forcefullyOpen?: boolean;
};

export type RenderedFormFactorChangedAction = {
  type: 'renderedFormFactorChanged';
  formFactor: FormFactorStateKey;
  renderedFormFactor: EmbedFormFactor.inline | EmbedFormFactor.sidebar;
};

export type FormFactorCreatedAction = {
  type: 'formFactorCreated';
  id: FormFactorStateKey;
  guides: Guide[];
  formFactor: EmbedFormFactor;
  isPreview: boolean;
  sidebarStateId?: string;
};

export type FormFactorRemovedAction = {
  type: 'formFactorRemoved';
  id: FormFactorStateKey;
};

export type FormFactorGuidesUpdatedAction = {
  type: 'formFactorGuidesUpdated';
  formFactorStateKey: FormFactorStateKey;
  formFactor: EmbedFormFactor;
  guides?: Guide[];
  keepExistingSelections?: boolean;
};

export type GuidesLoadedAction = {
  type: 'guidesLoaded';
  /**
   * Determines which guides were recently loaded.
   * If not set, will fallback to all currently existing guides.
   * @default undefined
   */
  guides: GuideEntityId[];
};

export type GuideJourneyEnded = {
  type: 'guideJourneyEnded';
  guide: GuideEntityId;
  module?: ModuleEntityId;
  step?: StepEntityId;
  navigatedAway: boolean;
};

export type NpsSurveyAnsweredAction = {
  type: 'npsSurveyAnswered';
  entityId: NpsSurveyEntityId;
  answer: number;
  fupAnswer?: string | null;
};

export type NpsSurveyDismissedAction = {
  type: 'npsSurveyDismissed';
  entityId: NpsSurveyEntityId;
};

export type NpsSurveySeenAction = {
  type: 'npsSurveySeen';
  entityId: NpsSurveyEntityId;
};

export type GlobalStateAction =
  | AvailableGuidesChangedAction
  | GuideChangedAction
  | GuideHydrationFailedAction
  | GuideSavedAction
  | GuideViewedAction
  | StepChangedAction // mostly would be used for optimistic updates
  | StepAutoCompleteInteractionTriggeredAction
  | OnboardingResetAction
  | ModuleBranchingResetAction
  | StepAutoCompleteInteractionsChangedAction
  | GuideSelectedAction
  | GuideHydrationStartedAction
  | ModuleSelectedAction
  | StepSelectedAction
  | ArticleSelectedAction
  | StepViewedAction
  | BranchingPathSelectedAction
  | BranchingPathsSubmittedAction
  | TagDismissedAction
  | BranchingPathsChangedAction
  | InlineEmbedsChangedAction
  | ModalSeenAction
  | LaunchCtaClickedAction
  | StepCtaClickedAction
  | TaggedElementFlagSetAction
  | RenderedFormFactorChangedAction
  | FormFactorCreatedAction
  | FormFactorRemovedAction
  | FormFactorGuidesUpdatedAction
  | ContextualDismissedAction
  | GuidesLoadedAction
  | GuideJourneyEnded
  | NpsSurveysChangedAction
  | NpsSurveyAnsweredAction
  | NpsSurveyDismissedAction
  | NpsSurveySeenAction;

export type GlobalStateActionNames = ActionNames<GlobalStateAction>;
export type GlobalStateActionPayloads = ActionPayloads<GlobalStateAction>;

export type GlobalStateActionPayload<A extends GlobalStateActionNames> =
  GlobalStateActionPayloads[A];

export type HideOnCompletionData = {
  /** Whether the element should hide on completion. */
  value: boolean;
  /** Whether the hiding should be delayed for animations. */
  delayed: boolean;
};

export type GuideShape = AtLeast<
  Guide,
  'designType' | 'formFactor' | 'theme' | 'isCyoa' | 'type'
>;
