import { WorkerPro as Worker } from '@taskforcesh/bullmq-pro';
import { once } from 'lodash';
import { makeConnectionConfig } from 'src/jobsBull/connection';
import {
  runShutdown,
  shouldForceQuit,
  useExitHook,
  useUncaughtErrorHook,
} from 'src/utils/helpers';
import { logger } from 'src/utils/logger';
import { closeSequelize } from 'src/data/data.helpers';
import { closePubSubs } from 'src/graphql/utils';
import { closeAllRedisConnections } from 'src/utils/redis/getRedisClient';
import { queueConfigMap } from './queueConfigMap';
import path from 'path';
import { IS_DEPLOYED } from 'src/utils/constants';
import { closeBullMQQueues } from './queues';

export const startBullMQWorker = (priority: boolean) => {
  const processName = priority ? 'priority' : 'background';

  const workers = Object.entries(queueConfigMap)
    .filter(([, config]) => !!config.runOnPriorityInstance === priority)
    .map(([queueName, config]) => {
      const workerName = `worker:bullmq:${queueName}`;

      const worker = new Worker(
        queueName,
        path.join(__dirname, `processor.${IS_DEPLOYED ? 'js' : 'ts'}`),
        {
          connection: makeConnectionConfig(true),
          concurrency: config.concurrency,
          group: {
            concurrency: config.groupConcurrency ?? 1,
          },
          limiter: config.limiter,
          useWorkerThreads: true,
        }
      );

      worker.on('error', (err) => {
        logger.error(
          `Error thrown by '${workerName}' worker: ${err?.message}`,
          err
        );
      });

      worker.on('failed', (job, err) => {
        logger.error(
          `Task with ID '${
            job?.id || 'Unknown'
          }' on '${workerName}' worker failed: ${err?.message}`,
          err
        );
      });

      worker.on('stalled', (jobId) => {
        logger.warn(
          `Task with ID '${jobId}' on '${workerName}' worker has stalled`
        );
      });

      worker.on('completed', async (job, result) => {
        const duration =
          job.processedOn && job.finishedOn
            ? job.finishedOn - job.processedOn
            : undefined;

        logger.info(
          `Completed task ${job.id || '<no ID>'} (${job.name})${
            duration && ` (${duration}ms)`
          }`
        );
      });

      return worker;
    });

  logger.info(
    `[${processName}] Launching workers for the following queues: ${workers
      .map((worker) => worker.name)
      .join(', ')}`
  );

  useUncaughtErrorHook((err: any) => {
    logger.error(`[unhandledRejection] err: ${err.message}`, err);
  });

  useExitHook(
    once(async () => {
      if (shouldForceQuit()) {
        logger.info(`[${processName}] Force quitting for Dev`);
        process.exit();
      }

      logger.info(
        `[exit (${processName})] Attempting graceful shutdown of all known open connections`
      );

      await runShutdown(`${processName}`, [
        ...workers.map((worker) => () => worker.close()),
        closePubSubs,
        closeAllRedisConnections,
        closeSequelize,
        closeBullMQQueues,
      ]);

      logger.info(`[exit (${processName})] Done shutting down connections`);

      process.exit();
    })
  );
};
