import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

export default async function getNumberStepsOfTemplate(
  templateIds: readonly number[]
) {
  if (templateIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `
			SELECT t.id as template_id, COUNT(DISTINCT msp.step_prototype_id)::int FROM core.templates t
			JOIN core.templates_modules tm ON t.id = tm.template_id
			JOIN core.modules_step_prototypes msp ON msp.module_id = tm.module_id
			WHERE t.id IN (:templateIds)
			GROUP BY t.id;
		`,
    replacements: { templateIds },
    queryDatabase: QueryDatabase.follower,
  })) as { template_id: number; count: number }[];

  const countByTemplateId = keyBy(rows, 'template_id');

  return templateIds.map((tid) => countByTemplateId[tid]?.count || 0);
}
