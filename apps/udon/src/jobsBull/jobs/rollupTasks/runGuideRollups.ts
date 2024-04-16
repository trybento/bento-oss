import { runFollowerQueryPair } from 'src/jobsBull/workerBull.helpers';
import {
  getTimeClause,
  isRollupDisabled,
  parsePayloadDate,
  RollupQueryPayload,
  RollupTypeEnum,
  setLastRunTime,
} from './rollup.helpers';
import { GUIDE_RU_FREQUENCY } from './rollup.constants';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, RunGuideRollupsJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

/** Lookup by event template source. Expects "core.guides g" joined */
const getTemplateClause = () => `
	g.created_from_template_id IN (:templateIds)
	AND e.created_at >= NOW() - INTERVAL '${GUIDE_RU_FREQUENCY} minutes'
`;

/* Step rollup for step view data */

const getStepQuery = (payload: RollupQueryPayload) => `
SELECT DISTINCT
    o.id
		 AS "organizationId"
    , au.id as "accountUserId"
    , s.id as "stepId"
    , s.created_from_step_prototype_id as "stepPrototypeId"
    , e.created_at::date as date
FROM
    analytics.step_events e
JOIN
    core.organizations o on (e.organization_entity_id = o.entity_id)
JOIN
    core.account_users au on (e.account_user_entity_id = au.entity_id)
JOIN
    core.steps s on (e.step_entity_id = s.entity_id)
${
  payload.templateIds
    ? `
JOIN core.guides g ON s.guide_id = g.id AND g.deleted_at IS NULL
`
    : ''
}
WHERE
    ${payload.templateIds ? getTemplateClause() : getTimeClause(payload)}
AND
    s.created_from_step_prototype_id is not null
AND
    e.event_name like 'step_view%';
`;

const stepInsertSql = `
	INSERT INTO analytics.step_daily_rollup(organization_id, account_user_id, step_id, step_prototype_id, date)
		VALUES (:organizationId, :accountUserId, :stepId, :stepPrototypeId, :date)
	ON CONFLICT DO NOTHING
`;

/* Guide rollup for guide data */

const getGuideQuery = (payload: RollupQueryPayload) => `
SELECT DISTINCT
    o.id as "organizationId"
    , au.id as "accountUserId"
    , g.id as "guideId"
    , g.created_from_template_id as "templateId"
    , e.created_at::date as date
FROM
    analytics.events e
JOIN
    core.organizations o on (e.organization_entity_id = o.entity_id)
JOIN
    core.account_users au on (e.account_user_entity_id = au.entity_id)
JOIN
    core.guides g on (e.guide_entity_id = g.entity_id)
WHERE
    e.event_name like 'guide_view%'
AND
    g.created_from_template_id is not null
AND
		${payload.templateIds ? getTemplateClause() : getTimeClause(payload)}
    ;
`;

const guideInsertSql = `
	INSERT INTO analytics.guide_daily_rollup(organization_id, account_user_id, guide_id, template_id, date)
		VALUES (:organizationId, :accountUserId, :guideId, :templateId, :date)
	ON CONFLICT DO NOTHING
`;

/* Guide data rollup for guide analytics */

// TODO: Refactor into updateGuideData. this only handles ctasClicked.
const getGuideDataQuery = (payload: RollupQueryPayload) => `--sql
	SELECT
		o.id AS "organizationId",
		g.created_from_guide_base_id AS "guideBaseId",
		COUNT(se.id) AS "ctasClicked"
	FROM analytics.step_events se
	JOIN core.organizations o ON se.organization_entity_id = o.entity_id
	JOIN core.steps s ON se.step_entity_id = s.entity_id
	JOIN core.guides g ON s.guide_id = g.id AND g.deleted_at IS NULL
	-- only update the rows that have had recent cta_clicked activity
	WHERE
		se.event_name like 'cta_clicked' AND
		g.created_from_guide_base_id IN (
			SELECT DISTINCT
				g.created_from_guide_base_id as id
			FROM analytics.step_events e
			JOIN core.organizations o on (e.organization_entity_id = o.entity_id)
			JOIN core.steps s ON e.step_entity_id = s.entity_id
			JOIN core.guides g on s.guide_id = g.id AND g.deleted_at IS NULL
			WHERE
				e.event_name like 'cta_clicked' AND
				g.created_from_template_id is not null AND
				${payload.templateIds ? getTemplateClause() : getTimeClause(payload)}
		)
	GROUP BY o.id, g.created_from_guide_base_id
`;

const guideDataInsertSql = `
	INSERT INTO analytics.guide_data(organization_id, guide_base_id, ctas_clicked)
		VALUES (:organizationId, :guideBaseId, :ctasClicked)
	ON CONFLICT (organization_id, guide_base_id) DO UPDATE
		SET
			ctas_clicked = EXCLUDEd.ctas_clicked
`;

export const runStepRollup = async (payload: RollupQueryPayload) =>
  runFollowerQueryPair({
    readSql: getStepQuery(payload),
    writeSql: stepInsertSql,
    payload,
  });

export const runGuideRollup = async (payload: RollupQueryPayload) =>
  runFollowerQueryPair({
    readSql: getGuideQuery(payload),
    writeSql: guideInsertSql,
    payload,
  });

/** @deprecated Will be replaced when analytics v2 changes are done and we no longer want ctasClicked */
export const runGuideDataRollup = async (payload: RollupQueryPayload) =>
  runFollowerQueryPair({
    readSql: getGuideDataQuery(payload),
    writeSql: guideDataInsertSql,
    payload,
  });

/**
 * Run rollup task. We want two variants:
 *  - 5min "today" job for current items to keep the data more up-to-date
 *  - 24h "yesterday" job to catch the edge cases of racey data as the date changes
 */
const handler: JobHandler<RunGuideRollupsJob> = async (job, logger) => {
  const payload = job.data;

  if (!payload.date) {
    logger.error(`Invalid payload (expected date): '${payload.date}'`);
    return;
  }

  const rollupType =
    payload.date === 'yesterday'
      ? RollupTypeEnum.GuideDailyRollups
      : RollupTypeEnum.GuideRollups;

  await parsePayloadDate(payload, rollupType);

  logger.debug(`Running backfill for ${payload.date}`);

  await runStepRollup(payload);
  await runGuideRollup(payload);
  await runGuideDataRollup(payload);

  if (!(await isRollupDisabled(RollupTypeEnum.GuideDataRollups))) {
    await queueJob({
      jobType: JobType.UpdateGuideData,
      date: payload.date,
    });
  }

  if (!(await isRollupDisabled(RollupTypeEnum.StepDataRollups))) {
    await queueJob({ jobType: JobType.UpdateStepData, date: payload.date });
  }

  if (!(await isRollupDisabled(RollupTypeEnum.AnnouncementDataRollups))) {
    await queueJob({
      ...payload,
      jobType: JobType.UpdateAnnouncementData,
    });
  }

  await setLastRunTime(rollupType);
};

export default handler;
