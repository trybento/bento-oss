import Dataloader from 'dataloader';
import promises from 'src/utils/promises';
import { keyBy } from 'lodash';
import { moduleNameOrFallback } from 'bento-common/utils/naming';

import { queryRunner } from 'src/data';
import { Loaders } from '..';

/**
 * Loads the name of a Step group at the guide base level.
 *
 * The name will either be the name of the GuideModuleBase or the name of the Module it was created from
 * in case the GuideModuleBase has not been modified.
 */
export default function nameOfGuideModuleBaseLoader(_loaders: Loaders) {
  return new Dataloader<number, string>(
    //
    async (guideModuleBaseIds) => {
      const rows = (await queryRunner({
        sql: `--sql
          select
            gmb.id as "guideModuleBaseId",
            COALESCE(gmb.name, m.name) as "name"
          from
            core.guide_module_bases gmb
            join core.modules m on m.id = gmb.created_from_module_id
          where
            gmb.id in (:guideModuleBaseIds);
        `,
        replacements: {
          guideModuleBaseIds,
        },
      })) as {
        guideModuleBaseId: number;
        name: string;
      }[];

      const rowsByGuideModuleBaseId = keyBy(rows, 'guideModuleBaseId');

      return promises.map(guideModuleBaseIds, (guideModuleBaseId) => {
        const row = rowsByGuideModuleBaseId[guideModuleBaseId] as
          | undefined
          | (typeof rows)[number];
        return moduleNameOrFallback(row?.name);
      });
    }
  );
}
