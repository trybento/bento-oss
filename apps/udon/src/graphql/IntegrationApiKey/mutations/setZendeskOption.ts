import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';
import { v4 as uuidv4 } from 'uuid';

import {
  IntegrationState,
  ZendeskOptions,
} from 'bento-common/types/integrations';
import generateMutation from 'src/graphql/helpers/generateMutation';
import {
  IntegrationApiKey,
  IntegrationType,
} from 'src/data/models/IntegrationApiKey.model';
import IntegrationApiKeyType from '../IntegrationApiKey.graphql';
import { EntityId } from 'src/graphql/helpers/types';
import { Organization } from 'src/data/models/Organization.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';

type SetZdOptionArgs = {
  entityId: string;
  enabled: boolean;
  option: keyof ZendeskOptions;
  organization: Organization;
};

const SUPPORTED_OPTIONS: Array<keyof ZendeskOptions> = [
  'liveChat',
  'issueSubmission',
  'kbSearch',
];

export const setZendeskOptionInKey = async ({
  entityId,
  enabled,
  option,
  organization,
}: SetZdOptionArgs) => {
  // if (SUPPORTED_OPTIONS.includes(option)) throw new Error('Unsupported option');

  const [integration, isNew] = await IntegrationApiKey.findOrCreate({
    where: {
      entityId: entityId || uuidv4(),
      type: IntegrationType.zendesk,
      organizationId: organization.id,
    },
    defaults: {
      type: IntegrationType.zendesk,
      state: IntegrationState.Inactive,
      options: { [option]: enabled },
      organizationId: organization.id,
      key: '',
    },
  });

  if (integration && !isNew)
    await integration.update({
      options: {
        ...((integration.options as object) || {}),
        [option]: enabled,
      },
    });

  return integration as IntegrationApiKey<ZendeskOptions>;
};

const disableGenericHelpCenter = async (organization: Organization) => {
  const orgSettings = await OrganizationSettings.findOne({
    where: {
      organizationId: organization.id,
    },
  });

  if (orgSettings)
    await orgSettings.update({
      helpCenter: null,
    });
};

const setZendeskOption = generateMutation({
  name: 'SetZendeskOption',
  inputFields: {
    entityId: {
      type: EntityId,
    },
    enabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    option: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    integration: { type: IntegrationApiKeyType },
  },
  mutateAndGetPayload: async (
    { entityId, enabled, option },
    { organization }
  ) => {
    const integration = await setZendeskOptionInKey({
      entityId,
      option,
      enabled,
      organization,
    });

    /**
     * Temp, so there's no overlap of settings being on
     */
    if (option === 'kbSearch' && enabled)
      void disableGenericHelpCenter(organization);

    return { integration };
  },
});
export default setZendeskOption;
