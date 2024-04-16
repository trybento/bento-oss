import { GraphQLNonNull, GraphQLString } from 'graphql';
import { pick } from 'lodash';

import { IntegrationState } from 'bento-common/types/integrations';
import EntityIdType from 'bento-common/graphql/EntityId';

import {
  IntegrationApiKey,
  IntegrationType,
} from 'src/data/models/IntegrationApiKey.model';
import { IntegrationStateEnum } from 'src/graphql/graphQl.types';
import generateMutation from 'src/graphql/helpers/generateMutation';

import IntegrationApiKeyType, {
  IntegrationTypeEnum,
} from '../IntegrationApiKey.graphql';
import { onIntegrationDisabled } from 'src/interactions/integrations/integrations.helpers';

type SetIntegrationArgs = {
  entityId?: string;
  key: string;
  integrationType: IntegrationType;
  state: IntegrationState;
};

export default generateMutation({
  name: 'SetIntegrationApiKey',
  inputFields: {
    entityId: {
      type: EntityIdType,
    },
    key: {
      type: GraphQLString,
    },
    integrationType: {
      type: new GraphQLNonNull(IntegrationTypeEnum),
    },
    state: {
      type: new GraphQLNonNull(IntegrationStateEnum),
    },
  },
  outputFields: {
    integrationApiKey: {
      type: IntegrationApiKeyType,
    },
  },
  mutateAndGetPayload: async (
    { entityId, key, integrationType, state }: SetIntegrationArgs,
    { organization }
  ) => {
    /**
     * Integrations that just need to be disabled rather than
     * fully deleted may pass the entityId. Current integrations that
     * update on disable:
     * - Zendesk.
     */

    const integration = await IntegrationApiKey.findOne({
      where: {
        organizationId: organization.id,
        ...(entityId ? { entityId } : { type: integrationType }),
      },
    });

    const valuesToKeep: undefined | IntegrationApiKey['options'] =
      integration && entityId
        ? { ...pick(integration, ['options']) }
        : undefined;

    await integration?.destroy();

    if (state === IntegrationState.Inactive)
      await onIntegrationDisabled(organization.id, integrationType);

    if (!key) return null;

    const integrationApiKey = await IntegrationApiKey.create({
      organizationId: organization.id,
      type: integrationType,
      state,
      key,
      options: valuesToKeep?.options,
    });

    return { integrationApiKey };
  },
});
