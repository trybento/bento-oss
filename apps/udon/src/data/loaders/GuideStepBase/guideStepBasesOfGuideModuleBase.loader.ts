import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';

export default function guideStepBasesOfGuideModuleBaseLoader(
  loaders: Loaders
) {
  return new Dataloader<number, GuideStepBase[]>(async (guideModuleBaseIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          guide_step_bases.id as "guideStepBaseId"
          , guide_module_bases.id as "guideModuleBaseId"
        FROM core.guide_step_bases
        JOIN core.guide_module_bases
        	ON guide_step_bases.guide_module_base_id = guide_module_bases.id
        WHERE
					guide_module_bases.id IN (:guideModuleBaseIds)
					AND guide_step_bases.deleted_at IS NULL
        ORDER BY guide_module_bases.id ASC, guide_step_bases.order_index ASC
      `,
      replacements: {
        guideModuleBaseIds: guideModuleBaseIds as number[],
      },
    })) as { guideStepBaseId: number; guideModuleBaseId: number }[];

    const rowsByGuideModuleBaseId = groupBy(rows, 'guideModuleBaseId');
    return promises.map(guideModuleBaseIds, (guideModuleBaseId) => {
      const rowsForGuideModuleBaseId =
        rowsByGuideModuleBaseId[guideModuleBaseId] || [];
      return promises.map(rowsForGuideModuleBaseId, (row) =>
        loaders.guideStepBaseLoader.load(row.guideStepBaseId)
      );
    });
  });
}
