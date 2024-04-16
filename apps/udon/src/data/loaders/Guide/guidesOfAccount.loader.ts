import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Guide } from 'src/data/models/Guide.model';

export default function guidesOfAccount(loaders: Loaders) {
  return new Dataloader<number, Guide[]>(async (accountIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          g.id as "guideId"
          , a.id as "accountId"
        FROM core.guides g
        JOIN core.guide_bases gb
        	ON g.created_from_guide_base_id = gb.id
        JOIN core.accounts a
        	ON gb.account_id = a.id
        WHERE a.id IN (:accountIds)
          AND a.deleted_at IS NULL
					AND g.deleted_at IS NULL
        ORDER BY a.id ASC, g.id ASC
      `,
      replacements: {
        accountIds: accountIds as number[],
      },
    })) as { guideId: number; accountId: number }[];

    return loadBulk(
      accountIds,
      rows,
      'accountId',
      'guideId',
      loaders.guideLoader
    );
  });
}
