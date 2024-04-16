import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Account } from 'src/data/models/Account.model';

export default function accountsUsingTemplateLoader(loaders: Loaders) {
  return new Dataloader<number, Account[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          accounts.id as "accountId"
          , templates.id as "templateId"
        FROM core.accounts
        JOIN core.guide_bases
        ON accounts.id = guide_bases.account_id
        JOIN core.templates
        ON guide_bases.created_from_template_id = templates.id
        WHERE templates.id IN (:templateIds)
          AND accounts.deleted_at IS NULL
        ORDER BY templates.id ASC, accounts.id ASC
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { accountId: number; templateId: number }[];

    return loadBulk(
      templateIds,
      rows,
      'templateId',
      'accountId',
      loaders.accountLoader
    );
  });
}
