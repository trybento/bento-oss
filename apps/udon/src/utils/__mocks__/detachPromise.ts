import Bluebird from 'bluebird';

export default function detachPromise<T>(
  cb: () => Promise<T> | Bluebird<T>,
  context?: string,
  callbacks: {
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
  } = {}
): void {
  const promise = cb();
  if (promise instanceof Bluebird) {
    promise.then(callbacks.onSuccess, callbacks.onError);
  } else {
    promise
      .then((r) => callbacks.onSuccess && callbacks.onSuccess(r))
      .catch((e) => {
        console.error(`[detachPromise] Error (${context})`, e);
        callbacks.onError && callbacks.onError(e);
        throw e; // re-throws for easier testing
      });
  }
}
