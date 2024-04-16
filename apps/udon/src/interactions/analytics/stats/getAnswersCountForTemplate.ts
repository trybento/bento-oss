import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

export default async function getAnswersCountForTemplate(
  templateIds: readonly number[]
) {
  if (templateIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
        SELECT
					gb.created_from_template_id AS "templateId",
					COUNT (DISTINCT isa.id) AS "numInputStepAnswers"
				FROM core.input_step_answers isa
				JOIN core.input_step_bases isb
					ON isa.input_step_base_id = isb.id
				JOIN core.guide_step_bases gsb
					ON isb.guide_step_base_id = gsb.id
					AND gsb.deleted_at IS NULL
				JOIN core.guide_bases gb
					ON gsb.guide_base_id = gb.id
				WHERE isa.step_id IS NOT NULL
				AND gb.created_from_template_id IN (:templateIds)
				GROUP BY gb.created_from_template_id
      `,
    replacements: {
      templateIds: templateIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as { numInputStepAnswers: number; templateId: number }[];

  const countByTemplateId = keyBy(rows, 'templateId');
  return templateIds.map(
    (tId) => countByTemplateId[tId]?.numInputStepAnswers ?? 0
  );
}
