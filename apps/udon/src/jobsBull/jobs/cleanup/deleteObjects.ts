import { DestroyOptions } from 'sequelize';
import { Audience } from 'src/data/models/Audience.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';
import { User } from 'src/data/models/User.model';
import { JobHandler } from 'src/jobsBull/handler';
import { DeleteObjectsJob, JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

export type DeleteObjectType =
  | 'guideModule'
  | 'triggeredBranchingPaths'
  | 'guideStepBase'
  | 'user'
  | 'audience';

const DELETION_CHUNK_SIZE = 20;

const handlerMap: Record<
  DeleteObjectType,
  (deleteOpts: DestroyOptions) => Promise<void>
> = {
  guideModule: async (deleteOpts) => {
    await GuideModule.destroy(deleteOpts);
  },
  triggeredBranchingPaths: async (deleteOpts) => {
    await TriggeredBranchingPath.destroy(deleteOpts);
  },
  guideStepBase: async (deleteOpts) => {
    await GuideStepBase.destroy(deleteOpts);
  },
  user: async (deleteOpts) => {
    await User.destroy(deleteOpts);
  },
  audience: async (deleteOpts) => {
    await Audience.destroy(deleteOpts);
  },
};

/**
 * Delete objects async that do not require additional effects
 */
const handler: JobHandler<DeleteObjectsJob> = async ({ data }, logger) => {
  const { type, objectIds, organizationId } = data;

  const deleteNow = objectIds.slice(0, DELETION_CHUNK_SIZE);
  const deleteLater = objectIds.slice(DELETION_CHUNK_SIZE);

  logger.debug(
    `[deleteObjects] deleting ${deleteNow.length} objects of type ${type}`
  );

  const deleteOpts = {
    where: { id: deleteNow, organizationId },
    force: true,
  };

  const handler = handlerMap[type];

  if (!handler) throw new Error(`Unsupported delete object type: ${type}`);

  await handler(deleteOpts);

  if (deleteLater.length === 0) return;

  await queueJob({
    jobType: JobType.DeleteObjects,
    objectIds: deleteLater,
    organizationId,
    type,
  });
};

export default handler;
