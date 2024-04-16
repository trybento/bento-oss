import React from 'react';
import shallow from 'zustand/shallow';
import useMainStore from './hooks/useMainStore';
import { MainStoreState } from './types';

/** @todo fix return type "R" not being enforced by TS */
export type MainStoreSelector<P extends object, R extends object> = (
  state: MainStoreState,
  props: P
) => R;

/** @todo rename to withMainStoreState */
const withMainStoreData =
  <P extends object, R extends object>(
    selector: MainStoreSelector<P, R>,
    comparison?: (a: any, b: any) => boolean
  ) =>
  (WrappedComponent: React.ComponentType<P & R>) => {
    const hoc = React.forwardRef<any, P>((props, _ref) => {
      const storeData = useMainStore(
        (state) => selector(state, props),
        comparison || shallow
      );
      return <WrappedComponent {...props} {...storeData} />;
    });
    hoc.displayName = 'withMainStoreData';
    // @ts-ignore
    return hoc;
  };
export default withMainStoreData;

export type WithMainStoreDispatchData = {
  dispatch: MainStoreState['dispatch'];
};

export const withMainStoreDispatch = withMainStoreData<
  {},
  WithMainStoreDispatchData
>((s) => ({ dispatch: s.dispatch }));
