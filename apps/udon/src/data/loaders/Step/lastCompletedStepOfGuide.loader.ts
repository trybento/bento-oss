import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { Step } from 'src/data/models/Step.model';

export default function lastCompletedStepOfGuideLoader(loaders: Loaders) {
  return new Dataloader<number, Step | null>(async (guideIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          DISTINCT ON (g.id) g.id as "guideId"
          , s.id as "stepId"
        FROM
          core.guides g
				JOIN core.guide_modules gm
					ON g.id = gm.guide_id
				LEFT JOIN core.steps s
					ON s.guide_module_id = gm.id
				LEFT JOIN core.guide_step_bases gsb 
					ON gsb.id = s.created_from_guide_step_base_id
					AND gsb.deleted_at IS NULL
        WHERE
          g.id IN (:guideIds)
        	AND s.is_complete IS TRUE
					AND gm.deleted_at IS NULL
        ORDER BY
          g.id ASC
          , gm.order_index DESC
          , gsb.order_index DESC
      `,
      replacements: {
        guideIds: guideIds as number[],
      },
    })) as { stepId: number | undefined; guideId: number }[];

    const rowsByGuideId = keyBy(rows, 'guideId');
    return promises.map(guideIds, (guideId) => {
      const { stepId } = rowsByGuideId[guideId] || {};
      return stepId ? loaders.stepLoader.load(stepId) : null;
    });
  });
}
