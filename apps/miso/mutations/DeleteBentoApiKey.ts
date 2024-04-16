import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DeleteBentoApiKeyMutation } from 'relay-types/DeleteBentoApiKeyMutation.graphql';

const mutationName = 'deleteBentoApiKey';
const mutation = graphql`
  mutation DeleteBentoApiKeyMutation($input: DeleteBentoApiKeyInput!) {
    deleteBentoApiKey(input: $input) {
      errors
    }
  }
`;

type Args = DeleteBentoApiKeyMutation['variables']['input'];

export function commit({
  orgEntityId,
  keyType,
}: Args): Promise<DeleteBentoApiKeyMutation['response']> {
  const variables: DeleteBentoApiKeyMutation['variables'] = {
    input: {
      orgEntityId,
      keyType,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
