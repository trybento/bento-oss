import { GraphQLString } from 'graphql';
import { ZendeskOptions } from 'bento-common/types/integrations';

import {
  IntegrationApiKey,
  IntegrationType,
} from 'src/data/models/IntegrationApiKey.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import IntegrationApiKeyType from 'src/graphql/IntegrationApiKey/IntegrationApiKey.graphql';

export default generateMutation({
  name: 'ConfigureZendesk',
  description: 'Configure various aspects of the Zendesk integration',
  inputFields: {
    username: {
      type: GraphQLString,
    },
    subdomain: {
      type: GraphQLString,
    },
  },
  outputFields: {
    integrationApiKey: {
      type: IntegrationApiKeyType,
    },
  },
  mutateAndGetPayload: async (
    { username, subdomain }: ZendeskOptions,
    { organization }
  ) => {
    const integrationApiKey = await IntegrationApiKey.findOne({
      where: {
        organizationId: organization.id,
        type: IntegrationType.zendesk,
      },
    });

    if (!integrationApiKey) throw new Error('Could not find integration');

    const options = {
      ...(username ? { username } : {}),
      ...(subdomain ? { subdomain } : {}),
    };

    await integrationApiKey.update({
      options: {
        ...(integrationApiKey.options as ZendeskOptions),
        ...options,
      },
    });

    return { integrationApiKey };
  },
});
