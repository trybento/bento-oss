import { useEffect, useRef } from 'react';

/**
 * Keep track of the last value passed to this hook
 */
export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

/**
 * Keep track of the previous different value. This differs from `usePrevious`
 * since it only updates the return value if the value passed in is different.
 */
export function usePreviousValue<T>(
  value: T,
  equalityFn?: (newValue: T, currentValue: T) => boolean
): T | undefined {
  const nextValue = useRef<T>();
  const prevValue = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    if (
      equalityFn
        ? !equalityFn(value, nextValue.current)
        : value !== nextValue.current
    ) {
      prevValue.current = nextValue.current;
      nextValue.current = value;
    }
  }, [value]); // Only re-run if value changes

  // Return previous different value (happens before update in useEffect above)
  return prevValue.current;
}
