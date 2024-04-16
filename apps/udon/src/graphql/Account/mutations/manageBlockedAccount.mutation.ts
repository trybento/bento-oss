import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { enumToGraphqlEnum } from 'bento-common/utils/graphql';

import generateMutation from 'src/graphql/helpers/generateMutation';
import AccountType from 'src/graphql/Account/Account.graphql';
import { Account } from 'src/data/models/Account.model';
import promises from 'src/utils/promises';
import deleteGuideBasesForAccount from 'src/interactions/library/deleteGuideBasesForAccount';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';

enum ManageAction {
  add = 'add',
  remove = 'remove',
}

type Args = {
  accountName: string;
  action: ManageAction;
};

const ManageActionType = enumToGraphqlEnum({
  name: 'ManageActionType',
  enumType: ManageAction,
});

export default generateMutation({
  name: 'ManageBlockedAccount',
  description: 'Block or unblock an account of an organization',
  inputFields: {
    accountName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    action: {
      type: ManageActionType,
    },
  },
  outputFields: {
    account: {
      type: new GraphQLList(AccountType),
    },
  },
  mutateAndGetPayload: async (
    { accountName, action }: Args,
    { organization, user }
  ) => {
    /** If we're adding an account to the blocked list */
    const isAdding = action === ManageAction.add;

    const [_, accounts] = await Account.update(
      {
        blockedAt: isAdding ? new Date() : null,
      },
      {
        where: {
          name: accountName,
          organizationId: organization.id,
        },
        returning: true,
      }
    );

    if (!accounts.length) return { accounts: [] };

    await promises.each(accounts, async (account) => {
      new AuditContext({
        type: AuditType.Account,
        modelId: account.id,
        organizationId: organization.id,
        userId: user.id,
      }).logEvent({
        eventName: isAdding
          ? AuditEvent.accountBlocked
          : AuditEvent.accountUnblocked,
      });

      if (action === ManageAction.remove) return;

      /* Strip accounts of their current guides */
      await deleteGuideBasesForAccount({
        account,
        organization,
      });
    });

    return { accounts };
  },
});
