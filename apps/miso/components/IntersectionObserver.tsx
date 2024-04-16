import React, { useCallback } from 'react';
import { InView } from 'react-intersection-observer';

type IntersectionObserverProps = {
  onInView?: () => void;
};

const IntersectionObserver: React.FC<IntersectionObserverProps> = ({
  onInView,
}) => {
  const onChange = useCallback(
    (inView: boolean) => {
      if (inView) onInView?.();
    },
    [onInView]
  );

  return <InView as="div" onChange={onChange} />;
};

export default IntersectionObserver;
