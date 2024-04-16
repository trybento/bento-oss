import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { Step } from 'src/data/models/Step.model';

export default function lastCompletedStepOfGuideBaseLoader(loaders: Loaders) {
  return new Dataloader<number, Step | null>(async (guideBaseIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          DISTINCT ON (gb.id) gb.id as "guideBaseId"
          , s.id as "stepId"
        FROM
          core.guide_bases gb
          JOIN core.guides g
						ON g.created_from_guide_base_id = gb.id
          JOIN core.guide_modules gm
						ON g.id = gm.guide_id
          LEFT JOIN core.steps s
						ON s.guide_module_id = gm.id
          LEFT JOIN core.guide_step_bases gsb
						ON gsb.id = s.created_from_guide_step_base_id
						AND gsb.deleted_at IS NULL
        WHERE
          gb.id IN (:guideBaseIds)
        	AND s.is_complete IS TRUE
					AND gm.deleted_at IS NULL
        ORDER BY
          gb.id ASC
          , gm.order_index DESC
          , gsb.order_index DESC
      `,
      replacements: {
        guideBaseIds: guideBaseIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { stepId: number | undefined; guideBaseId: number }[];

    const rowsByGuideBaseId = keyBy(rows, 'guideBaseId');
    return promises.map(guideBaseIds, (guideBaseId) => {
      const { stepId } = rowsByGuideBaseId[guideBaseId] || {};
      return stepId ? loaders.stepLoader.load(stepId) : null;
    });
  });
}
