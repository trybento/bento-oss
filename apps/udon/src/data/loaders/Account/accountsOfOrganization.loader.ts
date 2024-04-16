import Dataloader from 'dataloader';

import { Account } from 'src/data/models/Account.model';
import { collateLoaderResultsBulk } from '../helpers';

export default function accountsOfOrganization() {
  return new Dataloader<number, Account[]>(async (organizationIds) => {
    const accounts = await Account.scope('notArchived').findAll({
      where: { organizationId: organizationIds },
    });
    return collateLoaderResultsBulk(
      organizationIds,
      accounts,
      'organizationId'
    );
  });
}
