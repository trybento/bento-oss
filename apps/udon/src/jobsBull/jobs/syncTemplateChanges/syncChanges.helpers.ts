import { SyncTemplateChangesJob } from 'src/jobsBull/job';
import { queues } from 'src/jobsBull/queues';

/**
 * How many guide bases we sync at a time when propagation template changes
 *
 * @default 10
 */
export const SYNC_JOB_GUIDE_BASE_BATCH_SIZE = process.env
  .SYNC_JOB_GUIDE_BASE_BATCH_SIZE
  ? Number(process.env.SYNC_JOB_GUIDE_BASE_BATCH_SIZE)
  : 10;

/**
 * How many guides to sync at a time when propagating a guide base or template's changes
 *
 * @default 20
 */
export const SYNC_JOB_GUIDE_BATCH_SIZE = process.env.SYNC_JOB_GUIDE_BATCH_SIZE
  ? Number(process.env.SYNC_JOB_GUIDE_BATCH_SIZE)
  : 20;

export const countJobsWithSyncKey = async (
  type: SyncTemplateChangesJob['type'],
  id: number
) => {
  const groupId = `sync-template-changes-${type}-${id}`;

  const count = await queues.propagation.getGroupJobsCount(groupId);

  return count;
};
