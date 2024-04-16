import { once } from 'bento-common/utils/lodash';

const historyCallbacks: (() => void)[] = [];

function handleHistoryChange() {
  for (const cb of historyCallbacks) {
    cb();
  }
}

const setupHistoryListeners = once(() => {
  window.addEventListener('popstate', handleHistoryChange);
  window.history.pushState = new Proxy(window.history.pushState, {
    apply: (target: any, thisArg: any, argArray?: any) => {
      handleHistoryChange();
      return target.apply(thisArg, argArray);
    },
  });
  window.history.replaceState = new Proxy(window.history.replaceState, {
    apply: (target: any, thisArg: any, argArray?: any) => {
      handleHistoryChange();
      return target.apply(thisArg, argArray);
    },
  });
});

export function addHistoryChangeCallback(cb: () => void): () => void {
  historyCallbacks.push(cb);
  setupHistoryListeners();
  return () => {
    historyCallbacks.splice(historyCallbacks.indexOf(cb), 1);
  };
}
