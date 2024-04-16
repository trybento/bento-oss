import Dataloader from 'dataloader';
import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { Guide } from 'src/data/models/Guide.model';
import promises from 'src/utils/promises';

export default function guidesForAccountUser(_loaders: Loaders) {
  return new Dataloader<number, Guide[]>(async (accountUserIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          gp.account_user_id AS "accountUserId",
          array_agg(gp.guide_id) AS "guideIds"
        FROM core.guide_participants gp
        JOIN core.guides g
          ON g.id = gp.guide_id
        JOIN core.guide_bases gb
          ON g.created_from_guide_base_id = gb.id
        WHERE gp.account_user_id IN (:accountUserIds)
          AND gb.created_from_template_id IS NOT NULL
          AND gb.deleted_at IS NULL
					AND g.deleted_at IS NULL
					AND gp.obsoleted_at IS NULL
					AND gb.obsoleted_at IS NULL
        GROUP BY gp.account_user_id;
      `,
      replacements: {
        accountUserIds: accountUserIds as number[],
      },
    })) as { accountUserId: number; guideIds: number[] }[];

    const guidesByAccountUserId = await promises.reduce(
      rows,
      async (out, { accountUserId, guideIds }) => {
        out[accountUserId] = await Guide.findAll({ where: { id: guideIds } });

        return out;
      },
      {} as { [key: number]: Guide[] }
    );

    return accountUserIds.map(
      (accountUserId) => guidesByAccountUserId[accountUserId] || []
    );
  });
}
