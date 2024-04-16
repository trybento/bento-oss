import { BENTO_DOMAIN } from 'shared/constants';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import findOrCreateAccount from 'src/interactions/findOrCreateAccount';
import findOrCreateAccountUser from 'src/interactions/findOrCreateAccountUser';
import { queueIdentifyChecks } from 'src/jobsBull/jobs/handleIdentifyChecks/identifyChecks.helpers';

type IdentifyCreatedUserAsBentoAccountUserArgs = {
  user: User;
  organization: Organization;
};

export async function identifyCreatedUserAsBentoAccountUser({
  user,
  organization,
}: IdentifyCreatedUserAsBentoAccountUserArgs) {
  const bentoOrg = await Organization.findOne({
    where: {
      domain: BENTO_DOMAIN,
    },
  });

  if (!bentoOrg) return;

  const { account, accountChanged } = await findOrCreateAccount({
    organization: bentoOrg,
    accountInput: {
      externalId: organization.entityId,
      name: organization.name,
      createdInOrganizationAt: organization.createdAt.toISOString(),
    },
  });

  if (!account) return;

  const { accountUser, accountUserChanged } = await findOrCreateAccountUser({
    account,
    accountUserInput: {
      externalId: user.entityId,
      fullName: user.fullName,
      email: user.email,
      createdInOrganizationAt: user.createdAt.toISOString(),
    },
    organization: bentoOrg,
    source: 'bentoSignup',
  });

  await queueIdentifyChecks({
    behavior: {
      checkAccountUsers: true,
      checkAccounts: true,
      recordAttributes: false,
      accountChanged,
      accountUserChanged,
    },
    accountEntityId: account.entityId,
    accountUserEntityId: accountUser.entityId,
  });
}
