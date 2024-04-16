import {
  ClientStorage,
  readFromClientStorage,
} from 'bento-common/utils/clientStorage';
import { debugMessage } from 'bento-common/utils/debugging';

import sidebarStore, { initialState } from '.';
import {
  MAIN_SIDEBAR_STATE_ID,
  SIDEBAR_EXPANDED_PERSISTED_KEY,
} from './constants';

const unsubscribersMap: Record<string, () => void> = {};

function handleOpenSidebar() {
  debugMessage('[BENTO] Toggling sidebar open after event');
  sidebarStore.getState().toggleSidebar(MAIN_SIDEBAR_STATE_ID, true);
}

function handleCloseSidebar() {
  debugMessage('[BENTO] Toggling sidebar closed after event');
  sidebarStore.getState().toggleSidebar(MAIN_SIDEBAR_STATE_ID, false);
}

function initialize() {
  /**
   * Protect against re-initializing the store with a different account/User,
   * effectively performing a shutdown before anything else.
   */
  if (sidebarStore.getState().initialized) {
    shutdown();
  }

  debugMessage('[BENTO] Initializing sidebar store');

  const search = new URLSearchParams(window.location.search);
  const openFromQueryParams = search.get(SIDEBAR_EXPANDED_PERSISTED_KEY);
  const selectedStepFromQueryParams = search.get('bento-initialSelectedStep');
  const openFromLocalStorage = readFromClientStorage(
    ClientStorage.sessionStorage,
    SIDEBAR_EXPANDED_PERSISTED_KEY
  ) as boolean | string | undefined;

  sidebarStore.getState().toggleSidebar(
    MAIN_SIDEBAR_STATE_ID,
    !!openFromQueryParams ||
      !!selectedStepFromQueryParams ||
      openFromLocalStorage === true ||
      openFromLocalStorage === 'true',
    false // shouldn't record this toggled state
  );

  // we still have these in the docs and I believe we have at least one
  // customer using them so they have to stay for now. In the future these
  // will be deprecated in favor of functions on `window.Bento` or in a JS SDK
  document.addEventListener('bento-sidebarOpen', handleOpenSidebar);
  document.addEventListener('bento-sidebarClose', handleCloseSidebar);

  // mark store as initialized
  sidebarStore.setState({ initialized: new Date() }, false, 'storeInitialized');
}

const shutdown = () => {
  debugMessage('[BENTO] Shutting down the sidebar store');

  // remove event listeners
  document.removeEventListener('bento-sidebarOpen', handleOpenSidebar);
  document.removeEventListener('bento-sidebarClose', handleCloseSidebar);

  // Unsubscribe from all
  Object.keys(unsubscribersMap).forEach((key: string) => {
    unsubscribersMap[key]?.();
    delete unsubscribersMap[key];
  });

  // reset state
  sidebarStore.setState(initialState);
};

const sidebarStoreManager = {
  initialize,
  shutdown,
};
export default sidebarStoreManager;
