import Dataloader from 'dataloader';
import { GuideState, GuideTypeEnum } from 'src/../../common/types';

import { queryRunner } from 'src/data';
import { collateLoaderResults } from '../helpers';

export default function activeAccountGuidesOfAccountCountLoader() {
  return new Dataloader<number, number>(async (accountIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          COUNT(DISTINCT g.id) as "guidesCount",
          g.account_id as "accountId"
        FROM
          core.accounts a
        JOIN
          core.guides g ON g.account_id = a.id
        WHERE
          a.id IN (:accountIds)
					AND a.deleted_at IS NULL
					AND g.deleted_at IS NULL
          AND g.state = :guideState
          AND t.type = :guideType
        GROUP BY
          a.id
        ORDER BY
          a.id ASC
      `,
      replacements: {
        accountIds: accountIds,
        guideState: GuideState.active,
        guideType: GuideTypeEnum.account,
      },
    })) as { guidesCount: number; accountId: number }[];

    return collateLoaderResults(
      accountIds,
      rows,
      'accountId',
      'guidesCount',
      0
    ) as number[];
  });
}
