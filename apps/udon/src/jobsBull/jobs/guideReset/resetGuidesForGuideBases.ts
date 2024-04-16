import { Op } from 'sequelize';
import {
  GuideBaseState,
  GuideState,
  GuideTypeEnum,
  SelectedModelAttrs,
  SelectedModelAttrsPick,
} from 'bento-common/types';
import { queryRunner } from 'src/data';
import { Guide } from 'src/data/models/Guide.model';
import clearEventsForGuides from 'src/interactions/analytics/clearEventsForGuides';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, ResetGuidesForGuideBasesJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { invalidateLaunchingCacheForOrg } from 'src/interactions/caching/identifyChecksCache';
import { GuideBase, GuideBaseScope } from 'src/data/models/GuideBase.model';
import updateDataOnGuideBaseDelete from 'src/interactions/analytics/updateDataOnGuideBaseDeleted';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import createGuideFromGuideBase from 'src/interactions/createGuideFromGuideBase';
import { removeSplitTestLog } from 'src/interactions/library/removeSplitTestLogs';
import {
  clearResettingFlagIfNeeded,
  ResetLevel,
  RESET_GUIDES_FOR_GUIDE_BASE_BATCH_SIZE,
} from 'src/jobsBull/jobs/guideReset/helpers';
import { Logger } from 'src/jobsBull/logger';
import { Template } from 'src/data/models/Template.model';

const analyticsHandlers: {
  [key in ResetLevel]: (resetObjectId: number) => Promise<void>;
} = {
  [ResetLevel.Template]: async (templateId) => {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      recreate: true,
      templateId,
    });
  },
  [ResetLevel.GuideBase]: async (guideBaseId) => {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      recreate: true,
      guideBaseId,
    });
  },
  [ResetLevel.Account]: async (accountId) => {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      recreate: true,
      accountId,
    });
  },
};

const queueAnalyticsJobs = async ({
  resetLevel,
  resetObjectId,
}: ResetGuidesForGuideBasesJob) => {
  if (resetLevel && resetObjectId) {
    await analyticsHandlers[resetLevel](resetObjectId);
  }
};

const getMaximumGuideId = async (data: ResetGuidesForGuideBasesJob) => {
  const { _internal, guideBases, organizationId } = data;

  if (_internal?.maximumGuideId !== undefined) {
    return _internal.maximumGuideId;
  }

  const rows = (await queryRunner({
    sql: `
      SELECT
        COALESCE(MAX(id), -1) AS maximum_guide_id
      FROM core.guides
      WHERE organization_id = :organizationId
        AND created_from_guide_base_id IN (:guideBaseIds)
    `,
    replacements: {
      organizationId,
      guideBaseIds: guideBases.map(({ guideBaseId }) => guideBaseId),
    },
  })) as { maximum_guide_id: number }[];

  return rows[0].maximum_guide_id;
};

const getGuides = async (data: ResetGuidesForGuideBasesJob) => {
  const { _internal, organizationId } = data;
  const { maximumGuideId, lastGuideId } = _internal || {};

  if (maximumGuideId === undefined) {
    throw new Error("Expected 'maximumGuideId'");
  }

  const guides: SelectedModelAttrs<Guide, 'id' | 'entityId'>[] =
    await Guide.findAll({
      where: {
        organizationId,
        createdFromGuideBaseId: {
          [Op.in]: data.guideBases.map(({ guideBaseId }) => guideBaseId),
        },
        id: {
          [Op.lte]: maximumGuideId,
        },
        ...(lastGuideId ? { id: { [Op.gt]: lastGuideId } } : {}),
      },
      limit: RESET_GUIDES_FOR_GUIDE_BASE_BATCH_SIZE,
      attributes: ['id', 'entityId'],
      order: [['id', 'asc']],
    });

  return guides;
};

