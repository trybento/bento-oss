import { uniqBy } from 'lodash';
import { Op, Sequelize, WhereOptions } from 'sequelize';

import { camelToSnakeCase } from 'bento-common/utils/strings';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';

type Args = {
  filterAccountUserEntityId?: string;
  limit?: number;
  query?: string;
  queryField?: keyof Pick<Account, 'name' | 'externalId'>;
  organizationId: number;
};

export default async function searchAccounts({
  filterAccountUserEntityId,
  limit = 20,
  query,
  queryField = 'externalId',
  organizationId,
}: Args) {
  const accountWhere: WhereOptions<any> = {
    organizationId,
    ...(query
      ? {
          [queryField]: {
            [Op.iLike]: `%${query}%`,
          },
        }
      : {}),
  };

  let accounts: Account[];
  if (filterAccountUserEntityId) {
    const accountUsers = await AccountUser.findAll({
      where: { entityId: filterAccountUserEntityId, organizationId },
      include: [
        {
          model: Account.scope('notArchived'),
          where: accountWhere,
          required: true,
        },
      ],
      attributes: ['accountId'],
      limit,
    });

    const uniqByAccountId = uniqBy(accountUsers, 'accountId');

    accounts = uniqByAccountId.map((au) => au.account);
  } else {
    accounts = await Account.scope('notArchived').findAll({
      where: accountWhere,
      limit,
      order: [
        [
          Sequelize.fn(
            'upper',
            Sequelize.col(`Account.${camelToSnakeCase(queryField)}`)
          ),
          'ASC',
        ],
      ],
    });
  }

  return accounts;
}
