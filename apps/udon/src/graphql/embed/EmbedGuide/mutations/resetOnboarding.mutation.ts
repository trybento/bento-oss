import { GraphQLNonNull } from 'graphql';

import { triggerAvailableGuidesChangedForAccountUsers } from 'src/data/eventUtils';
import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import { resetGuideBranchingPaths } from 'src/interactions/branching/resetGuideBranchingPaths';
import EmbedAccountUserType from 'src/graphql/embed/EmbedAccountUser/EmbedAccountUser.graphql';
import { guideChanged } from 'src/data/events';
import EntityIdType from 'bento-common/graphql/EntityId';

export default generateEmbedMutation({
  name: 'ResetOnboarding',
  description: 'Reset branching guides for account user',
  inputFields: {
    guideEntityId: {
      type: new GraphQLNonNull(EntityIdType),
    },
  },
  outputFields: {
    accountUser: {
      type: EmbedAccountUserType,
    },
  },
  mutateAndGetPayload: async ({ guideEntityId }, { accountUser }) => {
    await resetGuideBranchingPaths({
      accountUser,
      guideEntityId,
    });

    triggerAvailableGuidesChangedForAccountUsers([accountUser]);
    guideChanged(guideEntityId);

    return { accountUser };
  },
});
