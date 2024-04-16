import { useEffect, useState } from 'react';

interface EventWithState extends Event {
  state?: any;
}

const isClient = typeof window === 'object';
const on = (obj, ...args) => obj.addEventListener(...args);
const off = (obj, ...args) => obj.removeEventListener(...args);

const patchHistoryMethod = (method) => {
  const original = history[method];

  history[method] = function (state) {
    // eslint-disable-next-line
    const result = original.apply(this, arguments);
    const event: EventWithState = new Event(method.toLowerCase());

    event.state = state;

    window.dispatchEvent(event);

    return result;
  };
};

if (isClient) {
  patchHistoryMethod('pushState');
  patchHistoryMethod('replaceState');
}

type useLocationClientState = Pick<
  Window['location'],
  | 'hash'
  | 'host'
  | 'hostname'
  | 'href'
  | 'origin'
  | 'pathname'
  | 'port'
  | 'protocol'
  | 'search'
> &
  Pick<Window['history'], 'state' | 'length'> & {
    trigger: string;
  };

type useLocationNotClientState = {
  trigger: string;
  length: number;
};

export type UseLocationState = Partial<useLocationClientState> &
  useLocationNotClientState;

const useLocation = (): UseLocationState => {
  const buildState = (trigger: string): useLocationClientState => {
    const { state, length } = window.history;

    const {
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search,
    } = window.location;

    return {
      trigger,
      state,
      length,
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search,
    };
  };

  const [state, setState] = useState<UseLocationState>(
    isClient
      ? buildState('load')
      : {
          trigger: 'load',
          length: 1,
        }
  );

  const onChange = (trigger: string) => {
    setState(buildState(trigger));
  };

  const onPopstate = () => onChange('popstate');
  const onPushstate = () => onChange('pushstate');
  const onReplacestate = () => onChange('replacestate');

  useEffect(() => {
    on(window, 'popstate', onPopstate);
    on(window, 'pushstate', onPushstate);
    on(window, 'replacestate', onReplacestate);

    return () => {
      off(window, 'popstate', onPopstate);
      off(window, 'pushstate', onPushstate);
      off(window, 'replacestate', onReplacestate);
    };
  }, [0]);

  return state;
};

export default useLocation;
