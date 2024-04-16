import { GraphQLNonNull } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';

import { recordStepTaggedElementParticipantDismissedAt } from 'src/interactions/recordEvents/recordStepTaggedElementParticipantDismissedAt';
import EmbedTaggedElement from '../EmbedTaggedElement.graphql';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { Guide } from 'src/data/models/Guide.model';
import NoContentError from 'src/errors/NoContentError';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';

export default generateEmbedMutation({
  name: 'RecordTagDismissed',
  description: 'Record tag dismissed',
  inputFields: {
    tagEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    tag: {
      type: EmbedTaggedElement,
    },
  },
  mutateAndGetPayload: async ({ tagEntityId }, { accountUser, loaders }) => {
    if (!tagEntityId) {
      throw new InvalidPayloadError('Missing tag Id');
    }

    const tag = await StepTaggedElement.findOne({
      where: {
        entityId: tagEntityId,
        organizationId: accountUser.organizationId,
      },
      include: [
        {
          model: Guide,
          attributes: ['entityId'],
          required: true,
        },
      ],
    });

    if (!tag) {
      throw new NoContentError(tagEntityId, 'tagged element');
    }

    await recordStepTaggedElementParticipantDismissedAt({
      tag,
      accountUser,
      organizationId: accountUser.organizationId,
    });

    // clear cache for the loader instance
    loaders.stepTaggedElementParticipantForTagAndAccountUserLoader.clear({
      tagId: tag.id,
      accountUserId: accountUser.id,
    });

    return { tag };
  },
});
