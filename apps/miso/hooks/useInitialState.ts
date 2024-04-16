import { useCallback, useRef, useState } from 'react';

type StateHelpers<T extends object = {}> = {
  /**
   * Prime the hook to listen for events to invoke
   */
  set: (state: T) => void;
  /**
   * Return true if invoked and processed
   * Setting preserve won't reset the initial state. Do this
   * to simply access the values (maybe it should be its own method?)
   */
  invoke: () => T | null;
  /**
   * Cancel the state and do nothing else
   */
  clear: () => void;
  /**
   * Gets the current state of the init without triggering it
   */
  current: () => T | null;
  /**
   * In some cases components using the state may not re-render automatically because
   * of reference dependencies. The random key can be used to trigger updates
   */
  key: string;
};

export type InitState<T extends object = {}> = StateHelpers<T>;

/**
 * Store a hook that can be invoked and will remove itself to indicate it's been used
 *
 * Useful for invoking an initial state or behavior on mount, which we want to clear after
 */
function useInitialState<T extends object = {}>(
  cb?: () => void
): StateHelpers<T> {
  const initState = useRef<T | null>();
  const [key, setKey] = useState(0);

  const set = useCallback((startingState: T | null) => {
    initState.current = startingState;
    setKey(Math.random());
  }, []);

  const invoke = useCallback(
    (preserve = false) => {
      if (!initState.current) return null;

      cb?.();
      const ret = {
        ...initState.current,
      };

      if (!preserve) initState.current = null;
      return ret;
    },
    [initState.current]
  );

  const current = useCallback(() => initState.current, [initState.current]);

  const clear = useCallback(() => {
    initState.current = null;
  }, []);

  return {
    set,
    invoke,
    clear,
    current,
    key: String(key),
  };
}

export default useInitialState;
