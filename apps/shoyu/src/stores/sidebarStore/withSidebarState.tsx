import React from 'react';
import shallow from 'zustand/shallow';
import useSidebarStore from './useSidebarStore';
import { SidebarStoreState } from './types';

export type SidebarStoreSelector<P extends object, R extends object> = (
  state: SidebarStoreState,
  props: P
) => R;

const withSidebarState =
  <P extends object, R extends object>(selector: SidebarStoreSelector<P, R>) =>
  (
    WrappedComponent: React.ComponentType<P & R>
  ): React.ForwardRefExoticComponent<P> => {
    const hoc = React.forwardRef((props: P, _ref) => {
      const storeData = useSidebarStore(
        (state) => selector(state, props),
        shallow
      );
      return <WrappedComponent {...props} {...storeData} />;
    });
    hoc.displayName = 'withSidebarState';
    // @ts-ignore
    return hoc;
  };
export default withSidebarState;
