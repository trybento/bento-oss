import React from 'react';
import useLocation, { UseLocationState } from 'bento-common/hooks/useLocation';

export type WithLocationPassedProps = { appLocation: UseLocationState };

const withLocation = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithLocationPassedProps>
) => {
  const hoc = React.forwardRef((props: P, ref) => (
    <WrappedComponent appLocation={useLocation()} {...props} ref={ref} />
  ));
  hoc.displayName = 'withLocation';
  return hoc;
};

export default withLocation;
