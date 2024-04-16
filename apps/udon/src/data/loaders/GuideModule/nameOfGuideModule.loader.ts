import Dataloader from 'dataloader';
import promises from 'src/utils/promises';
import { keyBy } from 'lodash';
import { moduleNameOrFallback } from 'bento-common/utils/naming';

import { queryRunner } from 'src/data';
import { Loaders } from '..';

/**
 * Loads the name of a Step group at the guide level.
 *
 * The name will either be the name of the GuideModuleBase or the name of the Module it was created from
 * in case the GuideModuleBase has not been modified.
 */
export default function nameOfGuideModuleLoader(_loaders: Loaders) {
  return new Dataloader<number, string>(
    //
    async (guideModuleIds) => {
      const rows = (await queryRunner({
        sql: `--sql
          select
            gm.id as "guideModuleId",
            COALESCE(gmb.name, m.name) as "name"
          from
            core.guide_modules gm
            join core.guide_module_bases gmb on gmb.id = gm.created_from_guide_module_base_id
            join core.modules m on m.id = gmb.created_from_module_id
          where
            gm.id in (:guideModuleIds)
						AND gm.deleted_at IS NULL;
        `,
        replacements: {
          guideModuleIds,
        },
      })) as {
        guideModuleId: number;
        name: string;
      }[];

      const rowsByGuideModuleId = keyBy(rows, 'guideModuleId');

      return promises.map(guideModuleIds, (guideModuleId) => {
        const row = rowsByGuideModuleId[guideModuleId] as
          | undefined
          | (typeof rows)[number];
        return moduleNameOrFallback(row?.name);
      });
    }
  );
}
