import { AccountUser } from 'src/data/models/AccountUser.model';

type Args = {
  accountUser: AccountUser;
};

export type AccountUserAttributes = {
  id: string;
  fullName: string | undefined;
  email: string | undefined;
  createdAt?: string;
  role?: string | undefined;
  [attributeName: string]: string | number | Date | boolean | undefined;
};

export function fetchAttributesForAccountUser({
  accountUser,
}: Args): AccountUserAttributes {
  const baseAttributes = {
    id: accountUser.externalId!,
    fullName: accountUser.fullName,
    email: accountUser.email,
  };

  return {
    ...accountUser.attributes,
    ...baseAttributes,
  };
}
