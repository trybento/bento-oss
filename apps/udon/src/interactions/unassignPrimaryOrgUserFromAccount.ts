import { Account } from 'src/data/models/Account.model';

type Args = {
  account: Account;
};

export function unassignPrimaryOrgUserFromAccount({ account }: Args) {
  return account.update({
    primaryOrganizationUserId: null,
  });
}
