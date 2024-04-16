/**
 * Metric name used to signal jobs queued, started, finished and failed within all of
 * BullMQ job queues.
 */
export const BULL_QUEUE_METRIC_NAME = 'bullmq.queue';

/**
 * Metric name used to record distribution of time taken among tasks.
 */
export const TASK_METRIC_NAME = 'bullmq.task';

/**
 * Default value for soft timeouts, in ms.
 */
export const DEFAULT_SOFT_TIMEOUT = 30 * 1000; // 30s
