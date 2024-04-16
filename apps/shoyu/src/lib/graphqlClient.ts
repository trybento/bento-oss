import {
  defaultExchanges,
  createClient,
  subscriptionExchange,
  Client,
} from 'urql';
import { createClient as createWSClient, Client as WsClient } from 'graphql-ws';
import { debugMessage } from 'bento-common/utils/debugging';

import { getToken } from '../stores/sessionStore/helpers';
import { getBentoSettings, objToQueryString, RECONNECT_DELAY } from './helpers';
import { SOCKET_RECONNECTION_ATTEMPTS } from './constants';
import { getTraceHeaders, getBentoInitID } from './trace';

const GRAPHQL_HOST = process.env.VITE_PUBLIC_GRAPHQL_HOST as string;
const GRAPHQL_WS_HOST = process.env
  .VITE_PUBLIC_GRAPHQL_WEBSOCKET_HOST as string;

let graphqlClient: Client | undefined;
let wsClient: WsClient | undefined;

export const fetchOptionsFactory = (): RequestInit => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    ...getTraceHeaders(),
  },
});

const getGraphqlClient = (): [client: Client, wsClient: WsClient] => {
  const { appId = 'undefined' } = getBentoSettings() || {};
  debugMessage('[BENTO] Creating gql client', { appId });

  const wsClient = createWSClient({
    url: GRAPHQL_WS_HOST + objToQueryString({ appId }),
    retryWait: (retries) =>
      new Promise((resolve) =>
        setTimeout(resolve, retries === 0 ? RECONNECT_DELAY : 10 ** retries)
      ),
    retryAttempts: SOCKET_RECONNECTION_ATTEMPTS,
    connectionParams: () => {
      return {
        reconnect: true,
        authToken: getToken(),
        initId: getBentoInitID(),
      };
    },
  });

  const gqlClient = createClient({
    url: GRAPHQL_HOST,
    fetchOptions: fetchOptionsFactory,
    exchanges: [
      // dedupExchange,
      // customCacheExchange,
      // fetchExchange,
      ...defaultExchanges, // Temporarily reverting to default exchange while 'customCacheExchange' is fixed.
      subscriptionExchange({
        forwardSubscription: (operation) => ({
          subscribe: (sink) => ({
            unsubscribe: wsClient.subscribe(operation, sink),
          }),
        }),
      }),
    ],
  });

  return [gqlClient, wsClient];
};

export const getGraphqlInstance = () => {
  if (!graphqlClient) {
    [graphqlClient, wsClient] = getGraphqlClient();
  }
  return graphqlClient;
};

/**
 * Closes the websocket connection when there is one set.
 * NOTE: This should only be called when reseting Bento OR if appId has changed.
 */
export const closeGraphql = () => {
  debugMessage('[BENTO] Closing gql client and ws connection');
  wsClient?.dispose();
  wsClient = undefined;
  graphqlClient = undefined;
};
