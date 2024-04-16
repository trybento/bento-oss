import { Account } from 'src/data/models/Account.model';

type Args = {
  account: Account;
};

export type AccountAttributes = {
  id: string;
  name: string | undefined;
  createdAt: Date | undefined;
  [attributeName: string]: string | number | Date | boolean | undefined;
};

export function fetchAttributesForAccount({
  account,
}: Args): AccountAttributes {
  const baseAttributes = {
    id: account.externalId!,
    name: account.name,
    createdAt: account.createdInOrganizationAt,
  };

  return {
    ...account.attributes,
    ...baseAttributes,
  };
}
