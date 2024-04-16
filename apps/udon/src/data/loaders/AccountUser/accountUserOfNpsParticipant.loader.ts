import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { groupLoad } from 'src/data/loaders/helpers';
import { AccountUser } from 'src/data/models/AccountUser.model';

export default function accountUserOfNpsParticipantLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser | null>(
    async (npsParticipantIds) => {
      const rows = (await queryRunner({
        sql: `--sql
        SELECT
          np.id AS "npsParticipantId",
          au.id AS "accountUserId"
        FROM
          core.nps_participants np
          JOIN core.account_users au ON au.id = np.account_user_id
        WHERE
          np.id IN (:npsParticipantIds);
      `,
        replacements: {
          npsParticipantIds,
        },
      })) as { npsParticipantId: number; accountUserId: number }[];

      return groupLoad(
        npsParticipantIds,
        rows,
        'npsParticipantId',
        'accountUserId',
        loaders.accountUserLoader
      );
    }
  );
}
