import {
  debugMessage as baseDebugMessage,
  createDebugLogger,
} from 'bento-common/utils/debugging';
import { debounce } from 'lodash';

import { isDevelopment, isStaging } from './env';

/**
 * Determine whether debugging message should be enabled.
 * Enabled by default in development mode or when targeting the Staging environment.
 */
export const isDebugEnabled = debounce(
  (): boolean => isDevelopment() || isStaging(),
  100,
  {
    leading: true,
  },
);

createDebugLogger(isDebugEnabled);

export function makeLogger(namespace: string) {
  return function (...args: Parameters<typeof baseDebugMessage>) {
    if (args.length > 1) {
      baseDebugMessage(
        `[Bento.ext.${namespace}] ${args[0]}`,
        args.length > 2 ? args.slice(1) : args[1],
      );
      return;
    }

    baseDebugMessage(`[Bento.ext.${namespace}] ${args[0]}`);
  };
}

const globalLogger = makeLogger('global');

export const logMessage = (...args: Parameters<typeof baseDebugMessage>) => {
  return globalLogger(...args);
};
