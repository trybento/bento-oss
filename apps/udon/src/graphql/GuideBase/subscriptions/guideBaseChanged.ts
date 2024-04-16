import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';

import pubsub from 'src/graphql/pubsub';
import EntityId from 'bento-common/graphql/EntityId';
import GuideBaseType from 'src/graphql/GuideBase/GuideBase.graphql';
import { GraphQLContext } from 'src/graphql/types';
import { withSubscriptionCounter } from 'src/utils/metrics';
import { GUIDE_BASE_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';

const metricName = 'admin_guideBaseChanged';

const GuideBaseChanged: GraphQLFieldConfig<any, GraphQLContext> = {
  description: 'The state of a step was changed by an admin or end user',
  type: GuideBaseType,
  resolve: withSubscriptionResolverPreparation(
    metricName,
    (payload, _args, { loaders }) =>
      loaders.guideBaseEntityLoader.load(payload.entityId)
  ),
  args: {
    guideBaseEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  subscribe: withSubscriptionCounter(
    () => {
      return pubsub.asyncIterator(GUIDE_BASE_CHANGED_TOPIC);
    },
    (payload, variables) => payload.entityId === variables.guideBaseEntityId,
    metricName
  ),
};

export default GuideBaseChanged;
