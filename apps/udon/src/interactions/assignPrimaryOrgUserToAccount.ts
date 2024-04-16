import { Account } from 'src/data/models/Account.model';
import { User } from 'src/data/models/User.model';

type Args = {
  account: Account;
  organizationUser?: User | undefined | null;
  shouldAutoAssign?: boolean;
};

export async function assignPrimaryOrgUserToAccount({
  organizationUser,
  account,
  shouldAutoAssign,
}: Args) {
  let orgUserToAssign: User | null = null;

  // Ensure Bento superadmins don't get assigned as CSM's to other orgs' accounts
  const orgUserIsFromSameOrg =
    organizationUser?.organizationId === account.organizationId;
  if (organizationUser && orgUserIsFromSameOrg) {
    orgUserToAssign = organizationUser;
  }

  if (!orgUserToAssign && shouldAutoAssign) {
    // TODO: Have a way of explicitly specifying who is the "default" CSM to assign
    const defaultOrgUserToAssign = await User.findOne({
      where: {
        organizationId: account.organizationId,
      },
      order: [['createdAt', 'ASC']],
    });

    orgUserToAssign = defaultOrgUserToAssign;
  }

  if (!orgUserToAssign) return;

  return account.update({
    primaryOrganizationUserId: orgUserToAssign.id,
  });
}
