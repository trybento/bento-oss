import { GraphQLNonNull } from 'graphql';

import { notArchivedCondition } from 'src/data';

import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';
import AccountType from 'src/graphql/Account/Account.graphql';

import { unassignPrimaryOrgUserFromAccount } from 'src/interactions/unassignPrimaryOrgUserFromAccount';
import { Account } from 'src/data/models/Account.model';

export default generateMutation({
  name: 'UnassignPrimaryContactFromAccount',
  description: "Unassign an account's primary contact",
  inputFields: {
    accountEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    account: {
      type: AccountType,
    },
  },
  mutateAndGetPayload: async ({ accountEntityId }, { organization }) => {
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

    await unassignPrimaryOrgUserFromAccount({
      account,
    });

    return { account };
  },
});
