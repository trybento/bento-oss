import { isSunday } from 'date-fns';
import { withTransaction } from 'src/data';
import { endOrgTrials, manageExpiredOrgs } from './manageOrgs.helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { ManageOrgsJob } from 'src/jobsBull/job';

/**
 * This task handles managing org states and deletion.
 *   Created to perform checks and operations daily in the off-hours
 */
const handler: JobHandler<ManageOrgsJob> = async (job, logger) => {
  const { forceDeleteCheck } = job.data;
  await withTransaction(async () => {
    // Find all Orgs w/ ended trials that need to be marked as `inactive`
    await endOrgTrials(logger);
  });

  /* Check org cleanups on the weekend */
  const now = new Date();
  if (isSunday(now) || forceDeleteCheck) await manageExpiredOrgs(logger);
};

export default handler;
