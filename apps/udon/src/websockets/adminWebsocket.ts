import WebSocket from 'ws';
import promises from 'src/utils/promises';

import { AdminRequests, AdminRequestMessage } from 'bento-common/types';
import { subscriber } from 'src/utils/redis/admin';
import { ADMIN_EVENT_TOPIC } from './sockets.constants';
import { logger } from 'src/utils/logger';
import { createClientKey, getRequestRateKey } from './websockets.helpers';
import { WebSocketWithIsAlive } from './embeddableWebsockets';
import { createPartition } from 'src/utils/helpers';
import { Organization } from 'src/data/models/Organization.model';
import TimeoutManager from 'src/utils/TimeoutManager';
import SimpleRateLimiter from 'src/utils/SimpleRateLimiter';
import handleAdminRequest from 'src/interactions/reporting/handleAdminRequest';

const HIDE_SUB_LOGS = process.env.HIDE_SUB_LOGS === 'true';

export const adminWS = new WebSocket.Server({
  noServer: true,
  maxPayload: 2 * 1024 * 1024,
});

const adminWSMap = new Map<string, WebSocketWithIsAlive>();

const rateLimiter = new SimpleRateLimiter({
  keyPrefix: 'csv-request',
  points: 1,
  duration: 5 * 60,
});

// TODO: Respect event types so if there are multiple orgUsers, only ping interested parties
void subscriber.subscribe(ADMIN_EVENT_TOPIC);

/** Returns sent or not */
const sendUpdate = (organizationEntityId: string, data: string) => {
  if (!organizationEntityId) return false;

  let sent = false;

  [...adminWSMap.keys()].forEach((mapKey) => {
    const isClientRelevant = organizationEntityId === mapKey.split('_')[0];
    if (isClientRelevant) {
      const client = adminWSMap.get(mapKey);
      if (client) {
        client.send(data);
        sent = true;
      }
    }
  });
  return sent;
};

adminWS.on('connection', (client: WebSocketWithIsAlive) => {
  let clientKey: string;
  let organizationEntityId: string;
  client.isAlive = true;

  client.on('close', () => {
    clientKey && adminWSMap.delete(clientKey);
  });

  client.on('pong', () => {
    client.isAlive = true;
  });

  client.on('message', async (message) => {
    const messageBody = JSON.parse(message.toString()) as AdminRequestMessage;

    if (messageBody.organizationEntityId && messageBody.type) {
      organizationEntityId = messageBody.organizationEntityId;
      logger.info(`[adminWs] Added subscription for ${organizationEntityId}`);
      clientKey = createClientKey(organizationEntityId);
      adminWSMap.set(clientKey, client);

      const organization = await Organization.findOne({
        where: {
          entityId: organizationEntityId,
        },
      });

      /* Invalid, punt */
      if (!organization) return client.close();

      const allowRequest = await rateLimiter.check(
        getRequestRateKey(messageBody)
      );

      if (
        !allowRequest &&
        messageBody.type !== AdminRequests.uploadUserAttributes
      ) {
        logger.info(
          `[adminWs] org ${organization.slug} exceeded CSV rate limit`
        );
        return client.send(
          "Error: You've already downloaded this CSV. Please check your downloads folder"
        );
      }

      handleAdminRequest({
        message: messageBody,
        organization,
        sendMessage: (data) => {
          client.send(data);
          setTimeout(() => client.close(), 1000).unref();
        },
      });
    }
  });
});

subscriber.on('message', (channel, message) => {
  if (!HIDE_SUB_LOGS)
    logger.debug(`[adminWs] Admin event received: ${channel}`);
  if (channel === ADMIN_EVENT_TOPIC) {
    const parsedMessage = JSON.parse(message);
    const { organizationEntityId, type: _type, data } = parsedMessage;

    setTimeout(() => {
      sendUpdate(organizationEntityId, data);
    }, 1000);
  }
});

const WEBSOCKET_PING_INTERVAL = 15000;
TimeoutManager.addInterval(async function ping() {
  const clients = Array.from(adminWSMap.values());

  await promises.map(clients, async (client) => {
    if (!client.isAlive) {
      client.terminate();
      return;
    }
    client.isAlive = false;
    client.ping();
    await createPartition();
  });
}, WEBSOCKET_PING_INTERVAL);

export default adminWS;
