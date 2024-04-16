import React, { useContext } from 'react';
import {
  CustomUIContext,
  CustomUIProviderValue,
} from '../providers/CustomUIProvider';

export default function withCustomUIContext<
  OuterP extends object,
  P extends OuterP & Partial<CustomUIProviderValue> = OuterP &
    Partial<CustomUIProviderValue>
>(WrappedComponent: React.ComponentType<P>) {
  const hoc = React.forwardRef<any, OuterP>((props, ref) => {
    const customUIContextValue = useContext(
      CustomUIContext
    ) as Partial<CustomUIProviderValue>;
    return (
      <WrappedComponent
        {...({ ...customUIContextValue, ...props } as P)}
        ref={ref}
      />
    );
  });
  hoc.displayName = 'withCustomUIContext';
  return hoc;
}
