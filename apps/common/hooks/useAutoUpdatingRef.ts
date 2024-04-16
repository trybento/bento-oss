import { useEffect, useRef } from 'react';

export default function useAutoUpdatingRef<V>(value?: V) {
  const ref = useRef<V>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
