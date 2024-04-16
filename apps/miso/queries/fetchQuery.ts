import { fetchQuery } from 'react-relay';
import throttle from 'lodash/throttle';
import {
  CacheConfig,
  createOperationDescriptor,
  Environment,
  FetchQueryFetchPolicy,
  getRequest,
  GraphQLTaggedNode,
  OperationType,
} from 'relay-runtime';
import { RelayObservable } from 'relay-runtime/lib/network/RelayObservable';

import { relayEnvironment } from 'utils/relay';

export type QueryOptions = {
  fetchPolicy?: FetchQueryFetchPolicy;
  networkCacheConfig?: CacheConfig;
};

export interface GraphQLArgs<V> {
  variables: V;
  query: GraphQLTaggedNode;
  doNotRetain?: boolean;
  options?: QueryOptions;
}

type FetchQuery = <T extends OperationType>(
  env: Environment,
  query: GraphQLTaggedNode,
  vars: T['variables'],
  options?: QueryOptions
) => RelayObservable<any>;

export default function fetchQueryP<V, R>({
  variables,
  query,
  doNotRetain,
  options = {
    fetchPolicy: 'network-only',
  },
}: GraphQLArgs<V>): Promise<R> {
  if (!relayEnvironment) throw new Error('No relay environment');

  const operation = createOperationDescriptor(getRequest(query), variables);

  /* Nasty typing, lib type for fetchQuery still uses old promise API */
  const fetchQueryT: FetchQuery = fetchQuery as any;

  return new Promise((resolve, reject) => {
    fetchQueryT(relayEnvironment, query, variables, options).subscribe({
      error: (e) => reject(e),
      next: (d) => {
        if (!doNotRetain) relayEnvironment.retain(operation);
        resolve(d);
      },
    });
  });
}

export const fetchQueryThrottled = throttle(fetchQueryP, 5000);
