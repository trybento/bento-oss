import { GraphQLFieldConfig, GraphQLList } from 'graphql';

import pubSub from 'src/graphql/pubsub';
import { EmbedContext } from 'src/graphql/types';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';
import { withSubscriptionCounter } from 'src/utils/metrics';
import { ACCOUNT_USER_INLINE_EMBEDS_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import EmbedInlineEmbedType from '../EmbedInlineEmbed.graphql';

const metricName = 'embed_inlineEmbedsChanged';

const inlineEmbedsChanged: GraphQLFieldConfig<
  { organizationId: number },
  EmbedContext
> = {
  description: "The organization's inline embeds changed",
  type: new GraphQLList(EmbedInlineEmbedType),
  resolve: withSubscriptionResolverPreparation(
    metricName,
    (_, __, { loaders, accountUser }) =>
      loaders.inlineEmbedsForAccountUserLoader.load(accountUser)
  ),
  subscribe: withSubscriptionCounter(
    (_, __, { accountUser }) =>
      pubSub.asyncIterator(
        `${ACCOUNT_USER_INLINE_EMBEDS_CHANGED_TOPIC}.${accountUser.externalId}`
      ),
    () => true,
    metricName
  ),
};

export default inlineEmbedsChanged;
