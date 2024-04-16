import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';

/**
 * Load the number of participants that are using/viewing a particular template
 */
export default function participantCountsLoader() {
  return new Dataloader<number, number>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
					SELECT
						COUNT(DISTINCT gp.id) as count,
						g.created_from_template_id as "templateId"
					FROM core.guide_participants gp
					JOIN core.guides g ON (g.id = gp.guide_id)
					WHERE g.created_from_template_id IN (:moduleId)
					GROUP BY g.created_from_template_id
				`,
      replacements: {
        moduleId: templateIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { count: number; templateId: number }[];

    const rowsByTemplateId = keyBy(rows, 'templateId');
    return templateIds.map(
      (templateId) => rowsByTemplateId[templateId]?.count || 0
    );
  });
}
