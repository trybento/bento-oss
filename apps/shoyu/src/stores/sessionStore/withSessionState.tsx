import React from 'react';
import shallow from 'zustand/shallow';

import { SessionStoreState } from './types';
import useSessionStore from './hooks/useSessionStore';

export type SessionStoreSelector<P extends object, R extends object> = (
  state: SessionStoreState,
  props: P
) => R;

const withSessionState =
  <P extends object, R extends object>(selector: SessionStoreSelector<P, R>) =>
  (
    WrappedComponent: React.ComponentType<P & R>
  ): React.ForwardRefExoticComponent<P> => {
    const hoc = React.forwardRef((props: P, _ref) => {
      const storeData = useSessionStore(
        (state) => selector(state, props),
        shallow
      );
      return <WrappedComponent {...props} {...storeData} />;
    });
    hoc.displayName = 'withSessionState';
    // @ts-ignore
    return hoc;
  };
export default withSessionState;
