import React, { useContext } from 'react';

import {
  FormFactorContext,
  FormFactorContextValue,
} from '../providers/FormFactorProvider';

export default function withFormFactor<
  OuterP extends object,
  P extends OuterP & Partial<FormFactorContextValue>
>(
  WrappedComponent: React.ComponentType<P>
): React.ForwardRefExoticComponent<any> {
  const hoc = React.forwardRef((props: P, ref) => (
    <WrappedComponent {...useContext(FormFactorContext)} {...props} ref={ref} />
  ));
  hoc.displayName = 'withFormFactor';
  return hoc;
}
