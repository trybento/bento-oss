import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';

type Args = {
  entityId?: string;
  externalId?: string;
  email?: string;
  organization: Organization;
  attributes?: Array<keyof AccountUser>;
};

export default async function findAccountUser({
  entityId,
  externalId,
  email,
  organization,
  attributes = [],
}: Args) {
  if (!entityId && !externalId && !email) return null;

  const accountUser = await AccountUser.findOne({
    where: {
      ...(entityId ? { entityId } : externalId ? { externalId } : { email }),
      organizationId: organization.id,
    },
    order: [['updatedAt', 'DESC']],
    include: [
      {
        model: Account.scope('notArchived'),
        attributes,
      },
    ],
  });

  return accountUser;
}
