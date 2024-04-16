import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';

export default function participantsWhoViewedGuideModuleBaseLoader(
  loaders: Loaders
) {
  return new Dataloader<number, AccountUser[]>(async (guideModuleBaseIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          account_users.id as "accountUserId",
          guide_module_bases.id as "guideModuleBaseId"
        FROM core.account_users
        JOIN core.guide_participants
        	ON account_users.id = guide_participants.account_user_id
        JOIN core.guides
        	ON guides.id = guide_participants.guide_id
        JOIN core.guide_modules
        	ON guides.id = guide_modules.guide_id
        JOIN core.guide_module_bases
        	ON guide_module_bases.id = guide_modules.created_from_guide_module_base_id
        WHERE guide_module_bases.id IN (:guideModuleBaseIds)
        	AND guide_participants.first_viewed_at IS NOT NULL
					AND guide_modules.deleted_at IS NULL
        ORDER BY guide_module_bases.id ASC, account_users.id asc
      `,
      replacements: {
        guideModuleBaseIds: guideModuleBaseIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { accountUserId: number; guideModuleBaseId: number }[];

    const rowsByGuideModuleBaseId = groupBy(rows, 'guideModuleBaseId');
    return promises.map(guideModuleBaseIds, (guideModuleBaseId) => {
      const rowsForGuideModuleBaseId =
        rowsByGuideModuleBaseId[guideModuleBaseId] || [];
      return promises.map(rowsForGuideModuleBaseId, (row) =>
        loaders.accountUserLoader.load(row.accountUserId)
      );
    });
  });
}
