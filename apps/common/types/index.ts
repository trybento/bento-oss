import {
  BentoInstance as PublicBentoInstance,
  BentoSettings as PublicBentoSettings,
} from '@bentoapp/types';
import { Model } from 'sequelize-typescript';

import {
  BranchingFormFactor,
  ContextTagAlignment,
  ContextTagTooltipAlignment,
  ContextTagType,
  FullGuide,
  Guide,
  InlineEmbed,
  InlineEmbedEntityId,
  TaggedElement,
} from './globalShoyuState';
import { PreviewDataPack, PreviewSettings } from './preview';
import { ResponsiveVisibilityBehavior } from './shoyuUIState';
import { CommonTargeting, LongRuleTypeEnum } from './targeting';
import { TemplateModuleValue } from './templateData';

export type ValueOf<T> = T[keyof T];

export type OmitFirstParameter<F> = F extends (
  arg0: any,
  ...rest: infer R
) => any
  ? R
  : never;

export type OmitFirst<P extends any[]> = P extends [any, ...infer R]
  ? R
  : any[];
export type OmitLast<P extends any[]> = P extends [...infer R, any] ? R : any[];

export type SplitFirst<P extends any[]> = P extends [infer A, ...infer B]
  ? [A, B]
  : [P, any[]];
export type SplitLast<P extends any[]> = P extends [...infer A, infer B]
  ? [A, B]
  : [P, any];

export type UnionOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type UndefinablePick<T, K extends keyof T> = {
  [P in K]: T[P] | undefined;
};

/** Get the type of an async method's return value */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

/** Pick a partial but require certain keys */
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/** A sequelize model with only selected attributes present */
export type SelectedModelAttrs<T, K extends keyof T> = Model & AtLeast<T, K>;

export type SelectedModelAttrsPick<T, K extends keyof T> = Model & Pick<T, K>;

/**
 * Make the type props deep partial.
 * @see https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export type WithOptionalPicks<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type WithRequiredPicks<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

/**
 * To easily pick enum keys
 *
 * @see https://github.com/microsoft/TypeScript/issues/33308#issuecomment-529308349
 *
 * @example ```ts
 * type Picked_KeysOfEnum = PickKey<typeof KeysToBePickedFrom, 'KEY_ONE' | 'LAST_KEY'>
 * ```
 */
export type PickKey<T, K extends keyof T> = Extract<keyof T, K>;

export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never;

/**
 * Find write/read enabled key
 *
 * @see https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir
 */
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

export type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    never,
    P
  >;
}[keyof T];

/**
 * Converts a read-only object to a writeable one.
 */
export type Writable<T> = T extends ReadonlyArray<infer U>
  ? Array<Writable<U>>
  : T extends {}
  ? { -readonly [K in keyof T]: Writable<T[K]> }
  : T;

/**
 * TS 4.3 doesn't have Awaited<ReturnType<fn>> yet. This fills the gap
 */
export type ReturnPromiseType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

/**
 * Converts readonly keys in a type to mutable
 * Doesn't work for nested objects, only the first level of keys
 * @see https://bobbyhadz.com/blog/typescript-change-readonly-to-mutable
 */
export type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key];
};

export type FutureAddedValue<T> = T & {
  futureAddedValue: '%future added value';
};

/**
 * Converts to either null or the given type.
 * Useful for not having to manually type `null | T` everywhere.
 */
export type Nullable<T> = null | T;

/**
 * NOTE: It's not enough to just add the feature flag name here and the various
 * hooks in shoyu and/or miso. For a feature flag to actually be enabled it
 * also need an associated feature flag instance added in
 * `/apps/udon/src/utils/features/index.ts` since without that it's not added
 * to the filtering lookup table used when retrieving the list of enabled
 * feature flags for an org.
 */
export enum FeatureFlagNames {
  customCss = 'enable custom CSS',
  webhooks = 'enable webhooks',
  enableZendesk = 'enable zendesk',
  autolaunchCsv = 'enable autolaunch csv',
  stepProgressSyncing = 'enable step progress sync',
  branchingSelectionTargeting = 'enable branching selection targeting',
  internalGuideNames = 'internal guide names',
  autoInjectInline = 'auto inject inline',
  dynamicModules = 'dynamic modules',
  analyticsMaintenancePage = 'analytics maintenance page',
  guideArchiving = 'guide archiving',
  guideViewedEmails = 'enable guide viewed emails',
  endUserNudges = 'end user nudges',
  overrideDiagnostics = 'override diagnostics',
  /** Completely disable sidebar too allow inline experiences only */
  hideSidebar = 'hide sidebar',
  advancedSidebarSettings = 'advanced sidebar settings',
  easterEggs = 'easter eggs',
  customVisualTag = 'enable custom visual tag',
  /** Sends webhook events for internal user activity where it normally wouldn't */
  internalGuideEvents = 'enable internal guide events',
  advancedInlineContextualCustomizations = 'advanced inline contextual customizations',
  guideSchedulingThrottling = 'guide scheduling throttling',
  forceGoogleSSO = 'force google sso',
  gatedGuideAndStepPropagation = 'gated guide-n-step propagation',
  splitTesting = 'enable split testing',
  /**
   * This is used to guarantee that tags will always be rendered within the window,
   * regardless of the target element position.
   *
   * @todo make this GA before removing
   * @deprecated to be removed after D+14
   */
  tooltipInsideWindow = 'enable tooltip inside window',
  disableWindowScrollHook = 'enable useDisableWindowScroll hook',
  npsSurveys = 'nps',
  serialCyoa = 'serial cyoa',
  targetingGpt = 'targeting gpt',
  /** Run content propagation only after 5am UTC */
  deferPropagation = 'defer propagation',
  /**
   * Used to force the hydration of available guides every time the embed is initialized,
   * regardless of whether we hydrated from persistence or there is a cache hit.
   *
   * WARNING: This shouldn't be used unless not hydrating available guides when possible
   * for an Org is causing problems.
   */
  forcedAvailableGuidesHydration = 'forced available guides hydration',
  /**
   * Determine whether we should hide the chart of "new guides launched",
   * which lives in the global analytics page and is currently not performant for
   * large organizations.
   */
  hideChartOfNewGuidesLaunched = 'hide chart of new guides launched',
  /**
   * Determines whether we observe styling attributes (e.g., id, class, style etc.)
   * in the DOM mutation observers.
   */
  observeStylingAttributes = 'observe styling attributes',
}

