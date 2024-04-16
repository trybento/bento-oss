import { useEffect } from 'react';

import { createResizeObserver } from '../utils/dom';

type Options = {
  disabled?: boolean;
};

export default function useResizeObserver(
  cb: Parameters<typeof createResizeObserver>[0],
  {
    disabled,
    ...opts
  }: Options & Parameters<typeof createResizeObserver>[1] = {}
) {
  useEffect(() => {
    const resizeObserver = !disabled
      ? createResizeObserver(cb, opts)
      : undefined;
    return () => resizeObserver?.cancel();
  }, [cb, disabled, ...(opts ? Object.values(opts) : [])]);
}
