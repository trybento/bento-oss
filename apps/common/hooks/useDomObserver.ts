import { useEffect } from 'react';

import { createMutationObserver } from '../utils/dom';

type Options = {
  disabled?: boolean;
  observeStylingAttributes?: boolean;
};

export default function useDomObserver(
  cb: Parameters<typeof createMutationObserver>[0],
  {
    disabled,
    ...opts
  }: Options & Parameters<typeof createMutationObserver>[1] = {}
) {
  const { observerOpts, ...otherOpts } = opts;
  useEffect(() => {
    const domObserver = !disabled
      ? createMutationObserver(cb, opts)
      : undefined;
    return () => domObserver?.cancel();
  }, [
    cb,
    disabled,
    ...(observerOpts ? Object.values(observerOpts) : []),
    ...(otherOpts ? Object.values(otherOpts) : []),
  ]);
}
