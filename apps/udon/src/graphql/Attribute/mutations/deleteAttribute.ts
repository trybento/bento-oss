import { GraphQLID, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import EntityId from 'bento-common/graphql/EntityId';

import generateMutation from 'src/graphql/helpers/generateMutation';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';

export default generateMutation({
  name: 'DeleteAttribute',
  description: 'Delete an existing module',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    deletedAttributeId: {
      type: GraphQLID,
    },
  },
  mutateAndGetPayload: async ({ entityId }, { organization }) => {
    const customAttribute = await CustomAttribute.findOne({
      where: {
        organizationId: organization.id,
        entityId,
      },
    });

    if (!customAttribute) {
      return {
        errors: ['Attribute not found'],
      };
    }

    await customAttribute.destroy();

    return {
      deletedAttributeId: toGlobalId('CustomAttribute', entityId),
    };
  },
});
