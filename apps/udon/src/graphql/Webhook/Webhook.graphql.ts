import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';

import OrganizationType from 'src/graphql/Organization/Organization.graphql';
import { Webhook } from 'src/data/models/Integrations/Webhook.model';
import { GraphQLContext } from 'src/graphql/types';
import {
  WebhookStateTypeEnum,
  WebhookTypeEnum,
  WebhookTypeTypeEnum,
} from '../graphQl.types';

const WebhookType = new GraphQLObjectType<Webhook, GraphQLContext>({
  name: 'Webhook',
  fields: () => ({
    ...globalEntityId('Webhook'),
    ...entityIdField(),
    webhookUrl: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Where to send the data payload',
    },
    eventType: {
      type: new GraphQLNonNull(WebhookTypeEnum),
      description:
        "The API key for the organization to connect to Bento's segment integration",
    },
    secretKey: {
      type: GraphQLString,
      description: 'Used to verify Bento with the recipient',
    },
    state: {
      type: new GraphQLNonNull(WebhookStateTypeEnum),
    },
    webhookType: {
      type: new GraphQLNonNull(WebhookTypeTypeEnum),
    },
    organization: {
      type: new GraphQLNonNull(OrganizationType),
      description: 'The organization that the webhook belongs to',
      resolve: (webhook, _, { loaders }) =>
        loaders.organizationLoader.load(webhook.organizationId),
    },
  }),
});

export default WebhookType;
