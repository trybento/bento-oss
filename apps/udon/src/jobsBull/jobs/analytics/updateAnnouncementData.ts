import runAnnouncementDataRollup from 'src/jobsBull/jobs/rollupTasks/runAnnouncementDataRollup';
import {
  RollupTypeEnum,
  parsePayloadDate,
  setLastRunTime,
} from 'src/jobsBull/jobs/rollupTasks/rollup.helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { UpdateAnnouncementDataJob } from 'src/jobsBull/job';

/**
 * Special rollup for CTA aggregation data that needs to happen AFTER normal rollup
 *   because it uses the step table data
 *
 * It is not chunked the same way as step/guide data because the starting point is template level
 *   but if it becomes too large we can modify runAnnouncementDataRollup to require templateIds and filter out here
 */
const updateAnnouncementDataTask: JobHandler<
  UpdateAnnouncementDataJob
> = async (job, logger) => {
  const { templateIds, date, lookback, trim } = job.data;
  const rollupInfo = {
    date,
    lookback,
  };

  await parsePayloadDate(rollupInfo, RollupTypeEnum.AnnouncementDataRollups);

  await runAnnouncementDataRollup(rollupInfo, {
    customTemplateIds: templateIds,
    trim,
  });

  await setLastRunTime(RollupTypeEnum.AnnouncementDataRollups);
};

export default updateAnnouncementDataTask;
