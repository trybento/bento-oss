/**
 * @file Setting anything here causes the queues to be paused when booting up.
 *
 * The expectation is the env change will refresh these processes, and as BullMQ
 *   is instantiated, will check these variables and either init a paused or unpaused
 *   queue.
 *
 * Word of caution: queues can build up. Be sure to manage this attentively or in the future
 *   we can auto-unlock briefly during the off-hours
 */

import { queueConfigMap, QueueName } from '../queueConfigMap';

const queues = Object.keys(queueConfigMap) as QueueName[];

/**
 * env format: BULLMQ_[queueName]_PAUSED='true'
 */
export const BULL_MQ_PAUSE_STATES = queues.reduce<{
  [key in QueueName]?: boolean;
}>((states, queueName) => {
  states[queueName] =
    process.env[`BULLMQ_${queueName.toUpperCase()}_PAUSED`] === 'true';
  return states;
}, {});
