import create, { GetState, Mutate, SetState, StoreApi } from 'zustand/vanilla';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import produce from 'immer';

import {
  GlobalSessionState,
  SessionStoreState,
  InitializationDataPayload,
  KbSessionData,
} from './types';
import initializationDataLoader from './loaders/initializationDataLoader';
import initializationDataChanged from './actions/initializationDataChanged';
import sessionDataSet from './actions/sessionDataSet';
import { isDevtoolsEnabled } from '../../lib/debug';
import errorBoundary from '../middleware/errorBoundary';
import { persist, StorePersist } from '../middleware/persist';
import {
  getPersistenceVersion,
  getVerifierKeyValue,
  reviveDates,
} from '../mainStore/helpers/persistence';

export const initialState: GlobalSessionState = {
  previewSessions: {},
  initialized: undefined,
  kbSessionData: undefined,
};

const sessionStore = create<
  SessionStoreState,
  SetState<SessionStoreState>,
  GetState<SessionStoreState>,
  Mutate<
    StoreApi<SessionStoreState>,
    [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]]
  > &
    StorePersist<GlobalSessionState>
>(
  // @ts-ignore-error
  errorBoundary(
    (isDevtoolsEnabled() ? devtools : (a: any) => a)(
      subscribeWithSelector(
        // @ts-ignore
        persist(
          (set) => ({
            ...initialState,
            hydrateInitializationData: async (withSessionData = true) => {
              const payload =
                await initializationDataLoader<InitializationDataPayload>({
                  withSessionData,
                });
              if (payload) {
                set(
                  produce<SessionStoreState>((state) =>
                    initializationDataChanged(state, payload)
                  ),
                  false,
                  // @ts-ignore
                  'hydrateInitializationData'
                );
              }
            },
            setSessionData: (
              token: string | undefined,
              enabledFeatureFlags: string[] | undefined
            ) => {
              set(
                produce<SessionStoreState>((state) => {
                  sessionDataSet(state, { token, enabledFeatureFlags });
                }),
                false,
                // @ts-ignore
                'setSessionData'
              );
            },
            setPreviewSession: (previewId, data) =>
              set(
                produce<SessionStoreState>((state) => {
                  state.previewSessions[previewId] = data;
                }),
                false,
                // @ts-ignore
                'setPreviewSession'
              ),
            removePreviewSession: (previewId) =>
              set(
                produce<SessionStoreState>((state) => {
                  delete state.previewSessions[previewId];
                }),
                false,
                // @ts-ignore
                'removePreviewSession'
              ),
            setKbSessionData: (kbSessionData: KbSessionData) =>
              set(
                produce<SessionStoreState>((state) => {
                  state.kbSessionData = kbSessionData;
                }),
                false,
                // @ts-ignore
                'setKbSessionData'
              ),
            removeKbSessionData: () =>
              set(
                produce<SessionStoreState>((state) => {
                  delete state.kbSessionData;
                }),
                false,
                // @ts-ignore
                'removePreviewSession'
              ),
          }),
          {
            /**
             * Under which name the state will be persisted within in the storage.
             */
            name: 'bento-sessionStore',
            /**
             * Persisted state time-to-live, in seconds.
             */
            ttl: 600, // 10m
            /**
             * Which client-side storage to use.
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
             * Custom deserialization method used to revive Date objects.
             */
            deserialize: (str) => JSON.parse(str, reviveDates),
          }
        )
      ),
      // @ts-ignore-error
      {
        name: `Bento Session Store - ${window.location.host} - ${document.title}`,
      }
    ),
    'sessionStore'
  )
);

export default sessionStore;
