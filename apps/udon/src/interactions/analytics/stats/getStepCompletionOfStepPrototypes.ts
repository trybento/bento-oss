import { uniq } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

type StepCompletionStats = {
  stepPrototypeId?: number;
  templateId?: number;
  stepsCompleted: number;
  totalSteps: number;
  stepsViewed: number;
  stepsInViewedGuides: number;
};

/**
 * Aggregates step prototype stats
 */
export default async function getStepCompletionOfStepPrototypes(
  stepTemplatePairs: { stepPrototypeId: number; templateId: number }[]
) {
  if (stepTemplatePairs.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
			SELECT
				s.created_from_step_prototype_id AS "stepPrototypeId",
				g.created_from_template_id AS "templateId",
				SUM(CASE WHEN s.completed_at IS NOT NULL THEN 1 ELSE 0 END) AS "stepsCompleted",
				COUNT(1) AS "totalSteps",
				SUM(CASE WHEN sp.id IS NOT NULL THEN 1 ELSE 0 END) AS "stepsViewed",
				SUM(CASE WHEN gp.id IS NOT NULL THEN 1 ELSE 0 END) AS "stepsInViewedGuides"
			FROM core.steps s
			JOIN core.guides g ON s.guide_id = g.id
			LEFT JOIN core.guide_participants gp ON gp.id = (
				SELECT gp2.id FROM core.guide_participants gp2
				WHERE gp2.guide_id = g.id AND gp2.first_viewed_at IS NOT NULL
				ORDER BY gp2.id LIMIT 1
			)
			JOIN core.guide_bases gb ON g.created_from_guide_base_id = gb.id
			JOIN core.accounts a ON gb.account_id = a.id
			LEFT JOIN core.step_participants sp ON sp.id = (
				SELECT sp2.id FROM core.step_participants sp2
				WHERE sp2.step_id = s.id
				ORDER BY sp2.id LIMIT 1
			)
			WHERE
				s.created_from_step_prototype_id IN (:stepPrototypeIds)
				AND a.deleted_at IS NULL
			GROUP BY s.created_from_step_prototype_id, g.created_from_template_id;
		`,
    replacements: {
      stepPrototypeIds: uniq(stepTemplatePairs.map((p) => p.stepPrototypeId)),
    },
    queryDatabase: QueryDatabase.follower,
  })) as Array<StepCompletionStats>;

  const dict = rows.reduce((a, v) => {
    a[`${v.stepPrototypeId}-${v.templateId}`] = v;
    return a;
  }, {} as Record<string, StepCompletionStats>);

  return stepTemplatePairs.map((p) => ({
    stepPrototypeId: p.stepPrototypeId,
    templateId: p.templateId,
    stepsCompleted:
      dict[`${p.stepPrototypeId}-${p.templateId}`]?.stepsCompleted ?? 0,
    totalSteps: dict[`${p.stepPrototypeId}-${p.templateId}`]?.totalSteps ?? 0,
    stepsViewed: dict[`${p.stepPrototypeId}-${p.templateId}`]?.stepsViewed ?? 0,
    stepsInViewedGuides:
      dict[`${p.stepPrototypeId}-${p.templateId}`]?.stepsInViewedGuides ?? 0,
  }));
}
