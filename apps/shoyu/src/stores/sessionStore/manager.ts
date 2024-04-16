import { INJECTABLES_CONTAINER_ID } from 'bento-common/utils/constants';
import { debugMessage } from 'bento-common/utils/debugging';
import shallow from 'zustand/shallow';

import sessionStore, { initialState } from '.';
import sidebarStoreManager from '../sidebarStore/manager';
import { autoInjectSidebar } from './helpers';
import { ffSelector } from './helpers/selectors';

const unsubscribersMap: Record<string, () => void> = {};

function unsubscribe(key: string) {
  unsubscribersMap[key]?.();
  delete unsubscribersMap[key];
}

const initialize = () => {
  /**
   * Protect against re-initializing the store with a different account/User,
   * effectively performing a shutdown before anything else.
   */
  if (sessionStore.getState().initialized) {
    shutdown();
  }

  debugMessage('[BENTO] Initializing session store');

  /**
   * Control variable used to make sure we only ever re-hydrate uiSettings the first time we load
   * the page after hydrating from persistence. This is useful to not overload the server with multiple
   * requests when Bento is rapidly initialized after account/User attribute changes, which will necessarily
   * result in a new token.
   */
  let hydratedUiSettings = false;

  // Automatically hydrates whenever the token is changed
  unsubscribersMap['initAfterToken'] = sessionStore.subscribe(
    (state) => state.token,
    (token) => {
      /**
       * Since initialize should be called on every new account/User initialization,
       * and the store should be shutdown before initializing in those cases,
       * it is safe to assume that if we already have any of the hydration data in
       * the store its because we have already hydrated it for the current account/User,
       * meaning we can skip it.
       */
      const { account, accountUser } = sessionStore.getState();
      if (token && !(account && accountUser)) {
        sessionStore.getState().hydrateInitializationData(true);
      } else if (token && !hydratedUiSettings) {
        sessionStore.getState().hydrateInitializationData(false);
        hydratedUiSettings = true;
      }
    },
    { equalityFn: shallow }
  );

  unsubscribersMap['autoInjectSidebar'] = sessionStore.subscribe(
    (state) => state.uiSettings?.injectSidebar,
    (injectSidebar) => {
      if (injectSidebar) {
        autoInjectSidebar(document.getElementById(INJECTABLES_CONTAINER_ID));
      }
    },
    { fireImmediately: true }
  );

  // Attempt to hydrate from client storage
  // NOTE: This should only happen after the above subscribers are set, otherwise they wont be called
  // the first time and some things might not work up until the identify call resolves (i.e. auto-injecting
  // the sidebar component).
  sessionStore.persist.hydrate();

  // mark store as initialized
  sessionStore.setState({ initialized: new Date() }, false, 'storeInitialized');
};

const shutdown = () => {
  debugMessage('[BENTO] Shutting down the session store');

  // Unsubscribe from all
  Object.keys(unsubscribersMap).forEach(unsubscribe);

  // reset state by replacing it with initial state
  sessionStore.setState(initialState);
};

export default {
  initialize,
  shutdown,
};
