import { CombinedError, TypedDocumentNode } from 'urql';
import DataMutatorError from '../../../errors/DataMutatorError';
import catchException from '../../../lib/catchException';

import {
  fetchOptionsFactory,
  getGraphqlInstance,
} from '../../../lib/graphqlClient';

type MutatorOptions<D> = {
  keepalive?: boolean;
  onSuccess?: (data: D) => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
};

const mutatorFactory =
  <I, R>(
    name: string,
    mutation: TypedDocumentNode,
    { onSuccess, onError, onComplete, keepalive = true }: MutatorOptions<R> = {}
  ) =>
  async (input: I): Promise<void> => {
    try {
      const graphqlClient = getGraphqlInstance();

      const { data, error } = (await graphqlClient
        .mutation(
          mutation,
          { input },
          {
            fetchOptions: () => ({
              ...fetchOptionsFactory(),
              /**
               * Allow the request to outlive the page.
               * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#keepalive
               **/
              keepalive,
            }),
          }
        )
        .toPromise()) as unknown as { data?: R; error: Error };

      const errors = data
        ? Object.values(data)
            .filter(Boolean)
            .flatMap(({ errors }) => errors || [])
        : [];

      if (error && error instanceof CombinedError) {
        throw error;
      }

      if (errors.length) {
        throw new Error(errors.join('\n'));
      }

      onSuccess?.(data![name]);
    } catch (innerError) {
      const outerError = new DataMutatorError(name);
      outerError.cause = innerError as Error;

      catchException(outerError);
      onError?.(outerError);
    }
    onComplete?.();
  };

export default mutatorFactory;
