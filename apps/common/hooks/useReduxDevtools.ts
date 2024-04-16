import { useCallback, useMemo } from 'react';

import { Action } from '../types';

export type ActionWrapper<A extends Action, S extends object> = (
  action: Omit<A, 'type'> & { type: string; [key: string]: any },
  cb: () => S | void
) => ReturnType<typeof cb>;

type DevTools<A extends Action, S extends object> = {
  actionWrapper: ActionWrapper<A, S>;
  init: (state: S) => void;
  sendAction: (a: A, s: S) => void;
};

export default function useReduxDevtools<A extends Action, S extends object>(
  name: string,
  enabled = false
): DevTools<A, S> {
  let extension: any;

  try {
    extension = enabled
      ? // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__ ||
        // @ts-ignore
        window.top.__REDUX_DEVTOOLS_EXTENSION__
      : undefined;
  } catch {
    // cross origin frame error
  }

  const devtools = useMemo(() => extension?.connect({ name }), []);

  const sendAction = useCallback(
    (action, newState) => devtools?.send(action, newState),
    [devtools]
  );

  const actionWrapper = useCallback(
    (action: A, cb: () => any) => {
      const newState = cb();
      sendAction(action, newState);
      return newState;
    },
    [sendAction]
  );

  const init = useCallback(
    (initialState: S) => {
      devtools?.init(initialState);
    },
    [devtools]
  );

  return { actionWrapper, sendAction, init };
}
