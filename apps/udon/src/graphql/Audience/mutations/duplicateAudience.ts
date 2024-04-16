import { GraphQLNonNull, GraphQLString } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import { Audience } from 'src/data/models/Audience.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import AudienceType from '../Audience.graphql';
import { graphQlError } from 'src/graphql/utils';

type Args = {
  entityId: string;
  newName: string;
};

export default generateMutation<unknown, Args>({
  name: 'DuplicateAudience',
  inputFields: {
    entityId: {
      description: 'EntityID of the source audience',
      type: new GraphQLNonNull(EntityId),
    },
    newName: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    audience: { type: AudienceType },
  },
  mutateAndGetPayload: async (
    { entityId, newName },
    { organization, user }
  ) => {
    const audience = await Audience.findOne({
      where: {
        entityId,
        organizationId: organization.id,
      },
    });

    if (!audience) return graphQlError('Audience not found');

    const newAudience = await Audience.create({
      organizationId: organization.id,
      name: newName,
      autoLaunchRules: audience.autoLaunchRules,
      targets: audience.targets,
      editedAt: new Date(),
      editedByUserId: user.id,
    });

    return { audience: newAudience };
  },
});
