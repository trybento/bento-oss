import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { WebhookType as WebhookEnumType } from 'bento-common/types';

import SegmentApiKeyType from 'src/graphql/SegmentApiKey/SegmentApiKey.graphql';
import { GraphQLContext } from 'src/graphql/types';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import WebhookType from '../Webhook/Webhook.graphql';
import { Webhook } from 'src/data/models/Integrations/Webhook.model';
import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';
import IntegrationApiKeyType from '../IntegrationApiKey/IntegrationApiKey.graphql';
import { IntegrationApiKey } from 'src/data/models/IntegrationApiKey.model';

export const OrganizationOrgSettingsType = new GraphQLObjectType<
  OrganizationSettings,
  GraphQLContext
>({
  name: 'OrganizationOrgSettings',
  description: 'General organization-wide settings',
  fields: () => ({
    sendEmailNotifications: {
      type: GraphQLBoolean,
      description: 'Are guide notification settings enabled',
      resolve: (organizationSettings) =>
        organizationSettings.sendEmailNotifications === true,
    },
    fallbackCommentsEmail: {
      type: GraphQLString,
      description: 'Default email address for notifications',
      resolve: (organizationSettings) =>
        organizationSettings.fallbackCommentsEmail || null,
    },
    sendAccountUserNudges: {
      type: GraphQLBoolean,
      description: 'Are guide participant email nudges enabled',
      resolve: (organizationSettings) =>
        organizationSettings.sendAccountUserNudges === true,
    },
    defaultUserNotificationURL: {
      type: GraphQLString,
      description:
        'Default URL for linking to guide participants for nudges and other emails',
      resolve: (organizationSettings) =>
        organizationSettings.defaultUserNotificationURL,
    },
    webhooks: {
      type: new GraphQLList(new GraphQLNonNull(WebhookType)),
      // TODO: create loader
      resolve: async (_, _a, { organization, loaders }) => {
        const webhooks = await Webhook.findAll({
          where: {
            organizationId: organization.id,
            webhookType: WebhookEnumType.standard,
          },
        });
        for (const hook of webhooks) {
          loaders.webhookEntityLoader.prime(hook.entityId, hook);
          loaders.webhookLoader.prime(hook.id, hook);
        }
        return webhooks;
      },
    },
    bentoApiKey: {
      type: SegmentApiKeyType,
      resolve: async (_, _args, { organization, loaders }) => {
        const segmentKey = await SegmentApiKey.findOne({
          where: {
            organizationId: organization.id,
            type: BentoApiKeyType.api,
          },
        });
        if (segmentKey) {
          loaders.segmentApiKeyEntityLoader.prime(
            segmentKey.entityId,
            segmentKey
          );
          loaders.segmentApiKeyLoader.prime(segmentKey.id, segmentKey);
        }
        return segmentKey;
      },
    },
    integrationApiKeys: {
      type: new GraphQLList(new GraphQLNonNull(IntegrationApiKeyType)),
      resolve: async (_, _args, { organization }) => {
        // TODO: Loaders + cache?????????
        const keys = await IntegrationApiKey.findAll({
          where: {
            organizationId: organization.id,
          },
        });

        return keys;
      },
    },
  }),
});
