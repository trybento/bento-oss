import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

type Args = {
  templateIds: number[];
  queueName?: string;
  staggerTime?: number;
  organizationId: number;
};

/** Time between queue each sync job */
const BATCH_STAGGER = 5000;

/**
 * Call sync template jobs on a number of templates
 */
export default async function batchSyncTemplateChanges({
  templateIds,
  staggerTime = BATCH_STAGGER,
  organizationId,
}: Args) {
  await Promise.all(
    templateIds.map((templateId, i) => {
      return queueJob(
        {
          jobType: JobType.SyncTemplateChanges,
          type: 'template',
          templateId,
          organizationId,
        },
        {
          delayInMs: i * staggerTime,
        }
      );
    })
  );
}
