import { Timeout } from 'bento-common/types';
import { useEffect, useRef, useState } from 'react';

/**
 * Used to delay an ON state.
 * OFF states are applied immediately.
 * Defaults to 1s.
 */
const useDelayedOn = (value: boolean | undefined, delayMs = 1000) => {
  const timeoutRef = useRef<Timeout>();
  const [state, setState] = useState<boolean | undefined>(value);

  useEffect(() => {
    if (value === state) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => {
        setState(value);
      },
      value ? delayMs : 0
    );

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [value]);

  return value && state;
};

export default useDelayedOn;
