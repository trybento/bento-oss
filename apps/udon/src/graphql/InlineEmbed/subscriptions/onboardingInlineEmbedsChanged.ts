import { ONBOARDING_INLINE_EMBEDS_CHANGED_TOPIC } from '../../../websockets/sockets.constants';
import { GraphQLFieldConfig, GraphQLList } from 'graphql';

import pubsub from 'src/graphql/pubsub';
import { GraphQLContext } from 'src/graphql/types';
import { withSubscriptionCounter } from 'src/utils/metrics';
import InlineEmbedType from '../InlineEmbed.graphql';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';

const metricName = 'admin_onboardingInlineEmbedsChanged';

const onboardingInlineEmbedsChanged: GraphQLFieldConfig<
  { organizationId: number },
  GraphQLContext
> = {
  description: "The organization's onboarding inline embeds changed",
  type: new GraphQLList(InlineEmbedType),
  resolve: withSubscriptionResolverPreparation(
    metricName,
    (_, __, { loaders, organization }) =>
      loaders.onboardingInlineEmbedsLoader.load(organization.id)
  ),
  subscribe: withSubscriptionCounter(
    () => pubsub.asyncIterator(ONBOARDING_INLINE_EMBEDS_CHANGED_TOPIC),
    (payload, _, { organization }) =>
      Number(payload.organizationId) === organization.id,
    metricName
  ),
};

export default onboardingInlineEmbedsChanged;
