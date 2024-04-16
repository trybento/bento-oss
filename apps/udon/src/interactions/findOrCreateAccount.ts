import { APOSTROPHE_REGEXP } from 'bento-common/validation/customRules';
import { differenceInMinutes } from 'date-fns';
import { Account } from 'src/data/models/Account.model';
import { Organization } from 'src/data/models/Organization.model';
import ArchivedAccountError from 'src/errors/ArchivedAccountError';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import { createdAtChanged, mutableAttrsChanged } from 'src/utils/helpers';

type AccountInput = {
  externalId: string;
  name?: string | null;
  createdInOrganizationAt?: string | null;
};

type FindOrCreateAccountArgs = {
  organization: Organization;
  accountInput: AccountInput;
  /** Whether or not to update accounts lastActiveAt */
  recordLastActiveAt?: boolean;
};

/**
 * Determines if any of the basic account attributes changed.
 */
export const accountAttrsChanged = (
  existing: Account | null,
  input: AccountInput
): boolean => {
  return (
    !!existing &&
    (mutableAttrsChanged(['name'], existing, input) ||
      createdAtChanged(
        existing.createdInOrganizationAt,
        input.createdInOrganizationAt
      ))
  );
};

export default async function findOrCreateAccount({
  organization,
  accountInput,
  recordLastActiveAt = false,
}: FindOrCreateAccountArgs): Promise<{
  account: Account;
  accountChanged: boolean;
}> {
  const { createdInOrganizationAt, externalId, name } = accountInput;

  if (!name) throw new InvalidPayloadError('Missing account name property');

  // Allow single quote in account name.
  const _name = name ? name.replace(APOSTROPHE_REGEXP, "'") : name;

  if (!_name) throw new InvalidPayloadError(`Invalid account name: "${_name}"`);

  let account = await Account.findOne({
    where: { externalId, organizationId: organization.id },
  });

  if (account?.deletedAt) {
    throw new ArchivedAccountError(account.entityId);
  }

  const accountChanged = accountAttrsChanged(account, accountInput);

  // Update the last active date if it's not yet set OR is more than 30 minutes ago
  const updateLastActiveAt =
    recordLastActiveAt &&
    account &&
    (!account.lastActiveAt ||
      differenceInMinutes(new Date(), account.lastActiveAt) > 30);

  if (!account || accountChanged || updateLastActiveAt) {
    /**
     * Note that we still explicitly UPSERT instead of UPDATE to solve for
     * a race condition whereby multiple requests try create the same account.
     */
    const [newOrUpdatedAccount] = await Account.upsert(
      {
        externalId,
        name: _name,
        organizationId: organization.id,
        createdInOrganizationAt,
        ...(recordLastActiveAt ? { lastActiveAt: new Date() } : undefined),
      },
      {
        returning: true,
        conflictFields: ['organization_id', 'external_id'],
      }
    );

    account = newOrUpdatedAccount;
  }

  return { account, accountChanged };
}
