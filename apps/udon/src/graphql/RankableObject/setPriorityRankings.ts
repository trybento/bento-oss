import { GraphQLList, GraphQLNonNull } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import {
  RankableObjectInputType,
  RankableObjectType,
} from 'src/graphql/RankableObject/helpers';
import { setPriorityRanking } from 'src/interactions/setPriorityRankings';

export default generateMutation({
  name: 'SetPriorityRankings',
  description: 'Set the priority ranking for rankable objects.',
  inputFields: {
    targets: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(RankableObjectInputType))
      ),
    },
  },
  outputFields: {
    targets: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(RankableObjectType))
      ),
    },
  },
  mutateAndGetPayload: async ({ targets }, { organization, user }) => {
    await setPriorityRanking({
      targets,
      organizationId: organization.id,
      user,
    });

    return { targets };
  },
});
