import './preStart'; // Must be the first import -- bootstrap the application

import { once } from 'lodash';

import server, {
  closeGraphQlWs,
  initiateWebsocketServer,
} from 'src/serverWithWebsockets';

import { logger } from 'src/utils/logger';
import {
  useExitHook,
  useUncaughtErrorHook,
  runShutdown,
  shouldForceQuit,
} from './utils/helpers';
import { closeAllRedisConnections } from './utils/redis/getRedisClient';
import { closeSequelize } from './data/data.helpers';
import { closePubSubs } from './graphql/utils';
import { setupScheduledJobs } from 'src/jobsBull/scheduler';

logger.info(
  `[index] Web running @ pID ${process.pid} with ${
    process.env.WEB_MEMORY || 'Unknown WEB_MEMORY'
  }`
);

// Setup scheduled jobs on BullMQ
void setupScheduledJobs();

// Start the server
const port = Number(process.env.PORT || 8081);
server.listen(port, () => {
  initiateWebsocketServer();
  logger.info(
    `[index] Express server\x1b[36m finally\x1b[0m started on port: ${port}`
  );
});

/** Will not cancel keep-alive, but default keep-alive is just 5s */
const closeHttpServer = () => new Promise((resolve) => server.close(resolve));

/** On term signal, call for listeners to close */
useExitHook(
  once(async () => {
    if (shouldForceQuit()) {
      logger.info(`[exit:web] Force quitting for Dev`);
      process.exit();
    }

    logger.info(
      `[exit:web] Attempting graceful shutdown of all known open connections`
    );

    await runShutdown(`web`, [
      closeHttpServer,
      closeGraphQlWs,
      closePubSubs,
      closeAllRedisConnections,
      closeSequelize,
    ]);

    logger.info(`[exit:web] Done shutting down worker's connections`);

    process.exit();
  })
);

useUncaughtErrorHook((err: any) => {
  logger.error(`[unhandledRejection] err: ${err.message}`, err);
});