/**
 * Track events that Udon handles internally
 */
export enum InternalTrackEvents {
  guideViewingEnded = 'guide_viewing_ended',
  guideViewingStarted = 'guide_viewing_started',
  stepViewingEnded = 'step_viewing_ended',
  stepViewingStarted = 'step_viewing_started',
  quickLinkClicked = 'quick_link_clicked',
  audienceEvent = 'audience_event',
  userFeedback = 'user_feedback',
  integrationSync = 'integration_sync',
}

/** Types of analytics events we track */
export enum Events {
  troubleshootVisited = 'troubleshoot_visited',
  troubleshootEvent = 'troubleshoot_event',
  adminFocused = 'admin_focused',
  analyticsVisited = 'analytics_visited',
  gptEvent = 'gpt_event',
  templateBootstrapped = 'template_bootstrapped',
  helpCenterSearched = 'help_center_searched',
  emailSent = 'email_sent',
  stepCompleted = 'step_completed',
  accountUserAppActivity = 'account_user_app_activity',
  ctaClicked = 'cta_clicked',
  savedForLater = 'saved_for_later',
  dismissed = 'dismissed',
}

/**
 * @todo rename `mailchimp` value to `compact`
 */
export enum Theme {
  nested = 'standard',
  flat = 'minimal',
  compact = 'mailchimp',
  timeline = 'timeline',
  card = 'card',
  carousel = 'carousel',
  videoGallery = 'videoGallery',
}

export enum MinimalSidebarSize {
  sm = 'sm',
  lg = 'lg',
}

export enum SidebarStyle {
  slideOut = 'slide_out',
  sideBySide = 'side_by_side',
  floating = 'floating',
}

export enum SidebarPosition {
  left = 'left',
  right = 'right',
}

export enum AnnouncementShadow {
  none = 'none',
  standard = 'standard',
}

export enum InlineContextualShadow {
  none = 'none',
  standard = 'standard',
}

export enum ModalSize {
  large = 'large',
  medium = 'medium',
  small = 'small',
}

export enum ModalPosition {
  center = 'center',
  topLeft = 'top_left',
  topRight = 'top_right',
  bottomLeft = 'bottom_left',
  bottomRight = 'bottom_right',
}

export enum TooltipSize {
  large = 'large',
  medium = 'medium',
  small = 'small',
}

export enum TooltipShowOn {
  /**
   * Indicates the tooltip should immediately show once the target element is found,
   * without requiring the end-user to interact with it.
   *
   * This is usually used to implement product-tours or in conjunction with the "highlight" style.
   * See {@link ContextTagType.highlight}
   */
  load = 'page_load',
  /**
   * Indicates the tooltip should only show once the target element is hovered.
   *
   * This is usually used to draw attention to UI controls/features but without interrupting the end-user.
   *
   * WARNING: For Flow-type guides, this will only have an effect on the first step, as all the other
   * steps will be automatically shown as the user progresses in the journey.
   */
  hover = 'tag_hover',
}

export enum GuideTypeEnum {
  account = 'account',
  template = 'template',
  user = 'user',
  splitTest = 'split_test',
}

