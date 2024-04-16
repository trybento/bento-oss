import { GraphQLNonNull, GraphQLString } from 'graphql';
import { WebhookType as KindOfWebhook } from 'bento-common/types';
import {
  WebhookTypeEnum,
  WebhookTypeTypeEnum,
} from 'src/graphql/graphQl.types';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { getEventHookMetadata } from 'src/interactions/webhooks/triggerEventHook';
import { getSampleWebhookPayload } from 'src/interactions/webhooks/webhook.helpers';
import { EventHookType } from 'src/interactions/webhooks/webhook.types';
import WebhookType from '../Webhook.graphql';
import {
  EventHookJobPayload,
  handleWebhook,
} from 'src/jobsBull/jobs/integrations/integrations.helpers';

type TestWebhookArgs = {
  secretKey?: string;
  webhookUrl: string;
  eventType: EventHookType;
  webhookType: KindOfWebhook;
};

export default generateMutation({
  name: 'TestWebhook',
  inputFields: {
    secretKey: {
      type: GraphQLString,
    },
    webhookUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
    eventType: {
      type: WebhookTypeEnum,
    },
    webhookType: {
      type: WebhookTypeTypeEnum,
    },
  },
  outputFields: {
    message: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (
    {
      secretKey,
      webhookUrl,
      eventType = EventHookType.Ping,
      webhookType = KindOfWebhook.standard,
    }: TestWebhookArgs,
    { organization }
  ) => {
    const data = {
      ...getSampleWebhookPayload(eventType),
      ...getEventHookMetadata(),
    };

    const payload: EventHookJobPayload = {
      payload: data,
      organizationId: organization.id,
      destinationOpts: {
        webhookUrl,
        secretKey,
        webhookType,
      },
    };

    try {
      /* Return as message so error catching mechanisms don't treat it as a server error */
      await handleWebhook(payload);
    } catch (e: any) {
      return {
        errors: [e.message],
      };
    }

    return;
  },
});
