import React, { useContext } from 'react';

import {
  SidebarContext,
  SidebarProviderValue,
} from '../providers/SidebarProvider';

export default function withSidebarContext(
  WrappedComponent: React.ComponentType
): React.ForwardRefExoticComponent<
  Exclude<React.ComponentProps<typeof WrappedComponent>, SidebarProviderValue>
> {
  const hoc = React.forwardRef(
    (props: React.ComponentProps<typeof WrappedComponent>, _r) => (
      <WrappedComponent {...useContext(SidebarContext)} {...props} />
    )
  );
  hoc.displayName = 'withSidebarContext';
  return hoc;
}