export enum CreateGuideVariationEnum {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

/**
 * TODO: Cleanup types from shoyu and udon.
 * GuideFormFactor
 * StepType
 */
export enum EmbedFormFactor {
  inline = 'inline',
  sidebar = 'sidebar',
  modal = 'modal',
  banner = 'banner',
  tooltip = 'tooltip',
  flow = 'flow',
}

export enum GuideFormFactor {
  legacy = 'inline_sidebar',
  inline = 'inline',
  sidebar = 'sidebar',
  modal = 'modal',
  banner = 'banner',
  tooltip = 'tooltip',
  flow = 'flow',
}

export enum BannerTypeEnum {
  inline = 'inline',
  floating = 'floating',
}

export enum BannerPosition {
  top = 'top',
  bottom = 'bottom',
}

export enum BannerPadding {
  large = 'large',
  medium = 'medium',
  small = 'small',
}

export type BasicStyleSettings = {
  backgroundColor?: string;
  textColor?: string;
};

type BodyOrientationSettings = {
  stepBodyOrientation?: StepBodyOrientation;
  mediaOrientation?: MediaOrientation;
  verticalMediaOrientation?: VerticalMediaOrientation;
  verticalMediaAlignment?: VerticalAlignmentEnum;
  horizontalMediaAlignment?: AlignmentEnum;
  height?: number;
  imageWidth?: string;
};

export type ChecklistStyle = {
  hideStepGroupTitle?: boolean;
  hideCompletedSteps?: boolean;
  ctasOrientation?: CtasOrientation;
} & BodyOrientationSettings;

/** Guide level */
export type BaseEmbeddedCardStyle = {
  padding?: number;
  advancedPadding?: string;
  borderRadius?: number;
  borderColor?: string;
  mediaFontSize?: number;
  mediaTextColor?: string;
  ctasOrientation?: CtasOrientation;
};

export type BaseAnnouncementStyle = {
  ctasOrientation?: CtasOrientation;
  canDismiss?: boolean;
};

export enum GuideBaseState {
  /** Means the guide is still in draft */
  draft = 'draft',
  /** Means the guide is active */
  active = 'active',
  /** Means the guide is inactive */
  inactive = 'inactive',
  /** Means the guide will not launch for new users but who has it will continue having it, can be re-launched */
  paused = 'paused',
  /** Means the guide no longer match the targeting attributes, can be reactivated */
  obsoleted = 'obsoleted',
  archived = 'archived',
}

/**
 * @todo rename props removing the `banner` prefix
 */
export type BannerStyle = {
  bannerType: BannerTypeEnum;
  bannerPosition: BannerPosition;
  padding?: BannerPadding;
} & BaseAnnouncementStyle &
  BasicStyleSettings;

/**
 * @todo rename props removing the `modal` prefix
 */
export type ModalStyle = {
  modalSize: ModalSize;
  position: ModalPosition;
  hasBackgroundOverlay: boolean;
  mediaFontSize?: number;
  mediaTextColor?: string;
} & BaseAnnouncementStyle &
  BasicStyleSettings &
  BodyOrientationSettings;

export type AnnouncementStyle = BannerStyle | ModalStyle;

/**
 * @todo rename props removing the `tooltip` prefix
 */
export type TooltipStyle = {
  backgroundOverlayColor?: string;
  backgroundOverlayOpacity?: number;
  hasArrow: boolean;
  /** @deprecated not being used anymore, to be removed */
  hasBackgroundOverlay?: boolean;
  tooltipShowOn: TooltipShowOn;
  tooltipSize: TooltipSize;
  mediaFontSize?: number;
  mediaTextColor?: string;
} & BaseAnnouncementStyle &
  BasicStyleSettings &
  BodyOrientationSettings;

export type CardStyle = BaseEmbeddedCardStyle &
  BaseAnnouncementStyle &
  BodyOrientationSettings &
  BasicStyleSettings;

export type CarouselStyle = {
  dotsColor?: string;
} & BaseEmbeddedCardStyle &
  BaseAnnouncementStyle &
  BodyOrientationSettings &
  BasicStyleSettings;

export type VideoGalleryStyle = {
  selectedBackgroundColor?: string;
  statusLabelColor?: string;
} & BaseEmbeddedCardStyle &
  BaseAnnouncementStyle &
  BasicStyleSettings;

export type FormFactorStyle =
  | BannerStyle
  | ModalStyle
  | TooltipStyle
  | CardStyle
  | CarouselStyle
  | VideoGalleryStyle
  | ChecklistStyle
  | null;

export type OrientableFormFactorStyle =
  | CardStyle
  | CarouselStyle
  | ChecklistStyle;

export type InlineContextualGuideStyles = CardStyle | CarouselStyle;

export enum CYOABackgroundImagePosition {
  background = 'background',
  left = 'left',
  right = 'right',
  top = 'top',
  bottom = 'bottom',
}

export type BranchingBaseStyle = {
  formFactor?: BranchingFormFactor;
};

export type BranchingCardStyle = BranchingBaseStyle & {
  formFactor?: BranchingFormFactor.cards;
  backgroundImageUrl: string | null;
  backgroundImagePosition: CYOABackgroundImagePosition;
};

export type BranchingStyle = BranchingBaseStyle | BranchingCardStyle;

export type withFormFactorStyle<
  T extends Guide | FullGuide,
  S extends Guide['formFactorStyle']
> = T & {
  formFactorStyle?: Extract<T['formFactorStyle'], S>;
};

export enum GuideDesignType {
  onboarding = 'onboarding', // isSideQuest=false and formFactor=any
  announcement = 'announcement', // isSideQuest=true and formFactor=modal or banner
  everboarding = 'everboarding', // isSideQuest=true and formFactor=sidebar
}

export enum GuideExpirationCriteria {
  /**
   * Means the guide should never automatically expire
   * NOTE: This is persisted as `NULL` within the database and transformed by a getter/setter at the Model level.
   */
  never = 'never',
  /** Means the guide can expire based on the date of its last step completed */
  stepCompletion = 'step_completion',
  /** Means the guide can expire based on its launch date */
  launch = 'launch',
}

export enum GuideState {
  active = 'active',
  draft = 'draft',
  inactive = 'inactive',
  /** Means the guide was expired after certain time without activity */
  expired = 'expired',
}

export enum GuidePageTargetingType {
  anyPage = 'any_page',
  specificPage = 'specific_page',
  visualTag = 'visual_tag',
  inline = 'inline',
}

export enum StepType {
  required = 'required',
  optional = 'optional',
  fyi = 'fyi',
  branching = 'branching',
  branchingOptional = 'branching_optional',
  input = 'input',
}

export enum EmbedToggleStyle {
  arrow = 'arrow',
  progressRing = 'progress_ring',
  text = 'text',
  /** @deprecated use 'sidebarVisibility' set to 'hide' */
  hidden = 'hidden',
}

export enum TagContext {
  step = 'step',
  template = 'template',
}

export enum TagVisibility {
  /** Visual tags are always shown */
  always = 'always',
  /** Visual tags are only shown when the Step they belong to is selected */
  activeStep = 'active_step',
}

export enum EmbedToggleStyleInverted {
  progressRing = 'progress_ring_inverted',
  text = 'text_inverted',
}

export enum CompletionStyle {
  lineThrough = 'line-through',
  grayedOut = 'grayed-out',
}

export type Timeout = ReturnType<typeof setTimeout>;
export type Interval = ReturnType<typeof setInterval>;

export type Action = { type: string };
export type ActionNames<A extends Action> = A['type'];
export type ActionPayload<A extends Action, N extends ActionNames<A>> = Omit<
  Extract<A, { type: N }>,
  'type'
>;
export type ActionPayloads<A extends Action> = {
  [key in ActionNames<A>]: ActionPayload<A, key>;
};
export type ActionHandler<S, A extends Action, T extends ActionNames<A>> = (
  state: S,
  payload: ActionPayload<A, T>
) => void;
export type ActionHandlersMap<S, A extends Action> = {
  [key in ActionNames<A>]: ActionHandler<S, A, key>;
};

// HTML DOM Element nodeType
export enum NodeTypeEnum {
  element = 1,
  attributes = 2,
  text = 3,
  comment = 8,
}

export enum TemplateState {
  draft = 'draft',
  live = 'live',
  stopped = 'stopped',
  removed = 'removed',
}

export enum StepCompletion {
  manual = 'manual',
  auto = 'auto',
  autoInteraction = 'autoInteraction',
}

export type Attribute = {
  name: string;
  type?: AttributeType;
  valueType: AttributeValueType;
};

export enum AttributeType {
  account = 'account',
  accountUser = 'account_user',
}

export enum AttributeValueType {
  boolean = 'boolean',
  number = 'number',
  text = 'text',
}

/** Types of objects path can lead to */
export enum BranchingEntityType {
  /** @deprecated seems to be deprecated in favor of 'guide' */
  Template = 'template',
  Guide = 'guide',
  Module = 'module',
}

/**
 * ⚠️ WARNING: Make sure you've updated the usage elsewhere if you make changes for template audits,
 * otherwise you can break pages like the History Tab (i.e. when new events are added).
 */
export enum AuditEvent {
  /**
   * Template audits: pay attention to the warning above
   */
  contentChanged = 'content_changed',
  subContentChanged = 'sub_content_changed',
  autolaunchChanged = 'autolaunch_changed',
  autocompleteChanged = 'autocompleted_changed',
  launched = 'launched',
  manualLaunch = 'manual_launched',
  priorityChanged = 'priority_changed',
  paused = 'paused',
  created = 'created',
  /** Possibly deprecated. This can't be done stand-alone anymore */
  settingsChanged = 'settings_changed',
  locationChanged = 'location_changed',
  archived = 'archived',
  expirationCriteriaChanged = 'expiration_criteria_changed',
  gptEvent = 'gptEvent',
  templateBootstrapped = 'templateBootstrapped',
  /**
   * Audit events specific to accounts that won't affect the template history tab
   * These are NOT used with TemplateAudit objects
   *
   * @todo separate into own category and adjust auditContext typings accordingly
   */
  reset = 'reset',
  removed = 'removed',
  accountBlocked = 'account_blocked',
  accountUnblocked = 'account_unblocked',
}

/** Restricted/hidden for template audits */
export type RestrictedAuditEvents =
  | AuditEvent.gptEvent
  | AuditEvent.templateBootstrapped
  | AuditEvent.accountBlocked
  | AuditEvent.accountUnblocked;

/** Audit events we don't surface to the UI for now */
export const HIDE_AUDIT_EVENTS: RestrictedAuditEvents[] = [
  AuditEvent.gptEvent,
  AuditEvent.templateBootstrapped,
  AuditEvent.accountBlocked,
  AuditEvent.accountUnblocked,
];

export type DynamicAttributes = {
  [attributeName: string]:
    | string
    | Date
    | number
    | boolean
    | string[]
    | undefined;
};

export enum BentoEvents {
  account = 'bento_account_identified',
  user = 'bento_account_user_identified',
}

export interface BentoInstance extends PublicBentoInstance {
  setPreviewData(
    previewId: string,
    data: PreviewDataPack,
    ff: EmbedFormFactor
  ): void;
  removePreviewData(previewId: string): void;
}

export type BentoSettings = PreviewSettings &
  PublicBentoSettings & {
    /**
     * Internal key for extension to identify its own settings
     * @private
     */
    chromeExtension?: boolean;
    /**
     * Internal key for extension to identify its own settings
     * @todo remove after
     * @deprecated use `chromeExtension` instead
     * @private
     */
    onigiri?: boolean;
    /** Was this identify triggered from the old automatic initialization logic */
    autoIdentify?: boolean;
    /** Whether we can possibly hydrate from client-side persistence */
    canHydrateFromPersistence?: boolean;
  };

/**
 * Enums need to be exported normally, whereas interfaces/types need to
 * be exported using `export type`.
 */
export {
  GroupCondition,
  TargetingType,
  ModuleTargetingRuleType,
  StepAutoCompleteBaseOn,
  TargetValueType,
  RuleTypeEnum,
  LongRuleTypeEnum,
} from './targeting';

export type {
  IntegrationApiKeyTargetingSegment,
  InlineEmbedTargetingSegment,
  InlineEmbedTargeting,
  AutolaunchRulesData,
  AutolaunchTargetsData,
  IntegrationApiKeyTargeting,
  AttributeRuleArgs,
} from './targeting';

export enum StepSeparationType {
  border = 'border',
  box = 'box',
}

export enum ActiveStepShadow {
  none = 'none',
  standard = 'standard',
  custom = 'custom',
}

export type StepSeparationStyle = {
  type: StepSeparationType;
  boxCompleteBackgroundColor?: string;
  boxActiveStepShadow: ActiveStepShadow;
  boxBorderRadius: number;
};

/** Org level */
export type TooltipsStyle = {
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  shadow: AnnouncementShadow;
};

/** Org level */
export type CtasStyle = {
  fontSize: number;
  lineHeight: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
};

/** Org level */
export type ModalsStyle = {
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  backgroundOverlayColor: string;
  backgroundOverlayOpacity: number;
  shadow: AnnouncementShadow;
};

/** Org level */
export type BannersStyle = {
  borderRadius: number;
  padding: BannerPadding;
  shadow: AnnouncementShadow;
};

/** Org level */
export type InlineContextualStyle = {
  borderRadius: number;
  padding: number;
  shadow: InlineContextualShadow;
  borderColor?: string;
};

export type AllGuidesStyle = {
  allGuidesTitle: string;
  activeGuidesTitle: string;
  previousGuidesTitle: string;
  previousAnnouncementsTitle: string;
};

export type ResponsiveVisibility = {
  all: ResponsiveVisibilityBehavior;
};

export enum StepCtaType {
  complete = 'complete',
  skip = 'skip',
  save = 'save',
  url = 'url',
  event = 'event',
  launch = 'launch',
  urlComplete = 'url_complete',
  back = 'back',
  next = 'next',
}

export enum StepCtaStyle {
  solid = 'solid',
  outline = 'outline',
  link = 'link',
}

export enum CtaColorFields {
  primaryColorHex = 'primaryColorHex',
  secondaryColorHex = 'secondaryColorHex',
  guideBackgroundColor = 'guideBackgroundColor',
  guideTextColor = 'guideTextColor',
  white = 'white',
}

export type StepCtaSettings = {
  bgColorField: string;
  textColorField: string;
  eventName?: string;
  markComplete?: boolean;
  opensInNewTab?: boolean;
  /** Mainly used in miso for conditional UI.  */
  implicit?: boolean;
};

export enum DefaultStepCtaText {
  markAsComplete = 'Mark as complete',
  done = 'Done',
  saveForLater = 'Save for later',
  readMore = 'Read more',
  learnMore = 'Learn more',
  next = 'Next',
  back = 'Back',
  skip = 'Skip',
  tryIt = 'Try it!',
  submit = 'Submit',
  continue = 'Continue',
}

export interface CtaInput {
  entityId?: string;
  text: string;
  url?: string | null;
  type: StepCtaType;
  /** The entity id of the destination guide template when type is `launch` */
  destinationGuide?: string;
  style: StepCtaStyle;
  settings?: StepCtaSettings;
}

export enum StepAutoCompleteInteractionType {
  click = 'click',
}

export enum StepInputFieldType {
  text = 'text',
  paragraph = 'paragraph',
  email = 'email',
  nps = 'nps',
  numberPoll = 'numberPoll',
  dropdown = 'dropdown',
  date = 'date',
}

export type StepAutoCompleteInteractionInput = {
  entityId?: string;
  url: string;
  wildcardUrl: string;
  type: StepAutoCompleteInteractionType;
  elementSelector: string;
  elementText?: string | null;
  elementHtml?: string | null;
};

export type NewStepAutoCompleteInteractionInput = {
  url?: string;
};

export type DropdownInputOption = { label: string; value: string };
export enum DropdownInputVariation {
  dropdown = 'dropdown',
  cards = 'cards',
}

export interface StepInputFieldSettings {
  required?: boolean;
  helperText?: string;
  placeholder?: string | null;
  minValue?: number;
  minLabel?: string;
  maxValue?: number;
  maxLabel?: string;
  variation?: DropdownInputVariation;
  multiSelect?: boolean;
  options?: DropdownInputOption[];
}

export interface StepInputFieldInput {
  entityId?: string;
  label: string | null;
  type: StepInputFieldType;
  settings: StepInputFieldSettings;
}

export type StepAutoCompleteRule = {
  propertyName: string;
  valueType: 'text' | 'boolean' | 'date' | 'number';
  ruleType:
    | LongRuleTypeEnum.lt
    | LongRuleTypeEnum.lte
    | LongRuleTypeEnum.equals
    | LongRuleTypeEnum.gte
    | LongRuleTypeEnum.gt;
  numberValue?: number;
  textValue?: string;
  booleanValue?: boolean;
  dateValue?: string;
};

/** @todo move over to `common/types/stepAutoComplete` */
export interface StepEventMappingInput {
  eventName: string;
  completeForWholeAccount?: boolean;
  rules?: StepAutoCompleteRule[];
}

export enum VerticalAlignmentEnum {
  top = 'top',
  bottom = 'bottom',
  center = 'center',
}

export enum AlignmentEnum {
  left = 'left',
  center = 'center',
  right = 'right',
}

export enum FillEnum {
  unset = 'unset',
  original = 'original',
  full = 'full',
  marginless = 'marginless',
}

/**
 * Use for template creation
 * operations in the admin UI.
 */
export enum OnCreateBehavior {
  openAiModal = 'openAiModal',
  openVisualBuilder = 'openVisualBuilder',
}

export enum WysiwygEditorNewType {
  tag = 'tag',
  inline = 'inline',
  flow = 'flow',
}

export type WysiwygEditorNewTemplate = {
  templateEntityId: string;
  type: WysiwygEditorNewType;
  onCreateBehavior: OnCreateBehavior;
};

export enum VisualBuilderSessionType {
  Tag = 'tag',
  Inline = 'inline',
  Autocomplete = 'autocomplete',
  AutoGuideBuilder = 'auto_guide_builder',
}

export enum VisualBuilderSessionState {
  PendingUrl = 'pending_url',
  InProgress = 'in_progress',
  Cancelled = 'cancelled',
  Complete = 'complete',
}

export type NewTemplateFlag = {
  templateEntityId: string;
};

export enum WysiwygEditorMode {
  navigate = 'navigate',
  selectElement = 'selectElement',
  confirmElement = 'confirmElement',
  recordInfo = 'recordInfo',
  customize = 'customize',
  customizeContent = 'customizeContent',
  preview = 'preview',
}

export enum WysiwygEditorLabels {
  navigate = 'Navigate',
  build = 'Build',
  preview = 'Preview',
  edit = 'Edit',
  record = 'Record',
}

export enum WysiwygEditorHelperText {
  navigate = 'Navigate to the page you want the element to appear',
  build = 'Select your anchor element and customize',
  buildWithContent = 'Select your anchor element, customize and add content',
  preview = 'Preview what your experience looks like and behaves for your end users',
  record = 'Record your actions',
  recordEdit = 'Edit your actions',
  aiSave = 'AI building your guide...',
}

export type WysiwygEditorProgress<M = WysiwygEditorMode> = {
  // @ts-ignore
  [key in M]: boolean;
};

export enum WysiwygEditorRecorderType {
  manual = 'manual',
  auto = 'auto',
}

export type WysiwygEditorMeta = {
  /**
   * Increases the iframe height as needed
   * when there are additional UI elements other
   * than the navigation bar.
   */
  extraHeight?: number;
  /**
   * Indicates that user clicks
   * are being recorded to prevent the
   * editor state from advancing on
   * select.
   */
  recorderType?: WysiwygEditorRecorderType;
  /**
   * Removes all editing capabilties
   * of the editor.
   */
  viewOnly?: boolean;
};

export type WysiwygEditorRecordedAction = {
  url: string;
  elementSelector: string;
  elementText: string;
  elementType: string;
  elementHtml: string;
  action: string;
  isSame?: boolean;
};

export type WysiwygEditorState<D, M = WysiwygEditorMode> = {
  data: D;
  url: string;
  wildcardUrl: string;
  elementSelector: string;
  elementText?: string;
  elementHtml?: string;
  mode: M;
  modes: M[];
  type: WysiwygEditorType;
  initialLoad?: boolean;
  pageText?: string;
  recordedActions?: WysiwygEditorRecordedAction[];
  redirectTo?: string;
} & Pick<WysiwygEditorMeta, 'recorderType' | 'viewOnly'>;

export type WysiwygEditorPreviewData<D, M = WysiwygEditorMode> = {
  data: D;
  enabledFeatureFlags: string[];
  guide?: FullGuide;
  initialLoad: boolean | undefined;
  mode: M;
  viewOnly?: boolean;
};

export type WysiwygEditorSaveData<D> = {
  data: D;
  url: string;
  wildcardUrl: string;
  elementSelector: string;
  elementText?: string;
  elementHtml?: string;
};

export enum WysiwygEditorType {
  tagEditor = 'tagEditor',
  autocompleteElementEditor = 'autocompleteElementEditor',
  inlineInjectionEditor = 'inlineInjectionEditor',
  autoGuideBuilder = 'autoGuideBuilder',
}

export type WysiwygPostMessageAction<D, M = WysiwygEditorMode> =
  | { action: 'resetElementSelector'; payload: { elementSelector: string } }
  | { action: 'showPopup' }
  | { action: 'showEditor' }
  | { action: 'collapseEditor' }
  | { action: 'expandEditor' }
  | { action: 'hidePopup' }
  | { action: 'initializeElementSelector' }
  | { action: 'endElementSelection' }
  | {
      action: 'previewData';
      payload: WysiwygEditorPreviewData<D, M> & {
        elementSelector?: string;
        wildcardUrl?: string;
        type?: string;
      };
    }
  | { action: 'resetElementSelector' }
  | { action: 'close' }
  | { action: 'wildcardUrl'; payload: { url: string } }
  | { action: 'regenerateSelector'; payload: { reset?: boolean } }
  | { action: 'fullHeightEditor'; payload: { fullHeight: boolean } }
  | { action: 'redirectPage'; payload: { url: string } };

export type TagEditorData = {
  /** Tagged elements to be fed to the shoyu main store. */
  allTaggedElements: TaggedElement[];
  /** Guide to be used for the preview. */
  guide: FullGuide | null;
  /** The current mode for the WYSIWYG editor. */
  mode?: WysiwygEditorMode;
  /** The current tag being edited. */
  taggedElement: TaggedElement;
  /** Whether all edit functionality is disabled. */
  viewOnly?: boolean;
};

export type AutocompleteElementEditorData = {
  type: StepAutoCompleteInteractionType;
};

export type AutoGuideBuilderData = {
  templateEntityId: string;
  /* Only set from the WYSIWYG editor. */
  newModule?: TemplateModuleValue;
};

export enum InjectionPosition {
  inside = 'inside',
  before = 'before',
  after = 'after',
}

export enum InjectionAlignment {
  center = 'center',
  left = 'left',
  right = 'right',
}

export type InlineInjectionEditorData = {
  inlineEmbed: Omit<InlineEmbed, 'entityId'> & {
    entityId?: InlineEmbedEntityId;
  };
};

export type ContextualComponentType =
  | GuideFormFactor.sidebar
  | GuideFormFactor.tooltip
  | GuideFormFactor.inline;

export enum AllTaggedElementsOrderBy {
  step = 'step',
  url = 'url',
  type = 'type',
  template = 'template',
}

export enum QATool {
  rollup = 'rollup',
  bulkPause = 'bulkPause',
  analyticsBackfill = 'analyticsBackfill',
  launchDiagnostics = 'launchDiagnostics',
  availableGuides = 'availableGuides',
  massClone = 'massClone',
  clearFeatureFlagCache = 'clearFeatureFlagCache',
  getFFs = 'getFFs',
  setFF = 'setFF',
}

/** Admin requests that require socket messaging */
export enum AdminRequests {
  stepProgressRequest = 'stepProgressRequest',
  templateProgress = 'templateProgress',
  uploadUserAttributes = 'uploadUserAttributes',
  guideAnswers = 'guideAnswers',
  ctaReport = 'ctaReport',
  branchingReport = 'branchingReport',
}

export type StepProgressRequest = {
  type: AdminRequests.stepProgressRequest;
  organizationEntityId: string;
  dateOptions: { start: string; end: string };
};

export type TemplateProgressRequest = {
  type: AdminRequests.templateProgress;
  organizationEntityId: string;
  templateEntityId: string;
  getSeens?: boolean;
};

export type UploadUserAttributesRequest = {
  organizationEntityId: string;
  type: AdminRequests.uploadUserAttributes;
  data: string;
  attributeName: string;
  attributeType: AttributeType;
  defaultAttributeValue?: string;
};

export type GuideAnswersRequest = {
  type: AdminRequests.guideAnswers;
  organizationEntityId: string;
  templateEntityId: string;
};

export type CtaReportRequest = {
  type: AdminRequests.ctaReport;
  organizationEntityId: string;
  templateEntityId: string;
};

export type BranchingReportRequest = {
  type: AdminRequests.branchingReport;
  organizationEntityId: string;
  templateEntityId: string;
};

export type AdminRequestMessage =
  | StepProgressRequest
  | TemplateProgressRequest
  | UploadUserAttributesRequest
  | GuideAnswersRequest
  | CtaReportRequest
  | BranchingReportRequest;

export enum DataSource {
  bento = 'bento',
  snippet = 'snippet',
  import = 'import',
  api = 'api',
}

export enum SplitTestState {
  draft = 'draft',
  live = 'live',
  stopped = 'stopped',
  none = 'none',
  deleted = 'deleted',
}

export enum DiagnosticStates {
  healthy = 'healthy',
  warning = 'warning',
  critical = 'critical',
  noData = 'noData',
}

export enum DiagnosticModules {
  successfulInitialization = 'successfulInitialization',
  validAccountUserIds = 'validAccountUserIds',
  hasRecommendedAttributes = 'hasRecommendedAttributes',
  hardCodedUsers = 'hardCodedUsers',
  hardCodedAccounts = 'hardCodedAccounts',
  inconsistentTypes = 'inconsistentTypes',
  nonIsoDates = 'nonIsoDates',
}

export enum GuideCategory {
  content = 'content',
  splitTest = 'splitTest',
  all = 'all',
}

export enum EventHookType {
  Ping = 'ping',
  All = 'all',
  GuideViewed = 'guideViewed',
  StepViewed = 'stepViewed',
  GuideCompleted = 'guideCompleted',
  StepCompleted = 'stepCompleted',
}

export enum WebhookType {
  standard = 'standard',
}

/** Settings for notifications. This is a blocklist. */
export type NotificationSettings = {
  disable?: boolean;
  branching?: boolean;
  input?: boolean;
  action?: boolean;
  info?: boolean;
  /** Future support for disable specific steps by sp.id */
  steps?: number[];
};

export enum GuideHeaderType {
  simple = 'simple',
  bright = 'bright',
  classic = 'classic',
  striped = 'striped',
}

export type GuideHeaderTypeFlags = {
  isSimpleHeader: boolean;
  isBrightHeader: boolean;
  isClassicHeader: boolean;
  isStripedHeader: boolean;
};

export enum GuideHeaderProgressBar {
  sections = 'sections',
  continuous = 'continuous',
}

export enum GuideHeaderCloseIcon {
  downArrow = 'downArrow',
  x = 'x',
  minimize = 'minimize',
}

export type GuideHeaderSettings = {
  type: GuideHeaderType;
  progressBar?: GuideHeaderProgressBar;
  closeIcon: GuideHeaderCloseIcon;
  showModuleNameInStepView: boolean;
};

export type ContextTagTypeDimensionsType = {
  [key in ContextTagType]: { width: number; height: number; padding: number };
};

export enum VisualTagPulseLevel {
  none = 'none',
  standard = 'standard',
}

export enum VisualTagHighlightType {
  solid = 'solid',
  halo = 'halo',
  none = 'none',
  overlay = 'overlay',
}

export type VisualTagHighlightSettings = {
  type?: VisualTagHighlightType;
  pulse?: boolean;
  color?: string;
  thickness?: number;
  padding?: number;
  radius?: number;
  opacity?: number;
  text?: string;
};

export const DEFAULT_FLOW_TAG_TYPE = ContextTagType.highlight;
export const DEFAULT_FLOW_TAG_STYLE: VisualTagHighlightSettings = {
  type: VisualTagHighlightType.solid,
  color: '#00000000',
  pulse: false,
  radius: 4,
  padding: 2,
  thickness: 4,
  opacity: 0.2,
};

export type VisualTagStyleSettings = VisualTagHighlightSettings;

export type Cancelable<C extends Function> = C & {
  cancel?: () => void;
};

export enum StepBodyOrientation {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

export enum MediaOrientation {
  Left = 'left',
  Right = 'right',
}

export enum VerticalMediaOrientation {
  top = 'top',
  bottom = 'bottom',
}

export enum CtasOrientation {
  left = 'left',
  right = 'right',
  spaceBetween = 'spaceBetween',
  inline = 'inline',
}

export enum EmbedSidebarSide {
  Left = 'left',
  Right = 'right',
}

/** Supported embed video platforms */
export enum VideoPlatforms {
  Youtube = 'youtube',
  Wistia = 'wistia',
  Loom = 'loom',
  Vidyard = 'vidyard',
  Vimeo = 'vimeo',
}

export enum IntegrationType {
  zendesk = 'zendesk',
}

export enum InlineEmbedState {
  active = 'active',
  inactive = 'inactive',
}

export type OrgAdditionalColor = {
  value: string;
};

export type BodyPadding = {
  x?: number;
  l?: number;
  r?: number;
  y?: number;
  t?: number;
  b?: number;
};

export enum GuideCompletionState {
  incomplete = 'incomplete',
  complete = 'complete',
  done = 'done',
}

export enum DiagnosticEventNames {
  directCall = 'directCall',
  unnecessaryReset = 'unnecessaryReset',
  duplicateIdentify = 'duplicateIdentify',
  multipleSidebars = 'multipleSidebars',
  validationFailure = 'validationFailure',
  rapidInitializations = 'rapidInitializations',
  excessiveInitializations = 'excessiveInitializations',
  deprecatedIdentifyCall = 'deprecatedIdentifyCall',
}

export enum OrgState {
  Active = 'active',
  Inactive = 'inactive',
  Trial = 'trial',
}

export enum AudienceState {
  active = 'active',
  inactive = 'inactive',
}

export type OrgOptions = {
  allottedGuides: number;
  controlSyncing?: number;
  eventRateLimit?: number;
  stepGptUsageLimit?: number;
  stepGptUsageCount?: number;
  usesSfdcSandbox?: boolean;
};

export enum GuidesListEnum {
  all = 'all',
  onboarding = 'onboarding',
  previousOnboarding = 'previousOnboarding',
  previousAnnouncement = 'previousAnnouncement',
}

export enum BreakPoints {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

export type QuickLink = {
  url: string;
  title: string;
  icon?: string;
};

/** One of the most useful utility types in our library: QLs but an array */
export type QuickLinks = QuickLink[];

/**
 * Should map to messages, not used on its own
 */
export enum GptErrors {
  apiError = 'apiError',
  limitReached = 'limitReached',
  responseTimeout = 'Response timeout',
  noContent = 'noContent',
  tokenError = 'tokenError',
  /** Invalid or missing response from GPT */
  malformedJson = 'malformedJson',
  staticScrapeError = 'staticScrapeError',
  scrapeError = 'scrapeError',
  /** Request was cancelled. Ignore */
  cancelled = 'cancelled',
}

/**
 * Article generation method
 */
export enum GptMethod {
  baseScraper = 'baseScraper',
  externalScraper = 'externalScraper',
  transcript = 'transcript',
  article = 'article',
  flowBuilder = 'flowBuilder',
}

export enum HelpCenterSource {
  intercom = 'intercom',
  salesforce = 'salesforce',
  helpscout = 'helpscout',
  zendesk = 'zendesk',
}

export type HelpCenter = {
  source: HelpCenterSource;
  url: string;
  issueSubmission?: boolean;
  liveChat?: boolean;
  targeting?: CommonTargeting;
  kbSearch?: boolean;
};

export type HelpCenterStyle = {
  supportTicketTitle?: string;
  chatTitle?: string;
};

export enum RulesDisplayType {
  plain,
  gray,
  warning,
}

export enum CustomApiEventEntityType {
  account = 'account',
  user = 'user',
}

export type {
  BentoSDK,
  GetEventMetadataOptions,
  GetEventMetadataResult,
} from '@bentoapp/types';

export type TagInput = {
  entityId?: string;
  alignment?: ContextTagAlignment;
  elementHtml?: string | null;
  elementSelector?: string;
  elementText?: string | null;
  relativeToText?: boolean;
  style?: VisualTagStyleSettings;
  tooltipAlignment: ContextTagTooltipAlignment;
  type: ContextTagType;
  url: string;
  wildcardUrl: string;
  xOffset: number;
  yOffset: number;
};

export type InlineEmbedInput = {
  entityId?: string;
  borderRadius: number;
  leftMargin: number;
  rightMargin: number;
  bottomMargin: number;
  topMargin: number;
  padding: number;
  elementSelector: string;
  position: InjectionPosition;
  url: string;
  wildcardUrl: string;
  alignment?: InjectionAlignment;
  maxWidth?: number;
  state?: InlineEmbedState;
};

/**
 * Extends any object with an entityId key.
 * Useful for composing types for update-related tasks.
 **/
export type WithEntityId<T> = T & {
  entityId: string;
};

export enum RankableType {
  guide = 'guide',
  survey = 'survey',
}

export type RankableObject = {
  entityId: string;
  priorityRanking: number;
  type: RankableType;
};

/**
 * Varieties of library components
 * Each maps to an option in the library/components
 */
export enum ComponentType {
  cyoa = 'CYOA',
  splitTest = 'Split test',
  onboarding = 'Onboarding',
  flow = 'Flow',
  tooltip = 'Tooltip',
  contextual = 'Contextual',
  modal = 'Modal',
  banner = 'Banner',
  card = 'Card',
  carousel = 'Carousel',
  videoGallery = 'Video gallery',
}

/**
 * Internal properties of an account user that influences app behavior
 */
export interface AccountUserProperties {
  /** If user has been exposed to sidebar onboarding */
  onboardedSidebar?: boolean;
}
