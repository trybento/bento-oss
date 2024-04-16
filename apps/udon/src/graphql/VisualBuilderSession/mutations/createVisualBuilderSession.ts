import { GraphQLNonNull, GraphQLString } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { VisualBuilderSession } from 'src/data/models/VisualBuilderSession.model';
import VisualBuilderSessionGraphQlType from '../VisualBuilderSession.graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { VisualBuilderSessionTypeEnum } from 'src/graphql/graphQl.types';
import { VisualBuilderSessionState } from 'bento-common/types';
import jwt from 'jsonwebtoken';

export default generateMutation({
  name: 'CreateVisualBuilderSession',
  description: 'Create a new visual builder session',
  inputFields: {
    type: {
      type: new GraphQLNonNull(VisualBuilderSessionTypeEnum),
    },
    initialData: {
      type: new GraphQLNonNull(GraphQLJSONObject),
    },
  },
  outputFields: {
    visualBuilderSession: {
      type: VisualBuilderSessionGraphQlType,
    },
    accessToken: {
      type: GraphQLString,
    },
    appId: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { type, initialData },
    { user, organization }
  ) => {
    const visualBuilderSession = await VisualBuilderSession.create({
      state: VisualBuilderSessionState.PendingUrl,
      organizationId: organization.id,
      userId: user.id,
      type,
      initialData,
    });

    const accessToken = jwt.sign(
      {
        userEntityId: user.entityId,
        organizationEntityId: organization.entityId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1 day' }
    );

    const appId = organization.entityId;

    return { visualBuilderSession, accessToken, appId };
  },
});
