import { diff } from 'deep-object-diff';

type Logger = Function & { enabled: boolean };

let debugLogger: Logger;

const debugLoggerFactory = (
  isDebugEnabled: () => boolean,
  logger: Function = console.debug
): Logger => {
  const debugMessage = (...args: any[]) => {
    if (isDebugEnabled()) {
      logger(...args);
    }
  };
  Object.defineProperty(debugMessage, 'enabled', { get: () => isDebugEnabled });
  return debugMessage as unknown as Logger;
};

export const createDebugLogger = (
  ...args: Parameters<typeof debugLoggerFactory>
) => {
  debugLogger = debugLoggerFactory(...args);
};

export const debugMessage = (...args: any[]) => debugLogger(...args);

export const getDiffMessage = <S extends object>(
  prevState: S,
  nextState: S
) => {
  const stateDiff = diff(prevState, nextState);
  if (Object.keys(stateDiff).length === 0) {
    return null;
  }
  return stateDiff;
};

export const hasDiff = <S extends object>(prevState: S, nextState: S) =>
  !!getDiffMessage(prevState, nextState);
