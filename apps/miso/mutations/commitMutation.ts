import { commitMutation } from 'react-relay';

import { relayEnvironment } from 'utils/relay';

interface GraphQLArgs<V> {
  environment?: any;
  variables: V;
  mutation: any;
  mutationName?: string;
  optimisticResponse?: any;
  configs?: Array<any>;
  updater?: any;
  optimisticUpdater?: any;
}

export default function commitMutationP<V, R>({
  mutation,
  mutationName,
  optimisticResponse,
  variables,
  configs,
  updater,
}: GraphQLArgs<V>): Promise<R> {
  if (!relayEnvironment) throw new Error('No Relay environment found');

  return new Promise((resolve, reject) => {
    commitMutation(relayEnvironment, {
      mutation,
      variables,
      optimisticResponse,
      onCompleted: (response: R | undefined, errors: Error[] | undefined) => {
        if (errors && errors.length > 0) {
          reject(errors[0]);
          return;
        }

        if (response) {
          const rAny: any = response;
          const errors: string[] | undefined = rAny.errors;

          if (errors && errors.length > 0) {
            reject(errors.map((error) => new Error(error)));
            return;
          }

          if (mutationName && rAny[mutationName]) {
            const body = rAny[mutationName];

            const bodyErrors: string[] | undefined = body.errors;
            if (bodyErrors && bodyErrors.length) {
              reject(bodyErrors.map((error) => new Error(error)));
              return;
            }
          }

          resolve(response);
        } else {
          reject(new Error("Shouldn't get here"));
        }
      },
      onError: (error: Error) => {
        reject(error);
      },
      configs,
      updater,
    });
  });
}
