import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { GuideModule } from 'src/data/models/GuideModule.model';

export default function lastIncompleteGuideModuleOfGuideLoader(
  loaders: Loaders
) {
  return new Dataloader<number, GuideModule | null>(async (guideIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          DISTINCT ON (g.id) gm.id as "guideModuleId"
          , g.id as "guideId"
        FROM core.guides g
        LEFT JOIN core.guide_modules gm
        	ON g.id = gm.guide_id
					AND gm.deleted_at IS NULL
        LEFT JOIN core.steps s
        	ON s.guide_module_id = gm.id
        LEFT JOIN core.guide_step_bases gsb
          ON gsb.id = s.created_from_guide_step_base_id
					AND gsb.deleted_at IS NULL
        WHERE
          g.id IN (:guideIds)
        	AND s.is_complete IS FALSE
        ORDER BY
          g.id ASC
          , gm.order_index ASC
          , gsb.order_index ASC
      `,
      replacements: {
        guideIds: guideIds as number[],
      },
    })) as { guideModuleId?: number; guideId: number }[];

    const rowsByGuideId = keyBy(rows, 'guideId');
    return promises.map(guideIds, (guideId) => {
      const guideModuleId = rowsByGuideId[guideId]?.guideModuleId;
      return guideModuleId
        ? loaders.guideModuleLoader.load(guideModuleId)
        : null;
    });
  });
}
