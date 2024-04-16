import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';

export default function countParticipantsWhoViewedGuideModuleBaseLoader() {
  return new Dataloader<number, number>(async (guideModuleBaseIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          COUNT(account_users.id) as "guideModuleBaseParticipantsCount",
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
        GROUP BY guide_module_bases.id
      `,
      replacements: {
        guideModuleBaseIds: guideModuleBaseIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as {
      guideModuleBaseParticipantsCount: number;
      guideModuleBaseId: number;
    }[];

    const rowsByGuideModuleBaseId = keyBy(rows, 'guideModuleBaseId');
    return guideModuleBaseIds.map(
      (guideModuleBaseId) =>
        rowsByGuideModuleBaseId[guideModuleBaseId]
          ?.guideModuleBaseParticipantsCount || 0
    );
  });
}
