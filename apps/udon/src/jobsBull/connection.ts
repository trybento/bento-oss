import { ConnectionOptions } from '@taskforcesh/bullmq-pro';
import URL from 'url';
import { getEnvOrFail } from 'src/utils/helpers';
import { logger } from 'src/utils/logger';
import { IS_DEPLOYED } from 'src/utils/constants';

const REDIS_URL = getEnvOrFail('WORKER_REDIS_URL');

export const makeConnectionConfig = (worker: boolean): ConnectionOptions => {
  const url = URL.parse(REDIS_URL);

  const common: ConnectionOptions = {
    // See https://docs.bullmq.io/guide/going-to-production#maxretriesperrequest
    maxRetriesPerRequest: null,

    // See https://docs.bullmq.io/guide/going-to-production#enableofflinequeue
    enableOfflineQueue: worker ? true : false,

    /**
     * For connection errors, we want to retry the connection
     * with a back-off strategy. The below uses an exponential
     * back-off strategy with a minimum of 1 second, and a
     * maximum of 20 seconds.
     */
    retryStrategy: (times: number) => {
      const delay = Math.max(Math.min(Math.exp(times), 20000), 1000);

      logger.warn(
        `Failed to connect to Redis after ${times} attempts - retrying in ${delay}ms`
      );

      return delay;
    },
  };

  if (IS_DEPLOYED) {
    return {
      ...common,
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
    };
  }

  return {
    ...common,
    port: url.port ? Number(url.port) : 6379,
    host: url.hostname!,
  };
};
