import { ZendeskOptions } from 'bento-common/types/integrations';
import {
  IntegrationApiKey,
  IntegrationType,
} from 'src/data/models/IntegrationApiKey.model';

/**
 * Helper for pieces required to use the ZD API
 */
export const getZendeskParams = async (organizationId: number) => {
  const integration = (await IntegrationApiKey.findOne({
    where: {
      organizationId,
      type: IntegrationType.zendesk,
    },
  })) as IntegrationApiKey<ZendeskOptions>;

  if (!integration) throw new Error('Zendesk not set up for organization');

  return {
    subdomain: integration.options.subdomain,
    key: integration.key,
    auth:
      'Basic ' +
      Buffer.from(
        integration.options.username + '/token:' + integration.key
      ).toString('base64'),
  };
};
