import { RateLimiterOptions } from 'bullmq';
import {
  INTEGRATIONS_BULLMQ_CONCURRENCY,
  INTEGRATIONS_BULLMQ_GROUP_CONCURRENCY,
  PRIORITY_WORKER_BULLMQ_CONCURRENCY,
  WORKER_BULLMQ_CONCURRENCY,
  PROPAGATION_QUEUE_CONCURRENCY,
  PROPAGATION_QUEUE_GROUP_CONCURRENCY,
} from 'src/utils/constants';
import {
  ANALYTICS_BULLMQ_RATE_LIMIT,
  INTEGRATIONS_BULLMQ_RATE_LIMIT,
  PROPAGATION_QUEUE_RATE_LIMIT,
} from './constants/rateLimits';

/**
 * Separate task lists for BullMQ to allow for more granular configs
 *
 * Each queue can be paused by an env in this format BULLMQ_[queueName]_PAUSED=true
 * e.g. BULLMQ_ANALYTICS_PAUSED=true
 * See `constants/pauses.ts`
 */
export enum QueueName {
  GeneralBackground = 'background',
  GeneralPriority = 'priority',
  Analytics = 'analytics',
  Integrations = 'integrations',
  Propagation = 'propagation',
}

export interface QueueConfig {
  /**
   * Whether to launch the workers for this queue on priority instances (true)
   * or background instances (falsely).
   *
   * Defaults to background workers if not specified.
   */
  runOnPriorityInstance?: boolean;

  /**
   * The maximum number of concurrent jobs to run in the given queue.
   */
  concurrency: number;

  /**
   * The maximum number of concurrent jobs to run within a group.
   * This is global and across all workers.
   */
  groupConcurrency?: number;

  /**
   * Optional hard rate limit that will put jobs in a waiting state
   * It is configured as count over time in milliseconds.
   * Please be aware that the rate is global to the queue and applies across
   *   multiple workers.
   *
   * See: https://docs.bullmq.io/guide/rate-limiting
   */
  limiter?: RateLimiterOptions;
}

export const queueConfigMap: { [key in QueueName]: QueueConfig } = {
  [QueueName.GeneralBackground]: {
    concurrency: WORKER_BULLMQ_CONCURRENCY,
  },
  [QueueName.GeneralPriority]: {
    runOnPriorityInstance: true,
    concurrency: PRIORITY_WORKER_BULLMQ_CONCURRENCY,
  },
  [QueueName.Analytics]: {
    concurrency: WORKER_BULLMQ_CONCURRENCY,
    limiter: {
      max: ANALYTICS_BULLMQ_RATE_LIMIT,
      duration: 60 * 1000, // per minute, because these are longer jobs.
    },
  },
  [QueueName.Integrations]: {
    concurrency: INTEGRATIONS_BULLMQ_CONCURRENCY,
    groupConcurrency: INTEGRATIONS_BULLMQ_GROUP_CONCURRENCY,
    limiter: {
      max: INTEGRATIONS_BULLMQ_RATE_LIMIT,
      duration: 1000, // per second
    },
  },
  [QueueName.Propagation]: {
    concurrency: PROPAGATION_QUEUE_CONCURRENCY,
    groupConcurrency: PROPAGATION_QUEUE_GROUP_CONCURRENCY,
    limiter: {
      max: PROPAGATION_QUEUE_RATE_LIMIT,
      duration: 1000, // per second
    },
  },
};
