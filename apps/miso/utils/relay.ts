import { GraphQLError } from 'graphql';
import { useMemo } from 'react';
import { isArray } from 'lodash';
import {
  Environment,
  Network,
  Observable,
  RecordSource,
  RequestParameters,
  Store,
  Variables,
} from 'relay-runtime';
import { createClient, Client } from 'graphql-ws';
import env from '@beam-australia/react-env';
import {
  ClientStorage,
  readFromClientStorage,
  removeFromClientStorage,
} from 'bento-common/utils/clientStorage';

const SUBSCRIPTIONS_URL = `${env('WEBSOCKET_HOST')!}/graphql`;
const FETCH_URL = `${env('API_HOST')!}/graphql`;
const LOGIN_PATH = '/login';

let websocketClient: Client;

function getWebsocketClient() {
  if (websocketClient) return websocketClient;
  websocketClient = createClient({
    url: SUBSCRIPTIONS_URL,
    connectionParams: async () => {
      const accessToken = readFromClientStorage(
        ClientStorage.localStorage,
        'accessToken'
      );

      return {
        Authorization: `Bearer ${accessToken}`,
      };
    },
  });

  return websocketClient;
}

function makeSubscribeFn() {
  return function (operation: RequestParameters, variables: Variables) {
    const websocketClient = getWebsocketClient();
    return Observable.create((sink) => {
      if (!operation.text) {
        return sink.error(new Error('Operation text cannot be empty'));
      }
      return websocketClient.subscribe(
        {
          operationName: operation.name,
          query: operation.text,
          variables,
        },
        {
          ...sink,
          error: (err) => {
            if (err instanceof Error) {
              sink.error(err);
            } else if (err instanceof CloseEvent) {
              sink.error(
                new Error(
                  `Socket closed with event ${err.code}` + err.reason
                    ? `: ${err.reason}` // reason will be available on clean closes
                    : ''
                )
              );
            } else {
              if (isArray(err)) {
                new Error(
                  ((err || []) as GraphQLError[])
                    .map(({ message }) => message)
                    .join(', ')
                );
              } else {
                // err can be an Event or something else entirely
                sink.error(new Error('Unknown error occurred'));
              }
            }
          },
        }
      );
    });
  };
}

export let relayEnvironment: Environment;

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise
function makeFetchQuery() {
  return async function (operation: RequestParameters, variables: Variables) {
    const accessToken = readFromClientStorage(
      ClientStorage.localStorage,
      'accessToken'
    );

    const response = await fetch(FETCH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: operation.text, // GraphQL text from input
        variables,
      }),
    });

    const responseJson = await response.json();

    if (response.ok) {
      return responseJson;
    } else if (
      response.status === 401 ||
      responseJson.error === 'Invalid auth payload'
    ) {
      // remove invalid token from localStorage, if one exists
      removeFromClientStorage(ClientStorage.localStorage, 'accessToken');
      window.location.replace(LOGIN_PATH);

      // to prevent relay from erroring when attempting to parse the response
      return { data: null };
    }
  };
}

function createEnvironment() {
  return new Environment({
    // Create a network layer from the fetch and subscribe functions
    network: Network.create(makeFetchQuery(), makeSubscribeFn() as any), //TODO: Fix this any
    store: new Store(new RecordSource(), {
      queryCacheExpirationTime: 2 * 60 * 1000,
    }),
  });
}

export function initEnvironment() {
  // For SSG and SSR always create a new Relay environment
  if (!process.browser) return createEnvironment();
  // Create the Relay environment once in the client
  if (!relayEnvironment) relayEnvironment = createEnvironment();

  return relayEnvironment;
}

export function useEnvironment() {
  const store = useMemo(() => initEnvironment(), []);
  return store;
}
