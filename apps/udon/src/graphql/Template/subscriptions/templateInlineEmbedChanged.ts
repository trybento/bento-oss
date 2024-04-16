import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import EntityIdType from 'bento-common/graphql/EntityId';

import pubsub from 'src/graphql/pubsub';
import { GraphQLContext } from 'src/graphql/types';
import { withSubscriptionCounter } from 'src/utils/metrics';
import InlineEmbedType from '../../InlineEmbed/InlineEmbed.graphql';
import { TEMPLATE_INLINE_EMBED_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';

const metricName = 'admin_templateInlineEmbedChanged';

const templateInlineEmbedChanged: GraphQLFieldConfig<
  { templateEntityId: string },
  GraphQLContext
> = {
  description: "The template's inline embeds changed",
  type: InlineEmbedType,
  resolve: withSubscriptionResolverPreparation(
    metricName,
    async ({ templateEntityId }, _, { loaders, organization }) => {
      const inlineEmbed = await loaders.inlineEmbedOfTemplateLoader.load(
        templateEntityId
      );

      if (inlineEmbed && inlineEmbed?.organizationId === organization.id) {
        return inlineEmbed;
      }

      return null;
    }
  ),
  args: {
    templateEntityId: {
      type: new GraphQLNonNull(EntityIdType),
    },
  },
  subscribe: withSubscriptionCounter(
    () => pubsub.asyncIterator(TEMPLATE_INLINE_EMBED_CHANGED_TOPIC),
    (payload, vars) => payload.templateEntityId === vars.templateEntityId,
    metricName
  ),
};

export default templateInlineEmbedChanged;
