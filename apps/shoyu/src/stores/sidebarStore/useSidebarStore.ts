import create, { GetState, Mutate, SetState, StoreApi } from 'zustand';

import sidebarStore from '.';
import { SidebarStoreState } from './types';

const useSidebarStore = create<
  SidebarStoreState,
  SetState<SidebarStoreState>,
  GetState<SidebarStoreState>,
  Mutate<
    StoreApi<SidebarStoreState>,
    [['zustand/subscribeWithSelector', never]]
  >
>(sidebarStore);

export default useSidebarStore;
