import Dataloader from 'dataloader';

import { QueryDatabase, queryRunner } from 'src/data';
import type { Loaders } from 'src/data/loaders';
import { groupLoad } from 'src/data/loaders/helpers';
import { User } from 'src/data/models/User.model';
import { AuditEvent } from 'src/utils/auditContext';

/**
 * Gets user that blocked an account
 */
export default function accountsBlockedByLoader(loaders: Loaders) {
  return new Dataloader<number, User | null>(async (accountIds) => {
    const rows = await queryRunner<{ accountId: number; userId: number }[]>({
      sql: `--sql
			SELECT
				aa.account_id AS "accountId",
				u.id AS "userId"
			FROM audit.account_audit aa
			JOIN core.users u ON aa.user_id = u.id
			WHERE
				aa.account_id IN (:accountIds)
				AND u.deleted_at IS NULL
				AND aa.id IN (
					SELECT MAX(id)
					FROM audit.account_audit
					WHERE
					  -- filter account first since it is indexed
						account_id IN (:accountIds)
						AND event_name = :eventName
						GROUP BY account_id
				);
			`,
      replacements: {
        accountIds,
        eventName: AuditEvent.accountBlocked,
      },
      queryDatabase: QueryDatabase.follower,
    });

    return groupLoad(
      accountIds,
      rows,
      'accountId',
      'userId',
      loaders.userLoader
    );
  });
}
