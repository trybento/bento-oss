import { GraphQLNonNull } from 'graphql';

import { notArchivedCondition } from 'src/data';

import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';
import AccountType from 'src/graphql/Account/Account.graphql';

import { assignPrimaryOrgUserToAccount } from 'src/interactions/assignPrimaryOrgUserToAccount';
import { User } from 'src/data/models/User.model';
import { Account } from 'src/data/models/Account.model';

export default generateMutation({
  name: 'AssignPrimaryContactToAccount',
  description: 'Assign a primary contact at the organization to the account',
  inputFields: {
    userEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    accountEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    account: {
      type: AccountType,
    },
  },
  mutateAndGetPayload: async (
    { userEntityId, accountEntityId },
    { organization }
  ) => {
    const user = await User.findOne({
      where: {
        entityId: userEntityId,
        organizationId: organization.id,
      },
    });

    if (!user) {
      return {
        errors: ['User not found'],
      };
    }

    const account = await Account.findOne({
      where: {
        entityId: accountEntityId,
        organizationId: organization.id,
        ...notArchivedCondition,
      },
    });

    if (!account) {
      return {
        errors: ['Account not found'],
      };
    }

    await assignPrimaryOrgUserToAccount({
      organizationUser: user,
      account,
      shouldAutoAssign: false,
    });

    return { account };
  },
});
