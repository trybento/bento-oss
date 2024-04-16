import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { GuideBase } from 'src/data/models/GuideBase.model';

export default function guideBasesOfAccount(loaders: Loaders) {
  return new Dataloader<number, GuideBase[]>(async (accountIds) => {
    /**
     * Ranking logic based on fetchAvailableGuidesForAccountUser.
     */

    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          guide_bases.id as "guideBaseId"
          , accounts.id as "accountId"
        FROM core.guide_bases
        JOIN core.accounts
        ON guide_bases.account_id = accounts.id
        JOIN core.templates
  		  ON guide_bases.created_from_template_id = templates.id
        WHERE accounts.id IN (:accountIds)
          AND accounts.deleted_at IS NULL
          AND guide_bases.deleted_at IS NULL
					AND guide_bases.obsoleted_at IS NULL
        ORDER BY
          accounts.id ASC,
          templates.priority_ranking ASC,
          (
            CASE
              WHEN templates.is_auto_launch_enabled IS TRUE THEN 1
              ELSE 0
            END
          ) DESC,
          (
            CASE
              WHEN templates.type = 'account' THEN 1
              ELSE 0
            END
          ) DESC,
          guide_bases.activated_at ASC NULLS last
      `,
      replacements: {
        accountIds: accountIds as number[],
      },
    })) as { guideBaseId: number; accountId: number }[];

    return loadBulk(
      accountIds,
      rows,
      'accountId',
      'guideBaseId',
      loaders.guideBaseLoader
    );
  });
}
