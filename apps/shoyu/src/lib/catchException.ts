import { IS_PROD } from './constants';
import { isDebugEnabled } from './debug';

export const withCatchException = (
  originalFn: (...args: any[]) => Promise<any> | any,
  namespace: string
) => {
  return async (...args: any[]) => {
    try {
      return await (async () => originalFn(...args))();
    } catch (e) {
      catchException(e as Error, namespace);
    }
  };
};

/**
 * Use this to capture exceptions within Sentry as well as
 * automatically log out when appropriate.
 *
 * Error logs will only be thrown when: (a) not in Production
 * or (b) when running in debug mode.
 */
export default function catchException(err: Error, namespace?: string) {
  if (namespace) {
    try {
      err.message = `[${namespace}] ${err.message}`;
    } catch {
      // can't set message of read only
    }
  }

  if (!IS_PROD || isDebugEnabled()) {
    // eslint-disable-next-line no-console
    console.error('Error in Bento Embeddable.', err);
  }
}
