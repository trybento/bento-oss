import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { Step } from 'src/data/models/Step.model';
import { Loaders } from '..';

export default function stepsOfGuideModuleLoader(loaders: Loaders) {
  return new Dataloader<number, Step[]>(
    //
    async (guideModuleIds) => {
      const rows = (await queryRunner({
        sql: `--sql
          SELECT
            s.id as "stepId"
            , gm.id as "guideModuleId"
          FROM
            core.steps s
            JOIN core.guide_step_bases gsb
							ON gsb.id = s.created_from_guide_step_base_id
							AND gsb.deleted_at IS NULL
            JOIN core.guide_modules gm
							ON s.guide_module_id = gm.id
          WHERE
            gm.id IN (:guideModuleIds)
						AND gm.deleted_at IS NULL
            -- filter out step instances without references
            AND s.created_from_step_prototype_id IS NOT NULL
            AND s.created_from_guide_step_base_id IS NOT NULL
          ORDER BY
            gm.id ASC
            , gsb.order_index ASC
        `,
        replacements: {
          guideModuleIds: guideModuleIds as number[],
        },
      })) as { stepId: number; guideModuleId: number }[];

      return loadBulk(
        guideModuleIds,
        rows,
        'guideModuleId',
        'stepId',
        loaders.stepLoader
      );
    }
  );
}
