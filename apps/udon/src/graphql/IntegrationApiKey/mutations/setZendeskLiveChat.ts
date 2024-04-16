import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import IntegrationApiKeyType from '../IntegrationApiKey.graphql';
import { EntityId } from 'src/graphql/helpers/types';
import { setZendeskOptionInKey } from './setZendeskOption';

const setZendeskLiveChat = generateMutation({
  name: 'SetZendeskLiveChat',
  deprecationReason: 'Replaced by more general setZendeskOption',
  inputFields: {
    entityId: {
      type: EntityId,
    },
    enabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  outputFields: {
    integration: { type: IntegrationApiKeyType },
  },
  mutateAndGetPayload: async ({ entityId, enabled }, { organization }) => {
    const integration = await setZendeskOptionInKey({
      entityId,
      option: 'liveChat',
      enabled,
      organization,
    });

    return { integration };
  },
});
export default setZendeskLiveChat;
