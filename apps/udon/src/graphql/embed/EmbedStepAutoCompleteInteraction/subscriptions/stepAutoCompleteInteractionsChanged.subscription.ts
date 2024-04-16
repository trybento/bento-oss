import {
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import EmbedStepAutoCompleteInteractionType from '../EmbedStepAutoCompleteInteraction';
import { withSubscriptionCounter } from 'src/utils/metrics';
import pubSub from 'src/graphql/pubsub';
import { STEP_AUTO_COMPLETE_INTERACTIONS_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import { EmbedContext } from 'src/graphql/types';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';

const metricName = 'embed_stepAutoCompleteInteractionsChanged';

const stepAutoCompleteInteractionsChanged: GraphQLFieldConfig<
  unknown,
  EmbedContext
> = {
  description:
    'The step auto complete interactions available to the account user changed',
  type: new GraphQLObjectType({
    name: 'EmbedStepAutoCompleteInteractions',
    fields: {
      stepAutoCompleteInteractions: {
        type: new GraphQLNonNull(
          new GraphQLList(EmbedStepAutoCompleteInteractionType)
        ),
      },
    },
  }),
  resolve: withSubscriptionResolverPreparation(
    metricName,
    async (_p, _a, { loaders, accountUser }) => {
      const stepAutoCompleteInteractions =
        await loaders.stepAutoCompleteInteractionsForEmbeddableLoader.load(
          accountUser.id
        );
      return {
        stepAutoCompleteInteractions: stepAutoCompleteInteractions || [],
      };
    }
  ),
  args: {
    accountUserExternalId: {
      type: GraphQLString,
    },
  },
  subscribe: withSubscriptionCounter(
    (_p, _a, { accountUser }) =>
      pubSub.asyncIterator(
        `${STEP_AUTO_COMPLETE_INTERACTIONS_CHANGED_TOPIC}.${accountUser.externalId}`
      ),
    () => true,
    metricName
  ),
};

export default stepAutoCompleteInteractionsChanged;
