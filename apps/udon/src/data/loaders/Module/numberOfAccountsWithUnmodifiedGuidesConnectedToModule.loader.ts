import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';

export default function numberOfAccountsWithUnmodifiedGuidesConnectedToModuleLoader() {
  //
  return new Dataloader<number, number>(async (moduleIds) => {
    const rows = (await queryRunner({
      sql: `--sql
      SELECT
        COUNT(DISTINCT guide_bases.account_id) as count,
        modules.id as module_id
      FROM core.modules
      JOIN core.templates_modules
      ON templates_modules.module_id = modules.id
      JOIN core.templates
      ON templates_modules.template_id = templates.id
      JOIN core.guide_bases
      ON guide_bases.created_from_template_id = templates.id
      WHERE guide_bases.is_modified_from_template IS FALSE
      AND modules.id IN (:moduleIds)
      GROUP BY modules.id
    `,
      replacements: {
        moduleIds: moduleIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { count: number; module_id: number }[];

    const rowsByModuleId = keyBy(rows, 'module_id');
    return promises.map(
      moduleIds,
      (moduleId) => rowsByModuleId[moduleId]?.count || 0
    );
  });
}
