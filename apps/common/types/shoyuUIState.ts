import { ActionNames, ActionPayload, ActionPayloads } from '../types';

export enum View {
  activeGuides = 'activeGuides', // active guide, saved modals, everboarding guides
  allOnboardingGuides = 'allOnboardingGuides',
  previousOnboardingGuides = 'previousOnboardingGuides',
  previousAnnouncements = 'previousAnnouncements',
  ticketForm = 'ticketForm',
  kbArticle = 'kbArticle',
  guide = 'guide',
  step = 'step',
}

export enum InlineEmptyBehaviour {
  show = 'show',
  hide = 'hide',
}

export enum EmbedToggleBehavior {
  /** ALWAYS open to current onboarding guide */
  default = 'default',
  /** ALWAYS open to rc */
  resourceCenter = 'resource_center',
  /** (unused) Open to user's last open view */
  persist = 'persist',
}

export enum ResponsiveVisibilityBehavior {
  show = 'show',
  hide = 'hide',
}

/**
 * Referred to as "Toggle visibility"
 */
export enum SidebarVisibility {
  /** The "always" option; whenever any guides are accessible */
  show = 'show',
  /** If there is Bento content  */
  activeGuides = 'active_guides',
  /** If there are onboarding guides */
  activeOnboardingGuides = 'active_onboarding_guides',
  /** Never show the toggle */
  hide = 'hide',
}

/**
 * Referred to as "Sidebar visibility"
 */
export enum SidebarAvailability {
  /** All behaviors enabled */
  default = 'default',
  /** Disables auto opening behaviors. Manual open only */
  neverOpen = 'never_open',
  /** Completely disable the sidebar */
  hide = 'hide',
}

export enum TransitionDirection {
  left = 'left',
  right = 'right',
}

// this will still be scoped per component
export type UIState = {
  view: View;
  showSuccess: boolean;
  stepTransitionDirection: TransitionDirection;
};

export type ViewChangedAction = { type: 'viewChanged'; view: View };
export type ShowSuccessChangedAction = {
  type: 'showSuccessChanged';
  show: boolean;
};
export type TransitionDirectionChangedAction = {
  type: 'stepTransitionDirectionChanged';
  direction: TransitionDirection;
};

export type UIStateAction =
  | ViewChangedAction
  | ShowSuccessChangedAction
  | TransitionDirectionChangedAction;
export type UIStateActionName = ActionNames<UIStateAction>;
export type UIStateActionPayloads = ActionPayloads<UIStateAction>;
export type UIStateActionPayload<A extends UIStateActionName> = ActionPayload<
  UIStateAction,
  A
>;

export type UIStateActionHandler<A extends UIStateActionName> = (
  payload: UIStateActionPayload<A>
) => void;
export type UIStateActionHandlerMap = {
  [action in UIStateActionName]: UIStateActionHandler<action>;
};
