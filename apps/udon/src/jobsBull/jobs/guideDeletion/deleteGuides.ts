import { Guide } from 'src/data/models/Guide.model';
import clearEventsForGuides from 'src/interactions/analytics/clearEventsForGuides';
import { JobHandler } from 'src/jobsBull/handler';
import { DeleteGuidesJob, JobType } from 'src/jobsBull/job';
import {
  DeleteLevel,
  DeleteLevelGuideBase,
  DeleteStage,
  GUIDE_DELETION_GUIDES_BATCH_SIZE,
  GUIDE_DELETION_GUIDE_BASES_BATCH_SIZE,
} from './helpers';
import { queueJob } from 'src/jobsBull/queues';
import { invalidateLaunchingCacheForOrg } from 'src/interactions/caching/identifyChecksCache';
import { GuideBase } from 'src/data/models/GuideBase.model';
import updateDataOnGuideBaseDelete from 'src/interactions/analytics/updateDataOnGuideBaseDeleted';
import { removeSplitTestLog } from 'src/interactions/library/removeSplitTestLogs';
import { triggerAvailableGuidesChangedForGuideBases } from 'src/data/eventUtils';
import { Logger } from 'src/jobsBull/logger';
import { Template } from 'src/data/models/Template.model';
import { Organization } from 'src/data/models/Organization.model';
import { removeBranchingChoices } from 'src/interactions/branching/removeBranchingChoices';
import deleteTemplateInteraction from 'src/interactions/library/deleteTemplate';

const analyticsHandlers: {
  [key in DeleteLevel]: (resetObjectId: number) => Promise<void>;
} = {
  [DeleteLevel.Template]: async (templateId) => {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      recreate: true,
      templateId,
    });
  },
  [DeleteLevel.GuideBase]: async (guideBaseId) => {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      recreate: true,
      guideBaseId,
    });
  },
  [DeleteLevel.Account]: async (accountId) => {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      recreate: true,
      accountId,
    });
  },
  [DeleteLevel.Guide]: async () => {
    /** No guide-specific analytics. Theoretically the guide's gb could be run but not currently handled. */
  },
};

const queueAnalyticsJobs = async ({
  deleteLevel,
  deleteObjectId,
}: DeleteGuidesJob) => {
  await analyticsHandlers[deleteLevel](deleteObjectId);
};

const deleteGuides = async ({
  deleteLevel,
  deleteObjectId,
  organizationId,
}: DeleteGuidesJob) => {
  const deleteLevelToColumn: { [key in DeleteLevel]: string } = {
    [DeleteLevel.Template]: 'createdFromTemplateId',
    [DeleteLevel.GuideBase]: 'createdFromGuideBaseId',
    [DeleteLevel.Account]: 'accountId',
    [DeleteLevel.Guide]: 'id',
  };

  const column = deleteLevelToColumn[deleteLevel];

  if (!column) {
    throw new Error(`Missing column for delete level '${deleteLevel}'`);
  }

  if (!deleteObjectId) {
    throw new Error(`Missing object ID for delete level '${deleteLevel}'`);
  }

  const guides = await Guide.findAll({
    where: {
      organizationId,
      [column]: deleteObjectId,
    },
    attributes: ['id', 'entityId'],
    paranoid: false,
    limit: GUIDE_DELETION_GUIDES_BATCH_SIZE,
  });

  if (guides.length === 0) {
    return false;
  }

  await clearEventsForGuides({ guides });

  await Guide.destroy({
    where: { id: guides.map((g) => g.id) },
    force: true,
  });

  return true;
};

const deleteGuideBases = async ({
  deleteLevel,
  deleteObjectId,
  organizationId,
}: DeleteGuidesJob) => {
  const deleteLevelToColumn: {
    [key in DeleteLevelGuideBase]: string;
  } = {
    [DeleteLevel.Template]: 'createdFromTemplateId',
    [DeleteLevel.GuideBase]: 'id',
    [DeleteLevel.Account]: 'accountId',
  };

  const column = deleteLevelToColumn[deleteLevel];

  if (!column) {
    throw new Error(`Missing column for delete level '${deleteLevel}'`);
  }

  if (!deleteObjectId) {
    throw new Error(`Missing object ID for delete level '${deleteLevel}'`);
  }

  const guideBases = await GuideBase.findAll({
    where: { [column]: deleteObjectId, organizationId },
    limit: GUIDE_DELETION_GUIDE_BASES_BATCH_SIZE,
    paranoid: false,
  });

  if (guideBases.length === 0) {
    return false;
  }

  const triggerAvailableGuidesChanged =
    triggerAvailableGuidesChangedForGuideBases(guideBases, true);

  for (const guideBase of guideBases) {
    await removeSplitTestLog({ guideBase });
    await updateDataOnGuideBaseDelete(guideBase);

    await guideBase.destroy({ force: true });
  }

  triggerAvailableGuidesChanged();

  return true;
};

const deleteTemplate = async (
  { deleteLevel, deleteObjectId, organizationId }: DeleteGuidesJob,
  logger: Logger
) => {
  if (deleteLevel !== DeleteLevel.Template) {
    logger.error(
      `Attempted to delete template, but delete level was set to '${deleteLevel}'`
    );

    return false;
  }

  if (!deleteObjectId) {
    throw new Error(`Missing object ID for delete level '${deleteLevel}'`);
  }

  const template = await Template.findOne({
    where: { id: deleteObjectId, organizationId },
    include: [
      {
        model: Organization,
        required: true,
      },
    ],
    paranoid: false,
  });

  if (!template) {
    throw new Error(`Template with ID '${deleteObjectId}' not found`);
  }

  await removeBranchingChoices({
    templateId: template.id,
    organization: template.organization,
  });

  await deleteTemplateInteraction({
    organization: template.organization,
    template,
    deleteModules: true,
  });
};

/**
 * Bottom-up bulk deletions
 */
const handler: JobHandler<DeleteGuidesJob> = async (job, logger) => {
  const { data } = job;
  let stage = data._internal?.stage || DeleteStage.Guides;

  if (stage === DeleteStage.Guides) {
    const hasRemainingData = await deleteGuides(data);

    if (!hasRemainingData) {
      /** If we are only removing guides, no need to progress to next stage. */
      stage =
        data.deleteLevel === DeleteLevel.Guide
          ? DeleteStage.Complete
          : DeleteStage.GuideBases;
    }
  } else if (stage === DeleteStage.GuideBases) {
    const hasRemainingData = await deleteGuideBases(data);

    if (!hasRemainingData) {
      stage =
        data.deleteLevel === DeleteLevel.Template
          ? DeleteStage.Template
          : DeleteStage.Complete;
    }
  } else if (stage === DeleteStage.Template) {
    await deleteTemplate(data, logger);

    stage = DeleteStage.Complete;
  } else {
    throw new Error(`Unknown stage '${stage}'`);
  }

  if (stage === DeleteStage.Complete) {
    await queueAnalyticsJobs(data);
    await invalidateLaunchingCacheForOrg(
      data.organizationId,
      'deleteGuidesTask'
    );
  } else {
    await queueJob({
      ...data,
      _internal: {
        stage,
      },
    });
  }
};

export default handler;
