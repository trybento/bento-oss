import asyncHooks from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

type AsyncContext = {
  requestId?: string;
  /** Indicate a sub-async process we didn't call for creating */
  childResource?: boolean;
  /** If we should store long stack traces and lastSql */
  useTrace?: boolean;
  /** If useTrace enabled, last successful sql ran */
  lastSql?: string;
  /** The Async Context ID of the top of the async stack */
  topExecutionId?: number;
  [contextInfoKey: string]: any;
};

/** Async contexts */
const store = new Map<number, AsyncContext>();
/** Long tracing */
const stackMap = new Map<number, string>();
/** Last SQL query ran in context */
const lastSqlMap = new Map<number, string>();

/** For if we want to monitor a request front to back e.g. to time */
const requestStartListeners: Array<(id?: string) => void> = [];
const requestEndListeners: Array<(id?: string) => void> = [];

asyncHooks
  .createHook({
    init: function initHook(asyncId, _type, triggerAsyncId) {
      const data = store.get(triggerAsyncId);
      if (!!data) {
        const childResource = true;
        /* Maps child async resources to the parent trigger */
        store.set(asyncId, { ...store.get(triggerAsyncId), childResource });
      }

      if (data?.useTrace) {
        const parentStack = stackMap.get(triggerAsyncId) || '';
        const currentStack: { stack?: string } = {};
        Error.captureStackTrace(currentStack, initHook);
        stackMap.set(asyncId, currentStack.stack + parentStack);
      }
    },
    destroy: (asyncId) => {
      const initialTrigger = store.get(asyncId);
      if (initialTrigger) {
        /* Gets the parent request object */
        if (!initialTrigger.childResource)
          requestEndListeners.forEach((cb) => cb(initialTrigger.requestId));

        store.delete(asyncId);
        if (initialTrigger.useTrace) stackMap.delete(asyncId);
        if (lastSqlMap.has(asyncId)) lastSqlMap.delete(asyncId);
      }
    },
  })
  .enable();

/** There will be many sub-task async hooks but only one master hook per call of this */
export const createRequestContext = <T>(
  data: Omit<AsyncContext & T, 'requestId'>,
  requestId = uuidv4()
) => {
  const exId = asyncHooks.executionAsyncId();
  const reqInfo = { requestId, topExecutionId: exId, ...data };
  store.set(exId, reqInfo);
  requestStartListeners.forEach((cb) => cb(requestId));
  return reqInfo;
};

export const getContextStack = () =>
  stackMap.get(asyncHooks.executionAsyncId());

export const getRequestContext = <T>() =>
  store.get(asyncHooks.executionAsyncId()) as AsyncContext & T;

/** Gets current state of the context map */
const getStore = () => store;

/** Gets current state of the stack map */
const getStackMap = () => stackMap;

export const logLastSql = (lastSql: string) => {
  const ctx = getRequestContext();
  const exId = ctx.topExecutionId;
  if (exId) lastSqlMap.set(exId, lastSql);
};

export const getLastSql = () => {
  const exId = getRequestContext().topExecutionId;
  return exId ? lastSqlMap.get(exId) : undefined;
};

const onRequestStart = (cb: (id?: string) => void) =>
  requestStartListeners.push(cb);
const onRequestEnd = (cb: (id?: string) => void) =>
  requestEndListeners.push(cb);

export default {
  getStore,
  getStackMap,
  onRequestStart,
  onRequestEnd,
};
