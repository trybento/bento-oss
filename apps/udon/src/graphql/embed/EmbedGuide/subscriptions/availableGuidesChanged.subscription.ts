import {
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { withSubscriptionCounter } from 'src/utils/metrics';
import pubSub from 'src/graphql/pubsub';
import EmbedGuide from 'src/graphql/embed/EmbedGuide/EmbedGuide.graphql';
import { AVAILABLE_GUIDES_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import { EmbedContext } from 'src/graphql/types';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';

const metricName = 'embed_availableGuidesChanged';

const availableGuidesChanged: GraphQLFieldConfig<unknown, EmbedContext> = {
  description: 'The guides available to the account user changed',
  type: new GraphQLObjectType({
    name: 'EmbedAvailableGuides',
    fields: {
      guides: {
        type: new GraphQLNonNull(new GraphQLList(EmbedGuide)),
      },
    },
  }),
  resolve: withSubscriptionResolverPreparation(
    metricName,
    async (_p, _a, { accountUser, loaders }) => ({
      guides: await loaders.availableGuidesForAccountUserLoader.load(
        accountUser.id
      ),
    })
  ),
  args: {
    accountUserExternalId: {
      type: GraphQLString,
    },
  },
  subscribe: withSubscriptionCounter(
    (_p, _a, { accountUser }) =>
      pubSub.asyncIterator(
        `${AVAILABLE_GUIDES_CHANGED_TOPIC}.${accountUser.externalId}`
      ),
    () => true,
    metricName
  ),
};

export default availableGuidesChanged;
