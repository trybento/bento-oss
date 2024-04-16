import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { SetIntegrationApiKeyMutation } from 'relay-types/SetIntegrationApiKeyMutation.graphql';

const mutationName = 'setIntegrationApiKey';
const mutation = graphql`
  mutation SetIntegrationApiKeyMutation($input: SetIntegrationApiKeyInput!) {
    setIntegrationApiKey(input: $input) {
      errors
    }
  }
`;

type Args = SetIntegrationApiKeyMutation['variables']['input'];

export function commit({
  integrationType,
  key,
  state,
  entityId,
}: Args): Promise<SetIntegrationApiKeyMutation['response']> {
  const variables: SetIntegrationApiKeyMutation['variables'] = {
    input: {
      state,
      integrationType,
      key,
      entityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