const resetGuides = async (
  guides: SelectedModelAttrs<Guide, 'id' | 'entityId'>[]
) => {
  await clearEventsForGuides({ guides });

  await Guide.destroy({
    where: { id: guides.map((g) => g.id) },
    force: true,
  });
};

const resetGuideBases = async (guideBaseIds: number[]) => {
  const guideBases = (await GuideBase.scope({
    method: [
      GuideBaseScope.withTemplate,
      {
        required: true,
        attributes: ['type'],
      },
    ],
  }).findAll({ where: { id: guideBaseIds } })) as Array<
    GuideBase & {
      createdFromTemplate: SelectedModelAttrsPick<Template, 'type'>;
    }
  >;

  for (const guideBase of guideBases) {
    const now = new Date();
    const isAccountGuide =
      guideBase.createdFromTemplate.type === GuideTypeEnum.account;

    await updateDataOnGuideBaseDelete(guideBase);

    if (guideBase.state !== GuideBaseState.active) {
      await guideBase.update({
        state: GuideBaseState.active,
        activatedAt: now,
      });
    }

    /* Delete module bases that came from branching */
    await GuideModuleBase.destroy({
      where: {
        guideBaseId: guideBase.id,
        addedDynamicallyAt: {
          [Op.not]: null,
        },
      },
    });

    /**
     * Account-scoped guides needs to be re-created
     */
    if (isAccountGuide) {
      await createGuideFromGuideBase({
        guideBase,
        state: GuideState.active,
        launchedAt: now,
      });
    }
  }
};

const deleteGuideBases = async (guideBaseIds: number[]) => {
  const guideBases = await GuideBase.findAll({ where: { id: guideBaseIds } });

  for (const guideBase of guideBases) {
    await removeSplitTestLog({ guideBase });
    await updateDataOnGuideBaseDelete(guideBase);

    await guideBase.destroy({ force: true });
  }
};

const handleGuideBases = async (
  guideBases: { guideBaseId: number; branched: boolean }[]
) => {
  const branched = guideBases
    .filter(({ branched }) => branched)
    .map(({ guideBaseId }) => guideBaseId);
  const nonBranched = guideBases
    .filter(({ branched }) => !branched)
    .map(({ guideBaseId }) => guideBaseId);

  await resetGuideBases(nonBranched);
  await deleteGuideBases(branched);
};

export const handleResetForGuideBases = async (
  jobData: ResetGuidesForGuideBasesJob,
  logger: Logger
) => {
  const data: ResetGuidesForGuideBasesJob = {
    ...jobData,
    _internal: {
      ...jobData._internal,
      maximumGuideId: await getMaximumGuideId(jobData),
    },
  };

  const { organizationId, guideBases, isLastJob, _internal } = data;
  const { maximumGuideId } = _internal || {};

  if (maximumGuideId === -1) {
    logger.debug(`No guides returned for given guide bases - reset complete`);

    if (isLastJob) {
      await clearResettingFlagIfNeeded(data);
    }

    return;
  }

  const guides = await getGuides(data);

  await resetGuides(guides);

  if (guides.length === RESET_GUIDES_FOR_GUIDE_BASE_BATCH_SIZE) {
    const lastGuideId = guides[guides.length - 1].id;

    logger.debug(`Requeuing next batch for guide bases`);

    await queueJob({
      ...data,
      _internal: {
        ...data._internal,
        lastGuideId,
      },
    });
  } else {
    await handleGuideBases(guideBases);

    if (isLastJob) {
      await invalidateLaunchingCacheForOrg(
        organizationId,
        'resetGuidesForGuideBasesTask'
      );
      await clearResettingFlagIfNeeded(data);
      await queueAnalyticsJobs(data);
    }

    logger.debug('Reset complete');
  }
};

const handler: JobHandler<ResetGuidesForGuideBasesJob> = async (
  job,
  logger
) => {
  try {
    await handleResetForGuideBases(job.data, logger);
  } catch (error) {
    await clearResettingFlagIfNeeded(job.data);

    throw error;
  }
};

export default handler;
