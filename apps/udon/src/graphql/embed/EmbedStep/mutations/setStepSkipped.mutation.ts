import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import EntityId from 'bento-common/graphql/EntityId';

import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import EmbedStepType from '../EmbedStep.graphql';
import { updateGuideLastActiveAt } from 'src/interactions/updateGuideLastActiveAt';
import { setStepSkipped } from 'src/interactions/setStepSkipped';
import { triggerAvailableGuidesChangedForGuides } from 'src/data/eventUtils';
import { guideChanged } from 'src/data/events';
import { isGuideFinished } from 'src/data/models/Guide.model';
import { graphQlError } from 'src/graphql/utils';

type Args = {
  stepEntityId: string;
  isSkipped: boolean;
};

export default generateEmbedMutation<unknown, Args>({
  name: 'SetStepSkipped',
  description: 'Set step skipped',
  inputFields: {
    stepEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    isSkipped: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  outputFields: {
    step: {
      type: EmbedStepType,
    },
  },
  mutateAndGetPayload: async (
    { stepEntityId: entityId, isSkipped },
    { accountUser, organization }
  ) => {
    try {
      const step = await setStepSkipped({
        entityId,
        isSkipped,
        accountUser,
        organization,
      });

      const guide = step.guide;

      if (guide) {
        await updateGuideLastActiveAt({ guide });
        if (isGuideFinished(guide)) {
          triggerAvailableGuidesChangedForGuides([guide]);
        }
        guideChanged(guide.entityId);
      }

      return { step };
    } catch (innerError: any) {
      return graphQlError('Failed to record step as dismissed');
    }
  },
});
