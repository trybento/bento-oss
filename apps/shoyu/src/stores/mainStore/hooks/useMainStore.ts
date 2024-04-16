import create, { GetState, Mutate, SetState, StoreApi } from 'zustand';

import mainStore from '..';
import { MainStoreState } from '../types';

const useMainStore = create<
  MainStoreState,
  SetState<MainStoreState>,
  GetState<MainStoreState>,
  Mutate<
    StoreApi<MainStoreState>,
    [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]]
  >
>(mainStore);

export default useMainStore;
