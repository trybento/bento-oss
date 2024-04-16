import { GraphQLNonNull, GraphQLString } from 'graphql';
import {
  WebhookStateTypeEnum,
  WebhookTypeEnum,
  WebhookTypeTypeEnum,
} from 'src/graphql/graphQl.types';
import generateMutation from 'src/graphql/helpers/generateMutation';
import {
  EventHookType,
  WebhookState,
} from 'src/interactions/webhooks/webhook.types';
import { setHookForOrg } from 'src/interactions/webhooks/webhook.helpers';
import WebhookType from '../Webhook.graphql';
import { WebhookType as WebhookEnumType } from 'bento-common/types';

type SetWebhookArgs = {
  secretKey?: string;
  webhookUrl: string;
  eventType: EventHookType;
  state: WebhookState;
  webhookType?: WebhookEnumType;
};

export default generateMutation({
  name: 'SetWebhook',
  inputFields: {
    secretKey: {
      type: GraphQLString,
    },
    webhookUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
    eventType: {
      type: new GraphQLNonNull(WebhookTypeEnum),
    },
    state: {
      type: new GraphQLNonNull(WebhookStateTypeEnum),
    },
    webhookType: {
      type: WebhookTypeTypeEnum,
    },
  },
  outputFields: {
    webhooks: {
      type: WebhookType,
    },
  },
  mutateAndGetPayload: async (
    { secretKey, state, eventType, webhookUrl, webhookType }: SetWebhookArgs,
    { organization, user }
  ) => {
    const hook = await setHookForOrg({
      organization,
      state,
      secretKey,
      eventType,
      webhookUrl,
      webhookType,
      user,
    });

    return hook;
  },
});
