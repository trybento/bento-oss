import { debugMessage } from 'bento-common/utils/debugging';

import airTrafficStore, { initialState } from '.';

const initialize = () => {
  /**
   * Protect against re-initializing the store with a different account/User,
   * effectively performing a shutdown before anything else.
   */
  if (airTrafficStore.getState().initialized) shutdown();

  debugMessage('[BENTO] Initializing AirTraffic store');

  airTrafficStore.persist.hydrate();

  /** @todo listen for removed guides and remove from "guidesShown" */

  airTrafficStore.setState(
    { initialized: new Date() },
    false,
    'storeInitialized'
  );
};

const shutdown = () => {
  debugMessage('[BENTO] Shutting down AirTraffic store');

  // reset state
  airTrafficStore.setState(initialState);
};

const airTrafficStoreManager = { initialize, shutdown };
export default airTrafficStoreManager;
