import { GraphQLFieldConfig, GraphQLList } from 'graphql';

import pubsub from 'src/graphql/pubsub';
import { GraphQLContext } from 'src/graphql/types';
import { withSubscriptionCounter } from 'src/utils/metrics';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';
import { ORGANIZATION_INLINE_EMBEDS_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import InlineEmbedType from '../InlineEmbed.graphql';

const metricName = 'admin_inlineEmbedsChanged';

const inlineEmbedsChanged: GraphQLFieldConfig<
  { organizationId: number },
  GraphQLContext
> = {
  description: "The organization's inline embeds changed",
  type: new GraphQLList(InlineEmbedType),
  resolve: withSubscriptionResolverPreparation(
    metricName,
    (_, __, { loaders, organization }) =>
      loaders.allInlineEmbedsLoader.load(organization.id)
  ),
  subscribe: withSubscriptionCounter(
    () => pubsub.asyncIterator(ORGANIZATION_INLINE_EMBEDS_CHANGED_TOPIC),
    (payload, _, { organization }) =>
      Number(payload.organizationId) === organization.id,
    metricName
  ),
};

export default inlineEmbedsChanged;
