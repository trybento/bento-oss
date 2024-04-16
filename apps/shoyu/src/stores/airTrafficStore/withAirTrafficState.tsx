import React from 'react';
import shallow from 'zustand/shallow';

import { AirTrafficStore } from './types';
import useAirTrafficStore from './hooks/useAirTrafficStore';

export type AirTrafficStoreSelector<P extends object, R extends object> = (
  state: AirTrafficStore,
  props: P
) => R;

/**
 * @todo memoize selector based on observed props (new arg)
 */
const withAirTrafficState =
  <P extends object, R extends object>(
    selector: AirTrafficStoreSelector<P, R>,
    comparison?: (a: any, b: any) => boolean
  ) =>
  (WrappedComponent: React.ComponentType<P & R>) => {
    const hoc = React.forwardRef<any, P>((props, _ref) => {
      const storeData = useAirTrafficStore(
        (state) => selector(state, props),
        comparison || shallow
      );
      return <WrappedComponent {...props} {...storeData} />;
    });
    hoc.displayName = 'withAirTrafficState';
    return hoc;
  };
export default withAirTrafficState;
