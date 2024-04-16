import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { Guide } from 'src/data/models/Guide.model';
import { loadBulk } from '../helpers';

export default function lastViewedGuideOfAccountUserLoader(loaders: Loaders) {
  return new Dataloader<number, Guide[]>(async (accountUserIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
					gp.account_user_id AS "accountUserId",
					g.id AS "guideId"
				FROM core.guide_participants gp
				JOIN core.guides g ON gp.guide_id = g.id
				WHERE gp.account_user_id IN (:accountUserIds)
				ORDER BY gp.account_user_id ASC, g.last_active_at DESC NULLS LAST;
      `,
      replacements: {
        accountUserIds: accountUserIds as number[],
      },
    })) as { accountUserId: number; guideId: number }[];

    const rowsByAccountUserId = groupBy(rows, 'accountUserId');
    const rowsMapped = accountUserIds.map((auId) => ({
      accountUserId: auId,
      guideId: rowsByAccountUserId[auId]?.[0].guideId,
    }));

    return loadBulk(
      accountUserIds,
      rowsMapped,
      'accountUserId',
      'guideId',
      loaders.guideLoader,
      true
    );
  });
}
