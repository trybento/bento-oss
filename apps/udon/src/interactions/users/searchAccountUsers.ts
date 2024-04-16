import { Op, Sequelize } from 'sequelize';

import { camelToSnakeCase } from 'bento-common/utils/strings';

import { Account } from 'src/data/models/Account.model';

import { AccountUser } from 'src/data/models/AccountUser.model';

type Args = {
  filterAccountEntityId?: string;
  limit?: number;
  query?: string;
  queryField?: keyof Pick<AccountUser, 'fullName' | 'externalId' | 'email'>;
  organizationId: number;
};

export default async function searchAccountUsers({
  filterAccountEntityId,
  limit = 20,
  query,
  queryField = 'externalId',
  organizationId,
}: Args) {
  const accountUsers = await AccountUser.findAll({
    where: {
      organizationId,
      ...(query
        ? {
            [queryField]: {
              [Op.iLike]: `%${query}%`,
            },
          }
        : {}),
    },
    include: [
      {
        model: Account.scope('notArchived'),
        attributes: [],
        ...(filterAccountEntityId
          ? {
              where: { entityId: filterAccountEntityId },
            }
          : {}),
        required: true,
      },
    ],
    order: [
      [
        Sequelize.fn(
          'upper',
          Sequelize.col(`AccountUser.${camelToSnakeCase(queryField)}`)
        ),
        'ASC',
      ],
    ],
    limit,
  });

  return accountUsers;
}
