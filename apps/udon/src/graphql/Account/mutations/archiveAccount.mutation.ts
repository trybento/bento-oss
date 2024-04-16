import promises from 'src/utils/promises';
import { GraphQLNonNull } from 'graphql';

import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';
import AccountType from 'src/graphql/Account/Account.graphql';
import { Account } from 'src/data/models/Account.model';
import detachPromise from 'src/utils/detachPromise';
import { GuideBase } from 'src/data/models/GuideBase.model';
import updateDataOnGuideBaseDelete from 'src/interactions/analytics/updateDataOnGuideBaseDeleted';

export default generateMutation({
  name: 'ArchiveAccount',
  description: 'Archive an account of an organization',
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

    await account.update({ deletedAt: new Date() });

    /* Update stats for associated guide base */
    detachPromise(
      async () => updateGuideBaseDataForAccount(account),
      'update data on archive'
    );

    return { account };
  },
});

/**
 * Some data will need to be updated as a result of this account no longer counting
 */
const updateGuideBaseDataForAccount = async (account: Account) => {
  const guideBases = await GuideBase.findAll({
    where: {
      accountId: account.id,
    },
    attributes: ['id', 'entityId'],
  });

  await promises.each(guideBases, (guideBase) =>
    updateDataOnGuideBaseDelete(guideBase, true)
  );
};
