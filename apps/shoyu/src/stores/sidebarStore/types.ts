import { WritableDraft } from 'immer/dist/internal';
import { MAIN_SIDEBAR_STATE_ID } from './constants';

export type SidebarState = {
  open: boolean;
  isPreview: boolean;
  transitionBetweenViews: boolean;
  shouldAutoOpen: boolean;
  /** Whether the user has manually toggled the sidebar off */
  toggledOffAtLeastOnce: boolean;
};

export type GlobalSidebarState = {
  isInlineEmbedPresent: boolean;
  hiddenViaZendesk: boolean;
  sidebars: {
    [id: typeof MAIN_SIDEBAR_STATE_ID | string]: SidebarState;
  };
  /** Determines if the store has been fully initialized */
  initialized: Date | undefined;
};

type SidebarStoreActions = {
  toggleSidebar: (
    /** Sidebar id */
    id: string,
    /** New sidebar open state */
    open?: boolean,
    /** Whether to record if the sidebar was toggled off the first time */
    recordToggle?: boolean
  ) => void;
  createSidebarState: (id: string, isPreview?: boolean) => void;
  removeSidebarState: (id: string) => void;
  disableTransitions: (id: string) => void;
  enableTransitions: (id: string) => void;
  toggleSidebarAutoOpen: (id: string, autoOpen?: boolean) => void;
  setInlineEmbedPresent: (present: boolean) => void;
  setHiddenViaZendesk: (value: boolean) => void;
};

export type SidebarStoreState = GlobalSidebarState & SidebarStoreActions;

export type WorkingSidebarState =
  | WritableDraft<SidebarStoreState>
  | SidebarStoreState;
