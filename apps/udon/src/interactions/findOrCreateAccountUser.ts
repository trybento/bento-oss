import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { createdAtChanged, mutableAttrsChanged } from 'src/utils/helpers';

type AccountUserInput = {
  externalId: string;
  email?: string | null;
  fullName?: string | null;
  role?: string | null;
  createdInOrganizationAt?: string | null;
};

type FindOrCreateAccountUserArgs = {
  account: Account;
  accountUserInput: AccountUserInput;
  organization: Organization;
  source?: string;
};

/** Check if user should flag for notifications/analytics */
function isInternalUser({
  email,
  organization,
}: {
  email?: string | null;
  organization: Organization;
}) {
  if (!email) return false;

  return (
    email.endsWith('@trybento.co') ||
    email.endsWith(`@${organization.domain}`) ||
    email.includes(`@${organization.slug}`)
  );
}

/**
 * Determines if any of the basic account user attributes changed.
 */
export const accountUserAttrsChanged = (
  existing: AccountUser | null,
  input: FindOrCreateAccountUserArgs['accountUserInput']
): boolean => {
  return (
    !!existing &&
    (mutableAttrsChanged(['fullName', 'email'], existing, input) ||
      createdAtChanged(
        existing.createdInOrganizationAt,
        input.createdInOrganizationAt
      ))
  );
};

export default async function findOrCreateAccountUser({
  account,
  accountUserInput,
  organization,
  source = 'Unknown',
}: FindOrCreateAccountUserArgs): Promise<{
  accountUser: AccountUser;
  accountUserChanged: boolean;
}> {
  const { externalId, email, fullName, createdInOrganizationAt } =
    accountUserInput;
  const organizationId = organization.id;

  const internal = isInternalUser({
    email,
    organization,
  });

  let accountUser = await AccountUser.findOne({
    where: {
      externalId,
      organizationId: organization.id,
      accountId: account.id,
    },
  });

  const accountUserChanged = accountUserAttrsChanged(
    accountUser,
    accountUserInput
  );

  if (!accountUser || accountUserChanged || accountUser.internal !== internal) {
    /**
     * Note that we still explicitly UPSERT instead of UPDATE to solve for
     * a race condition whereby multiple requests try create the same account user.
     */
    const [newOrUpdatedAccountUser] = await AccountUser.upsert(
      {
        externalId,
        fullName,
        email,
        accountId: account.id,
        organizationId,
        createdInOrganizationAt,
        internal,
      },
      {
        returning: true,
        conflictFields: ['organization_id', 'account_id', 'external_id'],
      }
    );

    accountUser = newOrUpdatedAccountUser;
  }

  return { accountUser, accountUserChanged };
}
