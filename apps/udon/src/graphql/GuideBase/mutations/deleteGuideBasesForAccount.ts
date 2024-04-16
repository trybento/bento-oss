import { GraphQLNonNull } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import AccountType from 'src/graphql/Account/Account.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import { Account } from 'src/data/models/Account.model';
import deleteGuideBasesForAccount from 'src/interactions/library/deleteGuideBasesForAccount';

export default generateMutation({
  name: 'DeleteGuideBasesForAccount',
  description: 'Delete guide bases for an account',
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
    const account = await Account.scope('notArchived').findOne({
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

    await deleteGuideBasesForAccount({
      account,
      organization,
    });

    return {
      account,
    };
  },
});
