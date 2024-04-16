import { GuideBase } from 'src/data/models/GuideBase.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { pauseGuideBase } from 'src/interactions/launching/pauseGuideBase';
import { Model, Op, Sequelize } from 'sequelize';
import { queueJob } from 'src/jobsBull/queues';
import { CleanupScheduledGuideJob, JobType } from 'src/jobsBull/job';
import { DeleteLevel } from 'src/jobsBull/jobs/guideDeletion/helpers';
import { Template } from 'src/data/models/Template.model';
import { TemplateState } from 'src/../../common/types';
import { JobHandler } from 'src/jobsBull/handler';
import { Logger } from 'src/jobsBull/logger';

const BATCH_SIZE = Number(process.env.UNLAUNCHING_BATCH_SIZE || 100);

/**
 * Pauses or removes guides that have passed their scheduled end date.
 * This should handle the cases where a guide was created preemptively where it
 * did not need to be.
 */
export async function cleanupScheduledGuide(
  job: CleanupScheduledGuideJob,
  logger: Logger
) {
  const {
    templateIds,
    batchSize: batchSizeOverride,
    lastGuideBaseId = 0,
  } = job;
  const templateId = templateIds[0];
  // there aren't anymore templates to cleanup so we're done
  if (!templateId) return;

  const batchSize = batchSizeOverride ?? BATCH_SIZE;

  const guideBases = (await GuideBase.scope([
    'active',
    { method: ['fromTemplate', templateId] },
  ]).findAll({
    // needed so it doesn't make the query for the guideBases in a sub-query
    // messing up the aggregation
    subQuery: false,
    where: { id: { [Op.gt]: lastGuideBaseId } },
    attributes: [
      'id',
      'organizationId', // needed for metrics
      [
        Sequelize.cast(
          Sequelize.fn('count', Sequelize.col('guides.id')),
          'int'
        ),
        'guideCount',
      ],
      [
        Sequelize.cast(
          Sequelize.fn('count', Sequelize.col('guides->guideParticipants.id')),
          'int'
        ),
        'guideParticipantCount',
      ],
    ],
    include: [
      {
        model: Guide,
        attributes: [],
        include: [{ model: GuideParticipant, attributes: [] }],
      },
    ],
    limit: batchSize,
    group: 'GuideBase.id',
    order: [['id', 'ASC']],
  })) as (GuideBase &
    Model<{
      guideCount: number;
      guideParticipantCount: number;
    }>)[];

  const fullBatch = guideBases.length === batchSize;

  logger.debug(
    `[cleanupScheduledGuide] template id: ${templateId}, guide bases: ${guideBases.length}`
  );
  for (const guideBase of guideBases) {
    if (
      guideBase.getDataValue('guideCount') === 0 ||
      guideBase.getDataValue('guideParticipantCount') === 0
    ) {
      // Because none of these guide bases had any participants yet they
      // should just be deleted to clean them up since they were likely
      // created preemptively during the pre-launch phase.
      // None of these should trigger any async deletion jobs since the only
      // case where there would be any guides would be for account guides, and
      // only one guide is created for each guide base.
      // Because of that there won't be much to delete so the overall perf
      // impact will be minimal
      // TODO: create a batch helper to reduce queries

      // Optimistically set guide base deletedAt
      await guideBase.destroy();

      // Asynchronously delete guide base
      await queueJob({
        jobType: JobType.DeleteGuides,
        organizationId: guideBase.organizationId,
        deleteLevel: DeleteLevel.GuideBase,
        deleteObjectId: guideBase.id,
      });
    } else {
      // The guide base already has some participants so it should just be
      // paused to prevent any new users from getting the guide
      // TODO: create a batch helper to reduce queries
      await pauseGuideBase(guideBase);
    }
  }

  /**
   * Fallback to adjust state.
   * Update scheduled should have adjusted already.
   */
  await Template.update(
    {
      state: TemplateState.stopped,
    },
    {
      where: {
        id: templateId,
        state: { [Op.ne]: TemplateState.stopped },
      },
    }
  );

  await queueJob({
    jobType: JobType.CleanupScheduledGuide,
    templateIds: fullBatch ? templateIds : templateIds.slice(1),
    batchSize,
    lastGuideBaseId:
      guideBases.length > 0 && fullBatch
        ? guideBases[guideBases.length - 1].id
        : undefined,
  });
}

const handler: JobHandler<CleanupScheduledGuideJob> = async (job, logger) => {
  await cleanupScheduledGuide(job.data, logger);
};

export default handler;
