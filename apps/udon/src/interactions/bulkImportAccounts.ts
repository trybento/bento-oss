import promises from 'src/utils/promises';
import { Sequelize } from 'sequelize-typescript';

import { withTransaction } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import findOrCreateAccount from 'src/interactions/findOrCreateAccount';

type AccountData = {
  id: string;
  name: string;
};

type AccountsData = AccountData[];

export default async function bulkImportAccountsFromCSV(
  organizationSlug: string,
  accountsData: AccountsData
) {
  const organization = await Organization.findOne({
    where: Sequelize.where(
      Sequelize.fn('lower', Sequelize.col('name')),
      Sequelize.fn('lower', organizationSlug)
    ),
  });

  if (!organization) {
    throw new Error('No organization found');
  }

  const accounts = await withTransaction(
    async () =>
      await promises.mapSeries(
        accountsData,
        async (accountDatum) =>
          (
            await findOrCreateAccount({
              organization,
              accountInput: {
                externalId: accountDatum.id,
                name: accountDatum.name,
              },
            })
          ).account
      )
  );

  return accounts;
}
