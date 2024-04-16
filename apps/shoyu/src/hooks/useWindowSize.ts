import { useState, useCallback } from 'react';
import { debounce } from 'bento-common/utils/lodash';

import useEventListener from './useEventListener';

interface Size {
  width: number | undefined;
  height: number | undefined;
}

export default function useWindowSize(): Size {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window?.innerWidth,
    height: window?.innerHeight,
  });

  const updateWindowSize = useCallback(
    debounce(() => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, 250),
    []
  );

  useEventListener('window', 'resize', updateWindowSize);

  return windowSize;
}
