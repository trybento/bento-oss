import create, { GetState, Mutate, SetState, StoreApi } from 'zustand';

import sessionStore from '..';
import { SessionStoreState } from '../types';

const useSessionStore = create<
  SessionStoreState,
  SetState<SessionStoreState>,
  GetState<SessionStoreState>,
  Mutate<
    StoreApi<SessionStoreState>,
    [['zustand/subscribeWithSelector', never]]
  >
>(sessionStore);

export default useSessionStore;
