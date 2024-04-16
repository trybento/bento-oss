/**
 * NOTE: This is heavily inspired on Shoyu's `withCatchException`.
 */
export function withCatchException(
  originalFn: (...args: any[]) => Promise<any> | any,
  namespace?: string
) {
  return async (...args: any[]) => {
    try {
      return await (async () => originalFn(...args))();
    } catch (err) {
      if (namespace) {
        try {
          err.message = `[${namespace}] ${err.message}`;
        } catch {
          // can't set message of read only
        }
      }

      console.error('An error ocurred.', err);
    }
  };
}
