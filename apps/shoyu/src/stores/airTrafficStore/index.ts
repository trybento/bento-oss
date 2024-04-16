import create, { GetState, Mutate, SetState, StoreApi } from 'zustand/vanilla';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import produce from 'immer';

import { isDevtoolsEnabled } from '../../lib/debug';
import {
  getPersistenceVersion,
  getVerifierKeyValue,
  reviveDates,
} from '../mainStore/helpers/persistence';
import { persist, StorePersist } from '../middleware/persist';
import {
  AirTrafficState,
  AirTrafficStore,
  JourneyStartActionPayload,
} from './types';
import errorBoundary from '../middleware/errorBoundary';
import journeyStarted from './actions/journeyStarted';
import journeyEnded from './actions/journeyEnded';
import registered from './actions/registered';
import desiredStatePushed from './actions/desiredStatePushed';
import stealthModeToggled from './actions/stealthModeToggled';
import { removeEphemeralKeys } from './helpers';

/**
 * This will be our initial state before any actions are dispatched.
 */
export const initialState: AirTrafficState = {
  activeJourney: undefined,
  desiredStateHistory: [],
  guidesShown: [],
  initialized: undefined,
  locked: false,
  sidebarAutoFocused: false,
  sidebarOpen: false,
  stealthMode: false,
};

// @ts-ignore-error
const airTrafficStore = create<
  AirTrafficStore,
  SetState<AirTrafficStore>,
  GetState<AirTrafficStore>,
  Mutate<
    StoreApi<AirTrafficStore>,
    [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]]
  > &
    StorePersist<AirTrafficState>
>(
  errorBoundary(
    (isDevtoolsEnabled() ? devtools : (a: any) => a)(
      // selector middleware
      subscribeWithSelector(
        /** @todo fix types and remove the `@ts-ignore` below */
        // @ts-ignore
        persist(
          (set) => ({
            ...initialState,
            pushDesiredState: (
              args: Parameters<AirTrafficStore['pushDesiredState']>[0]
            ) => {
              return set(
                produce<AirTrafficStore>((state) =>
                  desiredStatePushed(state, args)
                ),
                false,
                // @ts-ignore
                { type: 'pushDesiredState', args }
              );
            },
            toggleStealthMode: (
              args: Parameters<AirTrafficStore['toggleStealthMode']>[0]
            ) => {
              return set(
                produce<AirTrafficStore>((state) =>
                  stealthModeToggled(state, args)
                ),
                false,
                // @ts-ignore
                { type: 'toggleStealthMode', args }
              );
            },
            startJourney: (args: JourneyStartActionPayload) => {
              return set(
                produce<AirTrafficStore>((state) =>
                  journeyStarted(state, args)
                ),
                false,
                // @ts-ignore
                { type: 'startJourney', args }
              );
            },
            endJourney: (
              args: Parameters<AirTrafficStore['endJourney']>[0]
            ) => {
              return set(
                produce<AirTrafficStore>((state) => journeyEnded(state, args)),
                false,
                // @ts-ignore
                { type: 'endJourney', args }
              );
            },
            register: (args: Parameters<AirTrafficStore['register']>[0]) => {
              return set(
                produce<AirTrafficStore>((state) => registered(state, args)),
                false,
                // @ts-ignore
                { type: 'register', args }
              );
            },
            lock: (reason?: string) => {
              return set(
                produce<AirTrafficStore>((state) => {
                  state.locked = true;
                  state.lockedReason = reason;
                }),
                false,
                // @ts-ignore
                { type: 'lock' }
              );
            },
            unlock: () => {
              return set(
                produce<AirTrafficStore>((state) => {
                  state.locked = false;
                  state.lockedReason = undefined;
                }),
                false,
                // @ts-ignore
                { type: 'unlock' }
              );
            },
          }),
          {
            /**
             * Under which name the state will be persisted within in the storage.
             */
            name: 'bento-airTrafficStore',
            /**
             * Persisted state time-to-live, in seconds.
             */
            ttl: Infinity,
            /**
             * Which client-side storage to use.
             *
             * NOTE: This intentionally uses session storage to guarantee the state will be persisted across
             * pages within the same session without persisting it cross-session/tabs.
             */
            getStorage: () => sessionStorage,
            /**
             * Signs the persisted state with AppID, accountId, accountUserId to later
             * determine data ownership and whether or not we should hydrate from it,
             * thus protecting from data leakage.
             */
            getSignature: () => window.btoa(getVerifierKeyValue()),
            /**
             * Sets a version based on the COMMIT_SHA to avoid hydrating potentially
             * incompatible data (i.e. different app version introduces a breaking change).
             */
            version: getPersistenceVersion(),
            /**
             * Prevent some parts of the state from getting persisted.
             */
            serialize: (str) => JSON.stringify(str, removeEphemeralKeys),
            /**
             * Custom deserialization method used to revive Date objects.
             */
            deserialize: (str) => JSON.parse(str, reviveDates),
          }
        )
      ),
      // @ts-ignore-error
      {
        name: `Bento AirTraffic - ${window.location.host} - ${document.title}`,
      }
    ),
    'airTrafficStore'
  )
);

export default airTrafficStore;
