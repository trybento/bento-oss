import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useWindowFocus from './useWindowFocused';

/**
 * Time how long a component was mounted in seconds
 */
const useMountedTimer = (callback: (time: number) => void): void => {
  const time = useRef(0);
  const timer = useRef(null);
  const windowFocused = useWindowFocus();

  useEffect(() => {
    time.current = 0;
    return () => {
      callback(time.current);
    };
  }, []);

  /** Do the timing */
  useEffect(() => {
    if (windowFocused) {
      timer.current = setInterval(() => {
        time.current = time.current + 1;
      }, 1000);
    } else {
      if (timer.current) clearInterval(timer.current);
    }
  }, [windowFocused]);
};

export default useMountedTimer;
