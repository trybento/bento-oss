import promises from 'src/utils/promises';
import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';
import { StepData } from 'src/data/models/Analytics/StepData.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import getStepCompletionOfStepPrototypes from 'src/interactions/analytics/stats/getStepCompletionOfStepPrototypes';
import { chunkArray } from 'src/utils/helpers';
import {
  isRollupDisabled,
  parsePayloadDate,
  RollupQueryPayload,
  RollupTypeEnum,
  setLastRunTime,
} from 'src/jobsBull/jobs/rollupTasks/rollup.helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, UpdateStepDataJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

const CHUNK_SIZE = Number(process.env.STEP_DATA_CHUNK_SIZE || 35);

/**
 * Special rollup for step aggregation data that needs to happen AFTER normal rollup
 *   because it uses the step table data
 *
 * Should queue incrementally for better scalability as template library grows
 */
const updateStepDataTask: JobHandler<UpdateStepDataJob> = async (
  job,
  logger
) => {
  if (await isRollupDisabled(RollupTypeEnum.StepDataRollups)) return;

  const { stepPrototypeIds, date, organizationId } = job.data;

  /* Handle finding what to update */
  if (!stepPrototypeIds) {
    let spIds: number[] = [];

    if (date === 'all') {
      const allSpds = await StepPrototype.findAll({ attributes: ['id'] });
      spIds = allSpds.map((sp) => sp.id);
    } else if (organizationId) {
      const allSpdsForOrg = await StepPrototype.findAll({
        attributes: ['id'],
        where: {
          organizationId,
        },
      });
      spIds = allSpdsForOrg.map((sp) => sp.id);
    } else {
      if (!date)
        throw new Error(
          'Date required to queue step data rollups without targets'
        );

      /* Create the lookback key */
      const dateOpts: RollupQueryPayload = { date };
      await parsePayloadDate(dateOpts, RollupTypeEnum.StepDataRollups);

      if (!dateOpts.lookback)
        throw new Error('Could not create lookback value');

      spIds = await getStepsActive(dateOpts.lookback);
    }

    const chunkedList = chunkArray(spIds, CHUNK_SIZE);

    for (const stepPrototypeIds of chunkedList) {
      await queueJob({
        jobType: JobType.UpdateStepData,
        stepPrototypeIds,
      });
    }

    logger.debug(
      `[updateStepData] Found ${spIds.length} step protos with recent activity to update`
    );

    await setLastRunTime(RollupTypeEnum.StepDataRollups);
    return;
  }

  /* Handle updating */
  await updateStepDataForStepPrototypes({ stepPrototypeIds });
};

/** steps with step activity will likely have some numbers change */
const getStepsActive = async (lookback: string) => {
  const sql = `--sql
		SELECT DISTINCT
			s.created_from_step_prototype_id AS "stepPrototypeId"
		FROM analytics.step_events se
		JOIN core.steps s ON se.step_entity_id = s.entity_id
		WHERE se.created_at >= NOW() - INTERVAL :lookback;
	`;

  const rows = (await queryRunner({
    sql,
    replacements: { lookback },
    queryDatabase: QueryDatabase.follower,
  })) as { stepPrototypeId: number }[];

  return rows.map((r) => r.stepPrototypeId);
};

export async function updateStepDataForStepPrototypes({
  stepPrototypeIds,
}: {
  stepPrototypeIds: number[];
}) {
  const stepPrototypes = await StepPrototype.findAll({
    where: {
      id: stepPrototypeIds,
    },
    attributes: ['id', 'organizationId'],
  });

  if (stepPrototypes.length === 0) return;

  const spsById = keyBy(stepPrototypes, 'id');

  const pairs = await getTemplatesUsingStepPrototype(stepPrototypeIds);
  const stats = await getStepCompletionOfStepPrototypes(pairs);

  const stepDataUpsert: Array<Partial<StepData>> = stats.map((s) => ({
    stepPrototypeId: s.stepPrototypeId,
    templateId: s.templateId,
    organizationId: spsById[s.stepPrototypeId]?.organizationId,
    associatedSteps: s.totalSteps,
    completedSteps: s.stepsCompleted,
    viewedSteps: s.stepsViewed,
    stepsInViewedGuides: s.stepsInViewedGuides,
  }));

  /* bulkCreate causing issue adding entity_id to its constraint */
  await promises.each(stepDataUpsert, (data) =>
    StepData.upsert(data, {
      conflictFields: ['template_id', 'step_prototype_id', 'organization_id'],
      returning: false,
    })
  );
}

/**
 * An sp can be a part of a template via static, branching or dynamic modules
 */
const getTemplatesUsingStepPrototype = async (stepPrototypeIds: number[]) => {
  const rows = (await queryRunner({
    sql: `--sql
			WITH pairings AS (
				-- Static and dynamic modules
				SELECT
					sp.id AS "stepPrototypeId",
					COALESCE (tm.template_id, malr.target_template_id) as "templateId"
				FROM core.step_prototypes sp
				JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
				LEFT JOIN core.templates_modules tm ON tm.module_id = msp.module_id
				LEFT JOIN core.module_auto_launch_rules malr ON msp.module_id = malr.module_id
				LEFT JOIN core.branching_paths bp ON msp.module_id = bp.module_id
				WHERE sp.id IN (:stepPrototypeIds)

				UNION

				-- Branching targets
				SELECT
					sp.id AS "stepPrototypeId",
					tm.template_id AS "templateId"
				FROM core.step_prototypes sp
				JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
				JOIN core.branching_paths bp ON bp.module_id = msp.module_id
				JOIN core.step_prototypes sp2 ON sp2.entity_id = bp.branching_key
				JOIN core.modules_step_prototypes msp2 ON msp2.step_prototype_id = sp2.id
				JOIN core.templates_modules tm ON tm.module_id = msp2.module_id
				WHERE sp.id IN (:stepPrototypeIds)
			)
			SELECT DISTINCT * FROM pairings
			WHERE "templateId" IS NOT NULL
			ORDER BY 1 ASC;
		`,
    replacements: {
      stepPrototypeIds,
    },
    queryDatabase: QueryDatabase.follower,
  })) as { stepPrototypeId: number; templateId: number }[];

  return rows;
};

export default updateStepDataTask;
