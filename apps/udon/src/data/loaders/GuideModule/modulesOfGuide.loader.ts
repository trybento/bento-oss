import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { Loaders } from '..';
import { loadBulk } from '../helpers';

export default function modulesOfGuideLoader(loaders: Loaders) {
  return new Dataloader<number, GuideModule[]>(async (guideIds) => {
    const rows = await queryRunner<
      { guideId: number; guideModuleId: number }[]
    >({
      sql: `--sql
        SELECT
          g.id as "guideId"
          , gm.id as "guideModuleId"
        FROM
          core.guide_modules gm
          JOIN core.guides g ON g.id = gm.guide_id
        WHERE
          g.id IN (:guideIds)
					AND gm.deleted_at IS NULL
        ORDER BY
          g.id ASC
          , gm.order_index ASC
      `,
      replacements: {
        guideIds,
      },
    });

    return loadBulk(
      guideIds,
      rows,
      'guideId',
      'guideModuleId',
      loaders.guideModuleLoader
    );
  });
}
