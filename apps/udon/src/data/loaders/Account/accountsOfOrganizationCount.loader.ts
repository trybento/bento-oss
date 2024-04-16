import Dataloader from 'dataloader';

import { Account } from 'src/data/models/Account.model';
import { collateLoaderResults } from '../helpers';

export default function accountsOfOrganizationCount() {
  return new Dataloader<number, number>(async (organizationIds) => {
    const accounts = await Account.scope('notArchived').count({
      where: { organizationId: organizationIds },
      attributes: ['organizationId'],
      group: ['organizationId'],
    });
    return collateLoaderResults(
      organizationIds,
      accounts,
      'organizationId',
      'count',
      0
    ) as number[];
  });
}
