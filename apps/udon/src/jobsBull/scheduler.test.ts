import {
  getScheduledJobsToRemove,
  RepeatableJob,
  ScheduledJobConfig,
} from 'src/jobsBull/scheduler';
import { JobType } from 'src/jobsBull/job';

const config: ScheduledJobConfig[] = [
  {
    id: 'daily_metric_morning',
    job: {
      jobType: JobType.ProcessQueuedCleanups,
    },
    cron: '0 0 9 * * *',
  },
  {
    id: 'daily_metric_evening',
    job: {
      jobType: JobType.ProcessQueuedCleanups,
    },
    cron: '0 0 21 * * *',
  },
];

describe('BullMQ scheduler', () => {
  describe('removeStaleScheduledJobs', () => {
    test('removes scheduled jobs that are no longer in configuration', () => {
      const repeatableJobs = [
        {
          id: 'daily_metric_morning',
          key: 'daily_metric_morning_key',
          pattern: '0 0 9 * * *',
        },
        {
          id: 'daily_metric_afternoon',
          key: 'daily_metric_afternoon_key',
          pattern: '0 0 14 * * *',
        },
        {
          id: 'daily_metric_evening',
          key: 'daily_metric_evening_key',
          pattern: '0 0 21 * * *',
        },
      ] as RepeatableJob[];

      const toRemove = getScheduledJobsToRemove(repeatableJobs, config);

      expect(toRemove).toHaveLength(1);

      const { id, key } = toRemove[0];

      expect(id).toBe('daily_metric_afternoon');
      expect(key).toBe('daily_metric_afternoon_key');
    });

    test('removes scheduled jobs that no longer match cron pattern', () => {
      const repeatableJobs = [
        {
          id: 'daily_metric_morning',
          key: 'daily_metric_morning_key',
          pattern: '0 0 9 * * *',
        },
        {
          id: 'daily_metric_evening',
          key: 'daily_metric_evening_key',
          pattern: '0 30 22 * * *',
        },
      ] as RepeatableJob[];

      const toRemove = getScheduledJobsToRemove(repeatableJobs, config);

      expect(toRemove).toHaveLength(1);

      const { id, key } = toRemove[0];

      expect(id).toBe('daily_metric_evening');
      expect(key).toBe('daily_metric_evening_key');
    });

    test("doesn't remove any jobs if ID's and cron patterns match", () => {
      const repeatableJobs = [
        {
          id: 'daily_metric_morning',
          key: 'daily_metric_morning_key',
          pattern: '0 0 9 * * *',
        },
        {
          id: 'daily_metric_evening',
          key: 'daily_metric_evening_key',
          pattern: '0 0 21 * * *',
        },
      ] as RepeatableJob[];

      const toRemove = getScheduledJobsToRemove(repeatableJobs, config);

      expect(toRemove).toHaveLength(0);
    });
  });
});
