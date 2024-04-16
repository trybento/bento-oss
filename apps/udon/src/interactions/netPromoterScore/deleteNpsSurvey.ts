import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NoContentError from 'src/errors/NoContentError';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

/**
 * Delay the asynchronous deletion of participants
 * and instances to avoid race conditions where new
 * participants/instances are created whilst a survey
 * is being deleted.
 */
const JOB_DELAY_MS = 30_000;

const deleteNpsSurvey = async ({
  organizationId,
  entityId,
}: {
  organizationId: number;
  entityId: string;
}) => {
  const survey = await NpsSurvey.scope([
    { method: ['fromOrganization', organizationId] },
  ]).findOne({
    where: {
      entityId,
    },
  });

  if (!survey) {
    throw new NoContentError(entityId, 'NPS survey');
  }

  /**
   * Optimistically mark the survey as deleted, and then cleanup the
   * participants and instances asynchronously via a job.
   */
  await survey.destroy();

  await queueJob(
    {
      jobType: JobType.DeleteNpsSurvey,
      organizationId,
      npsSurveyId: survey.id,
    },
    { delayInMs: JOB_DELAY_MS }
  );
};

export default deleteNpsSurvey;
