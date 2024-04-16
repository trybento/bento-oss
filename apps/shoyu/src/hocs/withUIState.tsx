import React, { useContext } from 'react';

import {
  UIStateContext,
  UIStateContextValue,
} from '../providers/UIStateProvider';

export default function withUIState<
  OuterP extends object,
  P extends OuterP & Partial<UIStateContextValue>
>(
  WrappedComponent: React.ComponentType<P>
): React.ForwardRefExoticComponent<any> {
  const hoc = React.forwardRef((props: P, ref) => {
    const legacyUIStateContextValue = useContext(UIStateContext);
    return (
      <WrappedComponent {...legacyUIStateContextValue} {...props} ref={ref} />
    );
  });
  hoc.displayName = 'withUIState';
  return hoc;
}
