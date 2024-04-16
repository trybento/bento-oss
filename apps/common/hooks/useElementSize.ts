import { useState } from 'react';
import { debounce, throttle } from '../utils/lodash';
import useCallbackRef from './useCallbackRef';
import useResizeObserver from './useResizeObserver';

type Size = { width: number; height: number };

export default function useElementSize(
  element: HTMLElement | null,
  deduping: 'throttle' | 'debounce',
  defaultValue?: Size
) {
  const [size, setSize] = useState<Size>(
    defaultValue || { width: 0, height: 0 }
  );

  const setElementSize = useCallbackRef(() => {
    if (element) {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    }
  }, [element]);

  const updateElementWidth = useCallbackRef(
    deduping === 'debounce'
      ? debounce(setElementSize, 500)
      : throttle(setElementSize, 32),
    [element],
    { callOnDepsChange: true }
  );

  useResizeObserver(updateElementWidth, { element });

  return size;
}
