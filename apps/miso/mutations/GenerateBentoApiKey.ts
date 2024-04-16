import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { GenerateBentoApiKeyMutation } from 'relay-types/GenerateBentoApiKeyMutation.graphql';

const mutationName = 'generateBentoApiKey';
const mutation = graphql`
  mutation GenerateBentoApiKeyMutation($input: GenerateBentoApiKeyInput!) {
    generateBentoApiKey(input: $input) {
      errors
    }
  }
`;

type Args = GenerateBentoApiKeyMutation['variables']['input'];

export function commit({
  orgEntityId,
  recreate,
  keyType,
}: Args): Promise<GenerateBentoApiKeyMutation['response']> {
  const variables: GenerateBentoApiKeyMutation['variables'] = {
    input: {
      orgEntityId,
      recreate,
      keyType,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
