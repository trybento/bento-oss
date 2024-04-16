import URL, { UrlWithStringQuery } from 'url';
import Redis, { RedisOptions } from 'ioredis';
import promises from 'src/utils/promises';

import { logger } from 'src/utils/logger';
import { IS_CLI, IS_DEPLOYED, IS_TEST, SHUTDOWN_MAX } from '../constants';
import { redisReadyListener } from 'src/graphql/pubsub.helpers';
import { PUBSUB_NAMES } from 'src/graphql/pubsub.helpers';

type RedisInstance = InstanceType<typeof Redis>;

const REDIS_URL = process.env.REDIS_URL!;

const HIDE_CONN_LOG = process.env.HIDE_REDIS_CONN_LOG;

/**
 * Manage connection names as to not accidentally create
 *   more connections per instance accidentally
 */
export enum RedisConnections {
  general = 'general',
}

if (!REDIS_URL && !IS_TEST && !IS_CLI) {
  throw new Error('No REDIS_URL configured');
}

function clientFromURL({
  url,
  connectionName,
}: {
  url: UrlWithStringQuery;
  connectionName: string;
}) {
  let redisConfig: RedisOptions;
  if (IS_DEPLOYED) {
    // Connecting to Secure Redis on Heroku is via one port higher than the redis instance port
    // https://devcenter.heroku.com/articles/securing-heroku-redis
    redisConfig = {
      password: url.auth?.split(':')[1],
      host: url.hostname!,
      db: 0,
      port: Number(url.port),
      tls: {
        rejectUnauthorized: false,
        requestCert: true,
        // @ts-ignore
        agent: false,
      },
      connectionName,
    };
  } else {
    redisConfig = {
      port: url.port ? Number(url.port) : 6379,
      host: url.hostname!,
      connectionName,
    };
  }

  return new Redis(redisConfig);
}

const redisClients: { [connectionName: string]: RedisInstance } = {};

let clientFactory;
if (IS_TEST || IS_CLI) {
  const RedisMock = require('ioredis-mock');
  clientFactory = (connectionName: string) => new RedisMock({ connectionName });
} else {
  clientFactory = (connectionName: string) =>
    clientFromURL({ url: URL.parse(REDIS_URL), connectionName });
}

// hook for testing
export function setClientFactory(factory: (name: string) => Redis.Redis) {
  clientFactory = factory;
}

type GetRedisOpts = {
  onReady?: () => void;
};

export default function getRedisClient(
  connectionName: RedisConnections | PUBSUB_NAMES,
  opts: GetRedisOpts = {}
) {
  if (redisClients[connectionName]) return redisClients[connectionName];

  const startTime = new Date();
  const client = clientFactory(connectionName) as Redis.Redis;

  if (IS_CLI) return client;

  redisClients[connectionName] = client;

  if (!HIDE_CONN_LOG) logger.debug('Redis: Starting to connect');
  client.on('ready', () => {
    HIDE_CONN_LOG ||
      logger.debug(`Redis: Client "${connectionName}" ready`, {
        timeToReady: new Date().getTime() - startTime.getTime(),
      });

    opts.onReady && opts.onReady();
    redisReadyListener.emit('ready', connectionName);
  });
  client.on('error', (err) => {
    err.message = `[Redis] ${err.message}`;
    logger.error(err);
  });
  client.on(
    'connect',
    () =>
      IS_TEST ||
      HIDE_CONN_LOG ||
      logger.info(`Redis: Client "${connectionName}" connected`, {
        timeToConnected: new Date().getTime() - startTime.getTime(),
      })
  );
  client.on('end', () => {
    HIDE_CONN_LOG || logger.debug(`Redis: Connection ${connectionName} closed`);

    redisReadyListener.emit('close', connectionName);
  });
  client.on('warning', (msg) => logger.warn(`Redis: ${msg as string}`));

  return client;
}

export function closeRedisConnection(
  redisClient: RedisInstance
): Promise<void> {
  return new Promise((resolve) => {
    if (redisClient) {
      const fallback = setTimeout(() => {
        logger.warn('[closeRedisConnection] fallback for closing triggered');
        redisClient.disconnect && redisClient.disconnect();
        resolve();
      }, Math.ceil(SHUTDOWN_MAX / 2));

      redisClient.quit((err) => {
        clearTimeout(fallback);
        if (err) {
          // We really should never get here, but if we ever do, we're still
          // going to log but then resolve cleanly as to not interupt the
          // graceful shutdown
          err.message = `[Redis failed to quit] ${err.message}`;
          logger.error(err);
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
}

/**
 * Close existing connections, stop pub activity requesting clients
 */
export const closeAllRedisConnections = async () => {
  const closedConns: string[] = [];
  await promises.map(
    Object.keys(redisClients),
    async (connectionName) => {
      closedConns.push(connectionName);
      await closeRedisConnection(redisClients[connectionName]);
    },
    { concurrency: 5 }
  );

  logger.info(
    `[closeAllRedisConnections] closed redis: ${closedConns.join(', ')}`
  );
};
