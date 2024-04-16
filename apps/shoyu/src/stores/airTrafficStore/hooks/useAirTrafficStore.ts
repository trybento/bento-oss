import create, { GetState, Mutate, SetState, StoreApi } from 'zustand';

import airTrafficStore from '..';
import { AirTrafficStore } from '../types';

const useAirTrafficStore = create<
  AirTrafficStore,
  SetState<AirTrafficStore>,
  GetState<AirTrafficStore>,
  Mutate<
    StoreApi<AirTrafficStore>,
    [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]]
  >
>(airTrafficStore);

export default useAirTrafficStore;
