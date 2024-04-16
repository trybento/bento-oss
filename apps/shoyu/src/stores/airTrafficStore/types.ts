import { WithLocationPassedProps } from 'bento-common/hocs/withLocation';
import {
  PartialPick,
  RecursivePartial,
  UndefinablePick,
} from 'bento-common/types';
import {
  EmbedTypenames,
  EmbedTypenamesToType,
  Guide,
  GuideEntityId,
  ModuleEntityId,
  NpsSurvey,
  NpsSurveyEntityId,
  Step,
  StepEntityId,
  TaggedElement,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';
import { WritableDraft } from 'immer/dist/internal';
import { CustomUIProviderValue } from '../../providers/CustomUIProvider';

/** Any other relevant piece of data to help with debugging */
export type EvaluationDetailsDebugInfo = {
  [key: string]:
    | undefined
    | null
    | string
    | boolean
    | number
    | HTMLElement
    | EvaluationDetailsDebugInfo;
};

export type EvaluationDetails = {
  /** Scope of the evaluation that led to show/hide decision */
  scope: string;
} & EvaluationDetailsDebugInfo;

export type DesiredStateVisibilityIndicator = {
  [key in EmbedTypenames]: Partial<
    Record<
      EmbedTypenamesToType[key]['formFactor'],
      EmbedTypenamesToType[key]['entityId'][]
    >
  >;
};

export type DesiredState = {
  /** Whether the sidebar should open */
  sidebarOpen: boolean;
  /** Whether the sidebar should auto-focus */
  sidebarAutoFocused: boolean;
  /** Guides told to show */
  show: DesiredStateVisibilityIndicator;
  /** Guides told to hide */
  hide: DesiredStateVisibilityIndicator;
  /** Tagged elements allowed to show */
  tags: TaggedElementEntityId[];
};

/**
 * Settings relevant to AirTraffic control algorithm, which will be fed in as part of the input.
 */
export type AirTrafficAwareSettings = UndefinablePick<
  CustomUIProviderValue,
  'tagVisibility'
> & {
  /** Whether sidebar auto-open should be prevented */
  preventAutoOpens: boolean;
};

/** The different content-types handled within ATC */
export type AirTrafficItem = Guide | NpsSurvey;

export type AirTrafficControlInput = {
  /** Moment where the main store was initialized */
  initialized: boolean;
  /** All (sorted) content list (i.e. Guides and Surveys) */
  contentAvailable: AirTrafficItem[];
  /** All (sorted) tagged elements, including all states */
  taggedElements: Record<TaggedElementEntityId, TaggedElement>;
  /** Current active journey, if one exists */
  activeJourney: AirTrafficState['activeJourney'];
  /** Current page URL, means `appLocation.href` */
  currentPageUrl: WithLocationPassedProps['appLocation']['href'];
  /** Whether stealth mode is enabled */
  stealthMode: AirTrafficState['stealthMode'];
  /** Whether sidebar is currently open */
  sidebarOpen: boolean;
  /** Entity Id of the step selected in the main sidebar, if any */
  sidebarSelectedStep: StepEntityId | undefined;
  /** Whether we're in mobile context */
  isMobile: boolean;
  /** Whether inline is present */
  inlineEmbedPresent: boolean;
  /** Settings */
  settings: AirTrafficAwareSettings;
  /** Always prevent auto-open animations if sidebar has been shut off */
  toggledOffAtLeastOnce: boolean;
  /** Guide selector helper */
  guideSelector: <T extends Guide>(
    guideEntityId: GuideEntityId | undefined
  ) => T | undefined;
  /** Guide selector helper */
  stepSelector: (stepEntityId: StepEntityId | undefined) => Step | undefined;
  /** Tagged element of step selector helper */
  taggedElementOfStepSelector: (
    guideEntityId: GuideEntityId | undefined,
    stepEntityId: StepEntityId | undefined
  ) => TaggedElement | undefined;
};

/**
 * This is effectively a subset of `AirTrafficControlInput` type containing only the immutable properties
 * that are relevant to the air traffic control algorithm.
 *
 * Anything considered mutable should be part of `EnrichedDesiredState` instead.
 */
export type AirTrafficContext = Omit<
  AirTrafficControlInput,
  'initialized' | 'contentAvailable' | 'sidebarOpen'
>;

/**
 * Enriches the desired state with additional information that can be mutated as a result of
 * air traffic control processing.
 *
 * On the other hand, any other information that serves as input for the ATC algorithm but is considered
 * immutable should be provided as part of `AirTrafficControlInput` instead.
 */
export type EnrichedDesiredState = DesiredState & {
  /** Competing guide counters, used to determine whether another guide can show */
  counters: {
    /** How many announcements should show */
    announcementsCounter: number;
    /** How many tooltips should show */
    tooltipsCounter: number;
    /** How many NPS surveys should show */
    surveysCounter: number;
  };
  /** Accumulated logs for debugging (i.e. describe why things should show/hide) */
  logs: {
    outcome: 'show' | 'hide';
    details: {
      /** Which air traffic handler generated the log */
      handler: string;
      /** Item's typename */
      __typename: EmbedTypenamesToType[keyof EmbedTypenamesToType]['__typename'];
      /** Item's entity id */
      entityId: EmbedTypenamesToType[keyof EmbedTypenamesToType]['entityId'];
      /** Indicates the reason for the outcome */
      reason: EvaluationDetails;
    };
  }[];
  tagLogs: {
    outcome: 'canShow' | 'cannotShow';
    details: {
      /** Which air traffic handler generated the log */
      handler: string;
      /** Item's entity id */
      entityId: TaggedElementEntityId;
      /** Indicates the reason for the outcome */
      reason: EvaluationDetails;
    };
  }[];
};

/**
 * Evaluated by shouldEndJourney in the Air Traffic Element
 * Will automatically close off journeys based on actions observed
 *
 * NOTE: There might be other reasons for journey ended not captured here, see {@link JourneyEndActionPayload}
 */
export type JourneyEndingCriteria = {
  /** Dismissing the current guide (i.e. switching view, dismissing, completing, etc) */
  dismissSelection: boolean;
  /** Closing the sidebar (either manually or automatically) */
  closeSidebar: boolean;
  /** Navigating to a different page */
  navigateAway: boolean;
  /** Significant time has elapsed and guide has not been shown */
  timeElapsed: boolean;
};

export type JourneyGuideDetails = {
  type: EmbedTypenames.guide;
  /** From which guide the journey was started */
  startedFromGuide: GuideEntityId | undefined;
  /** From which module the journey was started */
  startedFromModule: ModuleEntityId | undefined;
  /** From which step the journey was started */
  startedFromStep: StepEntityId | undefined;
  /** Guide selected within the journey */
  selectedGuide: GuideEntityId;
  /** Module selected within the journey */
  selectedModule?: ModuleEntityId;
  /** Step selected within the journey */
  selectedStep?: StepEntityId;
};

export type JourneySurveyDetails = {
  type: EmbedTypenames.npsSurvey;
  /** Which survey this journey selected */
  selectedSurvey: NpsSurveyEntityId;
};

type JourneyTypeDetails = JourneyGuideDetails | JourneySurveyDetails;

export type Journey = {
  /** Journey entity id (randomly generated) */
  entityId: string;
  /** Moment the journey was started */
  startedAt: Date;
  // /** Which type */
  // type: EmbedTypenames.guide | EmbedTypenames.npsSurvey;
  /** Determines in which URL this journey has started. */
  startedOnPageUrl: string | undefined;
  /** The page URL selected by the journey, in case one exists */
  selectedPageUrl: string | null | undefined;
  /** Criteria to end the journey */
  endingCriteria: JourneyEndingCriteria;
} & JourneyTypeDetails;

export type AirTrafficState = Pick<
  DesiredState,
  'sidebarOpen' | 'sidebarAutoFocused'
> & {
  /** Moment where the air traffic store was initialized */
  initialized?: Date;
  /** Guides currently being shown */
  guidesShown: GuideEntityId[];
  /** History of the last 10th desired states */
  desiredStateHistory: DesiredState[];
  /** Active journey, in case one exists */
  activeJourney: Journey | undefined;
  /** Whether air traffic state is locked. Useful for awaiting animations, etc. */
  locked?: boolean;
  /** The reason why air traffic state was locked, if given and currently locked */
  lockedReason?: string;
  /**
   * Whether stealth mode is enabled.
   * Stealth mode means window is too narrow to show non-inline components.
   * "Non-inline" components are announcements, sidebar, visual tags, tooltips, etc.
   *
   * @default false
   */
  stealthMode: boolean;
};

/**
 * Describe the arguments needed in order to start a new journey.
 *
 * Same as `Journey`, except it does not require `entityId` or `startedAt`, but does
 * require `selectedGuide`. All other properties are recursively optional, meaning they're
 * either entirely not necessary or defaults will be provided.
 *
 * @see journeyStarted.ts for more details
 */
export type JourneyStartActionPayload = RecursivePartial<
  Omit<
    Journey,
    'entityId' | 'startedAt' | 'type' | 'selectedGuide' | 'selectedJourney'
  >
> &
  (
    | PartialPick<JourneyGuideDetails, 'type' | 'selectedGuide'>
    | PartialPick<JourneySurveyDetails, 'type' | 'selectedSurvey'>
  );

export type JourneyEndActionPayload = {
  reason: Partial<Record<keyof JourneyEndingCriteria, true>> & {
    /** Thrown when a journey is ended due to auto-completion triggers */
    autoCompletion?: boolean;
  };
} & Partial<
  | Pick<JourneyGuideDetails, 'type' | 'selectedGuide'>
  | Pick<JourneySurveyDetails, 'type' | 'selectedSurvey'>
>;

export type ShouldEndJourneyInput = Pick<
  AirTrafficControlInput,
  'sidebarOpen' | 'activeJourney' | 'currentPageUrl'
> & {
  /** Moment when we detected the main store was initialized */
  initializedAt: number;
  /** Guide selected in the active journey, if exists */
  activeJourneySelectedGuide: Guide | undefined;
  /** Actual guides currently being shown (not entity ids) */
  guidesShown: Guide[];
  /** Previous sidebarOpen state */
  prevSidebarOpen?: boolean;
};

export type ShouldEndJourneyDecision =
  | [
      /** Indicates the journey should be ended */
      shouldEndJourney: true,
      /** Reason why the journey should be ended */
      reason: Partial<Record<keyof JourneyEndingCriteria, true>> & {
        /** Thrown when a journey is left in a failed state for too much time */
        timeElapsed?: boolean;
      }
    ]
  | [shouldEndJourney: false, reason: undefined];

export type AirTrafficStore = AirTrafficState & {
  /** Toggles stealth mode */
  toggleStealthMode: (payload: { value: boolean }) => void;
  /** Starts a journey (e.g. launching a destination guide) */
  startJourney: (args: JourneyStartActionPayload) => void;
  /** Ends a journey */
  endJourney: (payload: JourneyEndActionPayload) => void;
  /**
   * To register a given guide visibility state.
   * Used to reconcile that guide visibility state with the last desired state.
   */
  register: (payload: { guide: GuideEntityId; shown: boolean }) => void;
  /** Push a new desired state */
  pushDesiredState: (payload: { value: DesiredState }) => void;
  /** Lock air traffic desired state computation */
  lock: (
    /** Indicates the reason for locking the state */
    reason?: string
  ) => void;
  /** Unlock air traffic desired state compotation */
  unlock: () => void;
};

export type WorkingAirTrafficStore =
  | WritableDraft<AirTrafficStore>
  | AirTrafficStore;
