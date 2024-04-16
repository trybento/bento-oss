import { AnyVariables, RequestPolicy, TypedDocumentNode } from 'urql';

import DataLoaderError from '../errors/DataLoaderError';
import { getGraphqlInstance } from '../lib/graphqlClient';
import catchException from '../lib/catchException';

type LoaderOptions = {
  /** The request policy to use, defaults to 'network-only' */
  requestPolicy?: RequestPolicy;
  /**
   * In case an error happens, the error will get re-thrown
   * @default false
   */
  rethrow?: boolean;
};

const loaderFactory =
  <V extends AnyVariables, R extends object>(
    name: string,
    query: TypedDocumentNode,
    { requestPolicy = 'network-only', rethrow = false }: LoaderOptions = {}
  ) =>
  async <ResponseType = R>(
    ...args: V[keyof V] extends never ? [] : [V]
  ): Promise<ResponseType | undefined> => {
    const [variables] = args;

    try {
      const graphqlClient = getGraphqlInstance();

      const { data, error } = await graphqlClient
        .query<R, V>(query, variables as any, {
          requestPolicy,
        })
        .toPromise();

      if (error) throw error;

      const errors = data
        ? Object.values(data)
            .filter(Boolean)
            .flatMap(({ errors }) => errors || [])
        : [];

      if (errors.length) throw new Error(errors.join('\n'));

      if (data) {
        return data as unknown as ResponseType;
      }
    } catch (innerError) {
      const outerError = new DataLoaderError(name);
      outerError.cause = innerError as Error;
      catchException(outerError);
      if (rethrow) throw outerError;
    }

    return undefined;
  };
export default loaderFactory;
