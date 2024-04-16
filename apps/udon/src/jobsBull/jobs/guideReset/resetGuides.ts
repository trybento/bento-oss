import { chunk } from 'lodash';
import { queryRunner } from 'src/data';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, ResetGuidesJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import {
  RESET_GUIDES_DB_BATCH_SIZE,
  RESET_GUIDES_QUEUE_BATCH_SIZE,
  ResetLevel,
  clearResettingFlagIfNeeded,
  setResettingFlagForGuideBases,
} from 'src/jobsBull/jobs/guideReset/helpers';
import { Logger } from 'src/jobsBull/logger';

const resetLevelToColumn: { [key in ResetLevel]: string | null } = {
  [ResetLevel.Template]: 'created_from_template_id',
  [ResetLevel.Account]: 'account_id',
  [ResetLevel.GuideBase]: 'id',
};

const getMaximumGuideBaseId = async (data: ResetGuidesJob) => {
  const { _internal, resetLevel, resetObjectId } = data;

  if (_internal?.maximumGuideBaseId !== undefined) {
    return _internal.maximumGuideBaseId;
  }

  if (resetLevel === ResetLevel.GuideBase) {
    return resetObjectId;
  }

  const column = resetLevelToColumn[resetLevel];

  if (!column) {
    throw new Error(`Unexpected reset level '${resetLevel}'`);
  }

  const rows = (await queryRunner({
    sql: `
      SELECT
        COALESCE(MAX(id), -1) AS "maximumGuideBaseId"
      FROM core.guide_bases
      WHERE ${column} = :resetObjectId
    `,
    replacements: {
      resetObjectId,
    },
  })) as { maximumGuideBaseId: number }[];

  return rows[0].maximumGuideBaseId;
};

const getGuideBases = async (data: ResetGuidesJob) => {
  const { _internal, resetLevel, resetObjectId, organizationId } = data;
  const { maximumGuideBaseId, lastGuideBaseId } = _internal || {};

  if (maximumGuideBaseId === undefined) {
    throw new Error("Expected 'maximumGuideBaseId'");
  }

  const column = resetLevelToColumn[resetLevel];

  if (!column) {
    throw new Error(`Unexpected reset level '${resetLevel}'`);
  }

  const rows = (await queryRunner({
    sql: `
      SELECT
        gb.id AS "guideBaseId",
        COUNT(tbp.id) AS "branchingPaths"
      FROM core.guide_bases gb
      LEFT JOIN core.guides g
        ON g.created_from_guide_base_id = gb.id
      LEFT JOIN core.triggered_branching_paths tbp
        ON tbp.created_guide_id = g.id
      WHERE gb.organization_id = :organizationId
        AND gb.${column} = :resetObjectId
        AND gb.id <= :maximumGuideBaseId
        ${lastGuideBaseId ? 'AND gb.id > :lastGuideBaseId' : ''}
      GROUP BY gb.id
      ORDER BY gb.id ASC
      LIMIT ${RESET_GUIDES_DB_BATCH_SIZE}
    `,
    replacements: {
      organizationId,
      resetObjectId,
      maximumGuideBaseId,
      ...(lastGuideBaseId ? { lastGuideBaseId } : {}),
    },
  })) as { guideBaseId: number; branchingPaths?: number }[];

  return rows.reduce((out, { guideBaseId, branchingPaths }) => {
    out.push({ guideBaseId, branched: Number(branchingPaths) > 0 });

    return out;
  }, [] as { guideBaseId: number; branched: boolean }[]);
};

export const handleResetGuides = async (
  jobData: ResetGuidesJob,
  logger: Logger
) => {
  const data: ResetGuidesJob = {
    ...jobData,
    _internal: {
      ...jobData._internal,
      maximumGuideBaseId: await getMaximumGuideBaseId(jobData),
    },
  };

  const { resetLevel, resetObjectId, organizationId, _internal } = data;
  const { maximumGuideBaseId } = _internal || {};

  if (maximumGuideBaseId === -1) {
    logger.debug(
      `No guide bases returned for '${resetLevel}' with ID '${resetObjectId}' - reset complete`
    );

    await clearResettingFlagIfNeeded(data);

    return;
  }

  const guideBases = await getGuideBases(data);

  await setResettingFlagForGuideBases(
    guideBases.map(({ guideBaseId }) => guideBaseId)
  );

  const isLastJob = guideBases.length < RESET_GUIDES_DB_BATCH_SIZE;
  const chunks = chunk(guideBases, RESET_GUIDES_QUEUE_BATCH_SIZE);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    await queueJob({
      jobType: JobType.ResetGuidesForGuideBases,
      organizationId,
      guideBases: chunk,
      isLastJob: isLastJob && i === chunks.length - 1,
      resetLevel,
      resetObjectId,
    });
  }

  if (!isLastJob) {
    logger.debug(
      `Requeuing next batch for '${resetLevel}' with ID '${resetObjectId}'`
    );

    const lastGuideBaseId = guideBases[guideBases.length - 1].guideBaseId;

    await queueJob({
      ...data,
      _internal: {
        ...data._internal,
        lastGuideBaseId,
      },
    });
  } else {
    logger.debug(
      `Finished queueing guide base reset jobs for '${resetLevel}' with ID '${resetObjectId}'`
    );
  }
};

const handler: JobHandler<ResetGuidesJob> = async (job, logger) => {
  try {
    await handleResetGuides(job.data, logger);
  } catch (error) {
    await clearResettingFlagIfNeeded(job.data);

    throw error;
  }
};

export default handler;
