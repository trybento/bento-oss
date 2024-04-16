import { FindOptions, InferAttributes, Op } from 'sequelize';
import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import { JobHandler } from 'src/jobsBull/handler';
import { DeleteNpsSurveyJob, JobType } from 'src/jobsBull/job';
import { Logger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';

const DELETE_BATCH_SIZE = 5_000;
const JOB_DELAY_MS = 1_000; // 1 second

const deleteParticipants = async (
  organizationId: number,
  npsSurveyId: number
) => {
  const batch = await NpsParticipant.findAll({
    where: { organizationId },
    include: {
      model: NpsSurveyInstance,
      required: true,
      where: {
        createdFromNpsSurveyId: npsSurveyId,
      },
    },
    limit: DELETE_BATCH_SIZE,
    attributes: ['id'],
  });

  const ids = batch.map((participant) => participant.id);

  await NpsParticipant.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });

  return ids.length >= DELETE_BATCH_SIZE;
};

const deleteInstances = async (organizationId: number, npsSurveyId: number) => {
  const batch = await NpsSurveyInstance.findAll({
    where: { organizationId, createdFromNpsSurveyId: npsSurveyId },
    limit: DELETE_BATCH_SIZE,
    attributes: ['id'],
  });

  const ids = batch.map((instance) => instance.id);

  await NpsSurveyInstance.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });

  return ids.length >= DELETE_BATCH_SIZE;
};

const requeueJob = async (
  organizationId: number,
  npsSurveyId: number,
  logger: Logger
) => {
  logger.debug(`Queueing next deletion batch for survey '${npsSurveyId}'`);

  await queueJob(
    {
      jobType: JobType.DeleteNpsSurvey,
      organizationId,
      npsSurveyId,
    },
    { delayInMs: JOB_DELAY_MS }
  );
};

/**
 * Cleans up a batch of participants and instances for a deleted NPS
 * survey. The logic is idempotent, and can therefore be safely rerun
 * if needed.
 *
 * The job will recursively queue itself until there are no further
 * entities to delete, such that we can still allow other jobs on the
 * worker to be picked up in between.
 */
const handler: JobHandler<DeleteNpsSurveyJob> = async (job, logger) => {
  const { organizationId, npsSurveyId } = job.data;

  logger.debug(`Deleting participants for survey '${npsSurveyId}'`);
  let requeue = await deleteParticipants(organizationId, npsSurveyId);

  if (requeue) {
    return requeueJob(organizationId, npsSurveyId, logger);
  }

  logger.debug(`Deleting instances for survey '${npsSurveyId}'`);
  requeue = await deleteInstances(organizationId, npsSurveyId);

  if (requeue) {
    return requeueJob(organizationId, npsSurveyId, logger);
  }

  logger.debug(`Deleting survey '${npsSurveyId}'`);
  await NpsSurvey.destroy({ where: { id: npsSurveyId }, force: true });
};

export default handler;
