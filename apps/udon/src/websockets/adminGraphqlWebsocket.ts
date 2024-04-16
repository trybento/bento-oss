import promises from 'src/utils/promises';
import ws from 'ws';

import { WebSocketWithIsAlive } from './embeddableWebsockets';
import { createPartition } from 'src/utils/helpers';
import TimeoutManager from 'src/utils/TimeoutManager';
import { logger } from 'src/utils/logger';

export const graphqlWS = new ws.Server({
  noServer: true,
});

graphqlWS.on('connection', (client: WebSocketWithIsAlive) => {
  client.isAlive = true;

  client.on('pong', () => {
    client.isAlive = true;
  });

  client.on('error', (e) => logger.error('[adminGraphqlWebsocket] error', e));
});

const WEBSOCKET_PING_INTERVAL = 10000;
TimeoutManager.addInterval(async function ping() {
  const clients =
    graphqlWS.clients.keys() as IterableIterator<WebSocketWithIsAlive>;

  await promises.map(Array.from(clients), async (client) => {
    if (!client.isAlive) {
      client.terminate();
      return;
    }
    client.isAlive = false;
    client.ping();
    await createPartition();
  });
}, WEBSOCKET_PING_INTERVAL);

export default graphqlWS;
