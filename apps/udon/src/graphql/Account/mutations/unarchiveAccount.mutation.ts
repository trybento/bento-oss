import { GraphQLNonNull } from 'graphql';

import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';
import AccountType from 'src/graphql/Account/Account.graphql';
import { Account } from 'src/data/models/Account.model';

export default generateMutation({
  name: 'UnarchiveAccount',
  description: 'Unarchive an account of an organization',
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
      },
    });

    if (!account) {
      return {
        errors: ['Account not found'],
      };
    }

    await account.update({ deletedAt: null });

    return { account };
  },
});
