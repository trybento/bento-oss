import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import EntityIdType from 'bento-common/graphql/EntityId';

import pubSub from 'src/graphql/pubsub';
import EmbedGuideType from 'src/graphql/embed/EmbedGuide/EmbedGuide.graphql';
import { withSubscriptionCounter } from 'src/utils/metrics';
import { GUIDE_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import { EmbedContext } from 'src/graphql/types';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';

const metricName = 'embed_guideChanged';

const GuideChanged: GraphQLFieldConfig<unknown, EmbedContext> = {
  description: 'A guide or any of its contents changed',
  type: EmbedGuideType,
  resolve: withSubscriptionResolverPreparation(
    metricName,
    async (_p, { guideEntityId }, { loaders }) =>
      loaders.guideEntityLoader.load(guideEntityId)
  ),
  args: {
    guideEntityId: {
      type: new GraphQLNonNull(EntityIdType),
    },
  },
  subscribe: withSubscriptionCounter(
    (_, variables) =>
      pubSub.asyncIterator(`${GUIDE_CHANGED_TOPIC}.${variables.guideEntityId}`),
    () => true,
    metricName
  ),
};

export default GuideChanged;
