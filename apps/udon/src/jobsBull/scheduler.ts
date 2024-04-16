import { QueuePro } from '@taskforcesh/bullmq-pro';
import { ReturnPromiseType } from 'bento-common/types';

import { Job, JobType } from 'src/jobsBull/job';
import { queues } from 'src/jobsBull/queues';
import { logger } from 'src/utils/logger';
import {
  ANALYTICS_RU_FREQUENCY,
  // GUIDE_RU_FREQUENCY,
  RollupTypeEnum,
} from './jobs/rollupTasks/rollup.constants';
import { QueueName } from './queueConfigMap';

export type RepeatableJob = ReturnPromiseType<
  QueuePro['getRepeatableJobs']
>[number];

export interface ScheduledJobConfig {
  id: string;
  job: Job;
  cron: string;
  queueName?: QueueName;
}

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7, 1L - 7L) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31, L)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, optional)
const config: ScheduledJobConfig[] = [
  {
    id: 'nps_management',
    job: {
      jobType: JobType.ManageNpsSurveys,
    },
    cron: '0 0 0 * * *',
  },
  {
    id: 'queue_rollup_analytics',
    job: {
      jobType: JobType.QueueRollup,
      rollupType: RollupTypeEnum.AnalyticRollups,
    },
    cron: `0 */${ANALYTICS_RU_FREQUENCY} * * * *`,
  },
  // {
  //   id: 'queue_rollup_guide',
  //   job: {
  //     jobType: JobType.QueueRollup,
  //     rollupType: RollupTypeEnum.GuideRollups,
  //   },
  //   cron: `0 */${GUIDE_RU_FREQUENCY} * * * *`,
  // },
  {
    id: 'queue_rollup_guide_daily',
    job: {
      jobType: JobType.QueueRollup,
      rollupType: RollupTypeEnum.GuideDailyRollups,
    },
    cron: `0 0 10 * * *`,
  },
  {
    id: 'expire_guides_daily',
    job: {
      jobType: JobType.ExpireGuides,
    },
    cron: `0 0 10 * * *`,
  },
  {
    id: 'send_end_user_nudges',
    job: {
      jobType: JobType.SendEndUserNudgeBatch,
    },
    // 12:05pm UTC is 7/8am Eastern, 4/5 am Pacific
    cron: '0 5 12 * * *',
  },
  {
    id: 'send_batched_alerts',
    job: {
      jobType: JobType.SendBatchedAlerts,
    },
    cron: '0 5 8 * * *',
  },
  {
    id: 'process_queued_cleanups',
    job: {
      jobType: JobType.ProcessQueuedCleanups,
    },
    cron: '0 0 8 * * *',
  },
  {
    id: 'weekly_cleanup',
    job: {
      jobType: JobType.WeeklyCleanup,
    },
    cron: '0 30 10 * * 7',
  },
  {
    id: 'manage_orgs',
    job: {
      jobType: JobType.ManageOrgs,
    },
    cron: '0 45 9 * * *',
  },
  {
    id: 'update_scheduled_guides',
    job: {
      jobType: JobType.UpdateScheduledGuides,
    },
    cron: '0 20 2,8,14,20 * * *',
  },
];

export const getScheduledJobsToRemove = (
  repeatableJobs: RepeatableJob[],
  scheduledJobs: ScheduledJobConfig[]
) => {
  const toRemove: Pick<(typeof repeatableJobs)[number], 'id' | 'key'>[] = [];

  for (const repeatableJob of repeatableJobs) {
    const configuredJob = scheduledJobs.find(
      (job) => job.id === repeatableJob.id
    );

    if (!configuredJob || configuredJob.cron !== repeatableJob.pattern) {
      toRemove.push({ id: repeatableJob.id, key: repeatableJob.key });
    }
  }

  return toRemove;
};

const removeStaleScheduledJobs = async (
  queue: QueuePro,
  scheduledJobs: ScheduledJobConfig[]
) => {
  const queueName = `${queue.name}:bullmq`;

  logger.info(`[${queueName}] Removing stale scheduled jobs`);

  const configuredJobsForQueue = scheduledJobs.filter(
    (job) => job.queueName === queue.name
  );

  logger.info(
    `[${queueName}] Scheduled jobs configured for queue:\n${
      configuredJobsForQueue.map((j) => `${j.id} -> ${j.cron}`).join(',\n') ||
      '<none>'
    }`
  );

  const repeatableJobs = await queue.getRepeatableJobs();

  logger.info(
    `[${queueName}] Existing scheduled jobs in queue:\n${
      repeatableJobs.map((j) => `${j.id} -> ${j.pattern}`).join(',\n') ||
      '<none>'
    }`
  );

  const toRemove = getScheduledJobsToRemove(
    repeatableJobs,
    configuredJobsForQueue
  );

  for (const { id, key } of toRemove) {
    logger.info(
      `[${queueName}] Job with ID '${id}' no longer exists or schedule has changed - removing`
    );

    await queue.removeRepeatableByKey(key);
  }
};

export const setupScheduledJobs = async () => {
  for (const queue of Object.values(queues)) {
    await removeStaleScheduledJobs(queue, config);
  }

  for (const scheduledJob of config) {
    const queueName = scheduledJob.queueName || QueueName.GeneralBackground;
    const queue = queues[queueName];

    if (!queue) {
      throw new Error(
        `No queue configuration set for queue name '${queueName}'`
      );
    }

    logger.info(
      `[${queue.name}:bullmq] Registering/updating scheduled job with id '${scheduledJob.id}' and cron pattern '${scheduledJob.cron}'`
    );

    await queue.add(scheduledJob.job.jobType, scheduledJob.job, {
      repeat: { pattern: scheduledJob.cron },
      jobId: scheduledJob.id,
      // Remove jobs on completion to make sure we don't hold unnecessary memory.
      removeOnComplete: true,

      // Only remove failed jobs after 72 hours to allow us to rerun them if we want,
      // whilst still preventing unbounded growth on memory usage.
      removeOnFail: {
        age: 60 * 60 * 72,
      },
    });
  }
};
