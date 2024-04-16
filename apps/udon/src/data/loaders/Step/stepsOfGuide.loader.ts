import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Step } from 'src/data/models/Step.model';
import { Loaders } from '..';
import { loadBulk } from '../helpers';

const stepsOfGuideLoader = (loaders: Loaders) => {
  return new Dataloader<number, Step[]>(async (guideIds) => {
    const rows = await queryRunner<{ stepId: number; guideId: number }[]>({
      sql: `--sql
        SELECT
          s.id as "stepId"
          , g.id as "guideId"
        FROM core.steps s
          JOIN core.guide_step_bases gsb
            ON gsb.id = s.created_from_guide_step_base_id
						AND gsb.deleted_at IS NULL
          JOIN core.guide_modules gm
            ON s.guide_module_id = gm.id
          JOIN core.guides g
            ON g.id = gm.guide_id
        WHERE
          g.id IN (:guideIds)
					AND gm.deleted_at IS NULL
        ORDER BY
          g.id ASC
          , gm.order_index ASC
          , gsb.order_index ASC
      `,
      replacements: {
        guideIds,
      },
    });

    return loadBulk(guideIds, rows, 'guideId', 'stepId', loaders.stepLoader);
  });
};

export default stepsOfGuideLoader;
