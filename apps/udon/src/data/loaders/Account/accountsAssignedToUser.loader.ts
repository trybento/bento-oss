import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import type { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Account } from 'src/data/models/Account.model';

/**
 * @todo drop static loaders and arg
 */
export default function accountsAssignedToUserLoader(loaders: Loaders) {
  return new Dataloader<number, Account[]>(async (userIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          accounts.id as "accountId"
          , users.id as "userId"
        FROM core.accounts
        JOIN core.users
        ON accounts.primary_organization_user_id = users.id
        WHERE users.id IN (:userIds)
          AND accounts.deleted_at IS NULL
					AND users.deleted_at IS NULL
        ORDER BY users.id ASC, accounts.id ASC
      `,
      replacements: {
        userIds: userIds as number[],
      },
    })) as { accountId: number; userId: number }[];

    return loadBulk(
      userIds,
      rows,
      'userId',
      'accountId',
      loaders.accountLoader
    );
  });
}
