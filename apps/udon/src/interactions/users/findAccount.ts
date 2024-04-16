import { Account } from 'src/data/models/Account.model';
import { Organization } from 'src/data/models/Organization.model';

type Args = {
  entityId?: string;
  externalId?: string;
  includeArchived?: boolean;

  organization: Organization;
};

export default async function findAccount({
  entityId,
  externalId,
  includeArchived,
  organization,
}: Args) {
  if (!entityId && !externalId) return null;

  const account = await (includeArchived
    ? Account
    : Account.scope('notArchived')
  ).findOne({
    where: {
      organizationId: organization.id,
      ...(entityId ? { entityId } : { externalId }),
    },
  });

  return account;
}
