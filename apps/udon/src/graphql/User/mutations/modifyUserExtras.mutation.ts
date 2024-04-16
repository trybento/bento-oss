import { GraphQLNonNull, GraphQLString } from 'graphql';

import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';
import { User } from 'src/data/models/User.model';

export default generateMutation({
  name: 'ModifyUserExtrasUser',
  description: 'Append a key to the users extras object',
  inputFields: {
    userEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    key: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {},
  mutateAndGetPayload: async ({ userEntityId, key }, { organization }) => {
    const user = await User.findOne({
      where: {
        entityId: userEntityId,
        organizationId: organization.id,
      },
      attributes: ['id', 'extra'],
    });

    if (!user) {
      return {
        errors: ['User not found'],
      };
    }

    const extra = {
      ...(user.extra || {}),
      [key]: true,
    };

    await user.update({
      extra,
    });

    return;
  },
});
