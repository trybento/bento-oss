import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';

export default function numberOfAccountsWithUnmodifiedGuidesConnectedToTemplateLoader() {
  //
  return new Dataloader<number, number>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          COUNT(DISTINCT guide_bases.account_id) as count,
          templates.id as template_id
        FROM core.templates
        JOIN core.guide_bases
        ON guide_bases.created_from_template_id = templates.id
        WHERE guide_bases.is_modified_from_template IS FALSE
        AND templates.id IN (:templateIds)
        GROUP BY templates.id
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { count: number; template_id: number }[];

    const rowsByTemplateId = keyBy(rows, 'template_id');
    return promises.map(
      templateIds,
      (templateId) => rowsByTemplateId[templateId]?.count || 0
    );
  });
}
