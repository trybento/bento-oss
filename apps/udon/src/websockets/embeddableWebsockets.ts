import WebSocket from 'ws';
import promises from 'src/utils/promises';

import { createPartition } from 'src/utils/helpers';
import TimeoutManager from 'src/utils/TimeoutManager';

const embeddableWS = new WebSocket.Server({
  noServer: true,
});

export interface WebSocketWithIsAlive extends WebSocket {
  isAlive?: boolean;
}

embeddableWS.on('connection', (client: WebSocketWithIsAlive) => {
  client.isAlive = true;

  client.on('pong', () => {
    client.isAlive = true;
  });
});

const WEBSOCKET_PING_INTERVAL = 5000;
TimeoutManager.addInterval(async function ping() {
  const clients =
    embeddableWS.clients.keys() as IterableIterator<WebSocketWithIsAlive>;

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

export default embeddableWS;
