import { QueuePro as Queue } from '@taskforcesh/bullmq-pro';
import { makeConnectionConfig } from 'src/jobsBull/connection';
import { Job } from 'src/jobsBull/job';
import { logger } from 'src/utils/logger';
import { jobConfigMap, JobConfig } from 'src/jobsBull/jobConfigMap';
import { queueConfigMap, QueueName } from './queueConfigMap';
import promises from 'src/utils/promises';
import { BULL_MQ_PAUSE_STATES } from './constants/pauses';
import detachPromise from 'src/utils/detachPromise';

/**
 * Pause and resume queues based on the env setting
 *
 * Note: the pauses persist if Redis stays alive, so it is important for
 *   us to check for an unpause/resume state.
 */
export const checkForPause = (queue: Queue, queueName: string) => {
  const settingPaused = BULL_MQ_PAUSE_STATES[queueName];
  detachPromise(async () => {
    const currentlyPaused = await queue.isPaused();

    if (settingPaused !== currentlyPaused) {
      logger.info(
        `[bullMq] \x1b[35mSetting pause state ${settingPaused} for queue "${queueName}" due to env variable\x1b[0m`
      );
      currentlyPaused ? await queue.resume() : await queue.pause();
    }
  }, 'bullmq queue init pause');
};

export const queues = Object.keys(queueConfigMap).reduce((out, queueName) => {
  const queue = new Queue(queueName, {
    connection: makeConnectionConfig(false),
  });

  queue.on('error', (err) => {
    logger.error(`Error thrown by '${queue.name}' queue: ${err?.message}`, err);
  });

  out[queueName] = queue;

  checkForPause(queue, queueName);

  return out;
}, {} as { [key in QueueName]: Queue });

interface QueueJobOptions {
  delayInMs?: number;
  runAt?: Date;
}

export const queueJob = async <J extends Job>(
  job: J,
  opts?: QueueJobOptions
) => {
  const config = jobConfigMap[job.jobType] as JobConfig<Job> | undefined;

  if (!config) {
    throw new Error(`No job configuration set for job type '${job.jobType}'`);
  }

  const queueName = config.queueName || QueueName.GeneralBackground;
  const queue = queues[queueName];

  if (!queue) {
    throw new Error(`No queue configuration set for queue name '${queueName}'`);
  }

  const jobId = await (config.jobIdGetter
    ? config.jobIdGetter(job)
    : undefined);
  const groupId = await (config.groupIdGetter
    ? config.groupIdGetter(job)
    : undefined);

  const delay =
    opts?.delayInMs ??
    (opts?.runAt ? Math.max(0, opts.runAt.getTime() - Date.now()) : undefined);

  return queue.add(job.jobType, job, {
    removeOnComplete: config.keepCompleteForMs
      ? {
          age: config.keepCompleteForMs,
        }
      : true,
    removeOnFail: config.keepFailuresForMs
      ? {
          age: config.keepFailuresForMs,
        }
      : true,
    attempts: config.attempts || 1,
    delay,
    jobId,
    group: groupId ? { id: groupId } : undefined,
    backoff: config.backoff || undefined,
  });
};

/**
 * Close off open connections so we don't leave anything awaiting
 */
export const closeBullMQQueues = async () => {
  const queueList = Object.values(queues);

  await promises.map(queueList, async (queue) => queue.close());
};
