import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Step } from 'src/data/models/Step.model';
import { Loaders } from '..';
import { groupLoad } from '../helpers';

const firstIncompleteStepOfGuideLoader = (loaders: Loaders) =>
  new Dataloader<number, Step | null>(async (guideIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          DISTINCT ON (g.id) s.id as "stepId",
          g.id as "guideId"
        FROM
          core.guides g
				LEFT JOIN core.guide_modules gm
					ON g.id = gm.guide_id
				LEFT JOIN core.steps s
					ON s.guide_module_id = gm.id
				LEFT JOIN core.guide_step_bases gsb
					ON gsb.id = s.created_from_guide_step_base_id
					AND gsb.deleted_at IS NULL
        WHERE
          g.id IN (:guideIds)
          AND s.is_complete IS FALSE
					AND gm.deleted_at IS NULL
        ORDER BY
          g.id ASC,
          gm.order_index ASC,
          gsb.order_index ASC
      `,
      replacements: {
        guideIds: guideIds as number[],
      },
    })) as { stepId?: number; guideId: number }[];

    return groupLoad(guideIds, rows, 'guideId', 'stepId', loaders.stepLoader);
  });
export default firstIncompleteStepOfGuideLoader;
