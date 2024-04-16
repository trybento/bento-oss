import Dataloader from 'dataloader';
import { QueryDatabase, queryRunner } from 'src/data';
import { collateLoaderResults } from '../helpers';

export default function guideBasesCountOfAccountLoader() {
  return new Dataloader<number, number>(async (accountIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
        	COUNT (DISTINCT gb.id) AS "guideBasesCount",
        	a.id AS "accountId"
        FROM core.accounts a
        JOIN core.guide_bases gb
          ON gb.account_id = a.id
        JOIN core.templates t
          ON t.id = gb.created_from_template_id
        WHERE
          a.id IN (:accountIds)
          AND a.deleted_at IS NULL
          AND t.archived_at IS NULL
          AND gb.deleted_at IS NULL
					AND gb.obsoleted_at IS NULL
        GROUP BY a.id
      `,
      replacements: {
        accountIds: accountIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { guideBasesCount: number; accountId: number }[];

    return collateLoaderResults(
      accountIds,
      rows,
      'accountId',
      'guideBasesCount',
      0
    ) as number[];
  });
}
