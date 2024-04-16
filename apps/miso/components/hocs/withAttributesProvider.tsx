import React from 'react';
import AttributesProvider, {
  useAttributes,
} from 'providers/AttributesProvider';

export default function withAttributesProvider<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const hoc = React.forwardRef((props: P, ref) => {
    const { initialized } = useAttributes();
    return initialized ? (
      <WrappedComponent {...props} ref={ref} />
    ) : (
      <AttributesProvider>
        <WrappedComponent {...props} ref={ref} />
      </AttributesProvider>
    );
  });
  hoc.displayName = 'withAttributesProvider';
  return hoc;
}
