import { Transaction } from 'sequelize';

import { clsNamespace } from './cls';
import { logger } from './logger';

function afterTransaction(cb: () => any) {
  const transaction = clsNamespace.get('transaction') as
    | Transaction
    | undefined;

  const runCbInNewContext = () => {
    clsNamespace.run(() => {
      clsNamespace.set('transaction', null);
      process.nextTick(cb);
    });
  };

  if (transaction) {
    transaction.afterCommit(() => {
      runCbInNewContext();
    });
  } else {
    runCbInNewContext();
  }
}

/**
 * Takes an async callback and completes it without requiring the caller to wait for the input to finish.
 *
 * @param cb promise to await
 * @param context optional additional information for to log if there is a rejection
 * @param callbacks if we want to complete an action when the promise resolves/rejects
 */
export default function detachPromise<T>(
  cb: () => Promise<T>,
  context?: string,
  callbacks: {
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
  } = {}
): void {
  afterTransaction(() => {
    const promise = cb();

    promise
      ?.then((r) => callbacks.onSuccess && callbacks.onSuccess(r))
      .catch((e) => {
        e.message = `[detached - ${context}] ${e.message}`;
        logger.error(`[detachPromise] Error (${context})`, e);
        callbacks.onError && callbacks.onError(e);
      });
  });
}

/** Original detach promise which takes a promise object */
export function detachPromiseLike<T>(
  promise: PromiseLike<T>,
  context?: string,
  callbacks: {
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
  } = {}
): void {
  afterTransaction(() => {
    promise.then(
      (result) => callbacks.onSuccess && callbacks.onSuccess(result),
      (reason) => {
        reason.message = `[detached - ${context}] ${reason.message}`;
        logger.error('Detached promise error', reason);
        callbacks.onError && callbacks.onError(reason);
      }
    );
  });
}
