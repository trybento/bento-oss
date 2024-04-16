import React, { useContext } from 'react';
import {
  ContextualTagContext,
  ContextualTagProviderValue,
} from '../providers/ContextualTagProvider';

export default function withContextualTagContext<P>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithContextualTagContext: React.FC<
    Exclude<
      React.ComponentProps<typeof WrappedComponent>,
      ContextualTagProviderValue
    >
  > = (props) => (
    <WrappedComponent {...useContext(ContextualTagContext)} {...props} />
  );
  return WithContextualTagContext;
}
