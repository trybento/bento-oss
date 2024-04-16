import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

/** Loads whether or not a split test spawned any guide bases in any state. */
export default function splitTestHasBeenLaunchedLoader() {
  return new Dataloader<number, boolean>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          gb.created_from_split_test_id AS "templateId"
        FROM core.guide_bases gb
        WHERE gb.created_from_split_test_id IN (:templateIds)
        GROUP BY gb.created_from_split_test_id
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { templateId: number }[];

    const rowsByTemplateId = keyBy(rows, 'templateId');
    return templateIds.map((templateId) => !!rowsByTemplateId[templateId]);
  });
}
