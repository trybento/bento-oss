import { GraphQLNonNull } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import GuideBaseType from 'src/graphql/GuideBase/GuideBase.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import { createGuideBase } from 'src/interactions/createGuideBase';
import { Account } from 'src/data/models/Account.model';
import { graphQlError } from 'src/graphql/utils';

export default generateMutation({
  name: 'CreateGuideBase',
  description: 'Create a new guide base',
  inputFields: {
    accountEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    templateEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    guideBase: {
      type: GuideBaseType,
    },
  },
  mutateAndGetPayload: async (args, { organization, user }) => {
    const { accountEntityId, templateEntityId } = args;

    const account = await Account.scope('notArchived').findOne({
      where: {
        entityId: accountEntityId,
        organizationId: organization.id,
      },
    });

    if (!account) return graphQlError('Account not found');

    const guideBase = await createGuideBase({
      account,
      templateEntityId,
      user,
    });

    return { guideBase };
  },
});
