import { JobHandler } from 'src/jobsBull/handler';
import { JobType, QueueRollupJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { RollupTypeEnum, isRollupDisabled } from './rollup.helpers';

const handler: JobHandler<QueueRollupJob> = async (job, logger) => {
  const { rollupType } = job.data;

  logger.debug(`[queueRollup] Adding ${rollupType}`);

  switch (rollupType) {
    case RollupTypeEnum.GuideRollups:
      if (await isRollupDisabled(RollupTypeEnum.GuideRollups)) break;

      await queueJob({
        jobType: JobType.RunGuideRollups,
        date: 'last run',
        rollupType,
      });

      break;
    case RollupTypeEnum.GuideDailyRollups:
      if (!(await isRollupDisabled(RollupTypeEnum.GuideDailyRollups))) {
        await queueJob({
          jobType: JobType.RunGuideRollups,
          date: 'yesterday',
          rollupType,
        });
      }

      if (!(await isRollupDisabled(RollupTypeEnum.DataUsageRollups))) {
        await queueJob({ jobType: JobType.RunDataUsageCache });
      }

      break;
    case RollupTypeEnum.AnalyticRollups:
      if (await isRollupDisabled(RollupTypeEnum.AnalyticRollups)) break;

      await queueJob({
        jobType: JobType.RunAnalyticsRollups,
        date: 'last run',
      });

      break;
    default:
      logger.error(`Invalid rollup type: '${rollupType}'`);
  }
};

export default handler;
