/**
 * @file Rate limit settings should live here. Provides at-a-glance what controls we have.
 */

/**
 * How many propagation jobs can be processed per second, across all organizations,
 * regardless of how they're grouped.
 *
 * @default 10 per second, or 600 per minute.
 */
export const PROPAGATION_QUEUE_RATE_LIMIT = process.env
  .PROPAGATION_QUEUE_RATE_LIMIT
  ? Number(process.env.PROPAGATION_QUEUE_RATE_LIMIT)
  : 10;

/**
 * How many integration ingestion jobs per org we process at once
 * This is predominately to handle spike protection from bursts of events.
 *
 * The number is the count of events per second before we put tasks in waiting state.
 *
 * @default 80 /s.
 */
export const INTEGRATIONS_BULLMQ_RATE_LIMIT = process.env
  .INTEGRATIONS_BULLMQ_RATE_LIMIT
  ? Number(process.env.INTEGRATIONS_BULLMQ_RATE_LIMIT)
  : 80;

/**
 * How many tasks the analytics queue should pick up per minute
 *
 * Note this is not very fine grain as there are large tasks, and small ones. Usage of this
 *   should be to effectively stop the queue or manage load.
 *
 * @default 10000 /m. At our current usage, this is effectively uncapped.
 */
export const ANALYTICS_BULLMQ_RATE_LIMIT = process.env
  .ANALYTICS_BULLMQ_RATE_LIMIT
  ? Number(process.env.ANALYTICS_BULLMQ_RATE_LIMIT)
  : 10000;
