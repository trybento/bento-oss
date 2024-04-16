import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

export default function numberGuidesOfTemplate() {
  return new Dataloader<number, number>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
					g.created_from_template_id AS "templateId",
					COUNT(g.id)
				FROM core.guides g
				WHERE g.created_from_template_id IN (:templateIds)
				GROUP BY g.created_from_template_id;
      `,
      replacements: {
        templateIds,
      },
    })) as { templateId: number; count: number }[];

    const countsByTemplateId = keyBy(rows, 'templateId');

    return templateIds.map(
      (templateId) => countsByTemplateId[templateId]?.count ?? 0
    );
  });
}
