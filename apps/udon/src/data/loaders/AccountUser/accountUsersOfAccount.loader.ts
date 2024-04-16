import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { AccountUser } from 'src/data/models/AccountUser.model';

export default function accountUsersOfAccount(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (accountIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          au.id as "accountUserId",
          au.account_id as "accountId"
        FROM core.accounts a
        JOIN core.account_users au ON au.account_id = a.id
        WHERE a.id IN (:accountIds) AND a.deleted_at IS NULL
        ORDER BY a.id ASC
      `,
      replacements: {
        accountIds: accountIds as number[],
      },
    })) as { accountUserId: number; accountId: number }[];

    return loadBulk(
      accountIds,
      rows,
      'accountId',
      'accountUserId',
      loaders.accountUserLoader
    );
  });
}
