import { GetState, SetState, State, StoreApi } from 'zustand/vanilla';

import { withCatchException } from '../../lib/catchException';

export default function errorBoundary<
  S extends State,
  CustomSetState extends SetState<S> = SetState<S>,
  CustomGetState extends GetState<S> = GetState<S>,
  CustomStoreApi extends StoreApi<S> = StoreApi<S>
>(
  config: (set: CustomSetState, get: CustomGetState, api: CustomStoreApi) => S,
  storeName: string
) {
  return function errorBoundaryInner(
    set: CustomSetState,
    get: CustomGetState,
    api: CustomStoreApi & StoreApi<S>
  ): S {
    return Object.fromEntries(
      Object.entries(config(set, get, api)).map(([key, value]) => [
        key,
        value instanceof Function
          ? withCatchException(value, `${storeName}: ${key}`)
          : value,
      ])
    ) as S;
  };
}
