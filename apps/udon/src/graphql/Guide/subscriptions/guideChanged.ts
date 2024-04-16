import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';

import pubsub from 'src/graphql/pubsub';
import EntityId from 'bento-common/graphql/EntityId';
import GuideType from 'src/graphql/Guide/Guide.graphql';
import { GraphQLContext } from 'src/graphql/types';
import { withSubscriptionCounter } from 'src/utils/metrics';
import { GUIDE_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';

const metricName = 'admin_guideChanged';

const GuideChanged: GraphQLFieldConfig<any, GraphQLContext> = {
  description: 'The state of a step was changed by an admin or end user',
  type: GuideType,
  resolve: withSubscriptionResolverPreparation(
    metricName,
    ({ entityId }, _args, { loaders }) =>
      loaders.guideEntityLoader.load(entityId)
  ),
  args: {
    guideEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  subscribe: withSubscriptionCounter(
    () => {
      return pubsub.asyncIterator(GUIDE_CHANGED_TOPIC);
    },
    (payload, variables) => payload.entityId === variables.guideEntityId,
    metricName
  ),
};

export default GuideChanged;
