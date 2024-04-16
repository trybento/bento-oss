import Dataloader from 'dataloader';
import { queryRunner } from 'src/data';
import { Account } from 'src/data/models/Account.model';
import promises from 'src/utils/promises';

/** Loads accounts which have had the given template manually launched */
export default function manuallyLaunchedAccountsLoader() {
  return new Dataloader<number, Account[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          gb.created_from_template_id AS "templateId",
          array_agg(gb.account_id) AS "accountIds"
        FROM core.guide_bases gb
        WHERE gb.created_from_template_id IN (:templateIds)
          AND gb.was_autolaunched = FALSE
        GROUP BY gb.created_from_template_id
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { templateId: number; accountIds: number[] }[];

    const accountsByTemplateId = await promises.reduce(
      rows,
      async (out, { templateId, accountIds }) => {
        out[templateId] = await Account.findAll({ where: { id: accountIds } });

        return out;
      },
      {} as { [key: number]: Account[] }
    );

    return templateIds.map(
      (templateId) => accountsByTemplateId[templateId] || []
    );
  });
}
