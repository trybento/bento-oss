import { GraphQLNonNull } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { VisualBuilderSession } from 'src/data/models/VisualBuilderSession.model';
import VisualBuilderSessionGraphQlType from '../VisualBuilderSession.graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import EntityId from 'bento-common/graphql/EntityId';
import NoContentError from 'src/errors/NoContentError';
import { VisualBuilderSessionStateEnum } from 'src/graphql/graphQl.types';

export default generateMutation({
  name: 'UpdateVisualBuilderSession',
  description: 'Update an existing visual builder session',
  inputFields: {
    visualBuilderSessionEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    previewData: {
      type: GraphQLJSONObject,
    },
    progressData: {
      type: GraphQLJSONObject,
    },
    state: {
      type: VisualBuilderSessionStateEnum,
    },
  },
  outputFields: {
    visualBuilderSession: {
      type: VisualBuilderSessionGraphQlType,
    },
  },
  mutateAndGetPayload: async (
    { visualBuilderSessionEntityId, previewData, progressData, state },
    { user, organization }
  ) => {
    let visualBuilderSession = await VisualBuilderSession.findOne({
      where: {
        entityId: visualBuilderSessionEntityId,
        organizationId: organization.id,
        userId: user.id,
      },
    });

    if (!visualBuilderSession) {
      throw new NoContentError(
        visualBuilderSessionEntityId,
        'visualBuilderSession'
      );
    }

    visualBuilderSession = await visualBuilderSession.update({
      previewData,
      progressData,
      state,
    });

    return { visualBuilderSession };
  },
});
