import { GraphQLFieldConfig } from 'graphql';

import pubsub from 'src/graphql/pubsub';
import { GraphQLContext } from 'src/graphql/types';
import { withSubscriptionCounter } from 'src/utils/metrics';
import { withSubscriptionResolverPreparation } from 'src/graphql/utils';
import { ORGANIZATION_CHANGED_TOPIC } from 'src/websockets/sockets.constants';
import OrganizationType from '../Organization.graphql';

const metricName = 'admin_organizationChanged';

const OrganizationChanged: GraphQLFieldConfig<
  {
    organizationId: number;
  },
  GraphQLContext
> = {
  description: 'The Organization state or details has been changed',
  type: OrganizationType,
  resolve: withSubscriptionResolverPreparation(
    metricName,
    (_, _args, { loaders, organization }) =>
      loaders.organizationLoader.load(organization.id)
  ),
  subscribe: withSubscriptionCounter(
    () => {
      return pubsub.asyncIterator(ORGANIZATION_CHANGED_TOPIC);
    },
    (payload, _variables, { organization }) =>
      Number(payload.organizationId) === organization.id,
    metricName
  ),
};

export default OrganizationChanged;
