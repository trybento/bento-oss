import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DeleteAttributeMutation } from 'relay-types/DeleteAttributeMutation.graphql';

const mutationName = 'deleteAttribute';
const mutation = graphql`
  mutation DeleteAttributeMutation($input: DeleteAttributeInput!) {
    deleteAttribute(input: $input) {
      errors
    }
  }
`;

type Args = DeleteAttributeMutation['variables']['input'];

export function commit({
  entityId,
}: Args): Promise<DeleteAttributeMutation['response']> {
  const variables: DeleteAttributeMutation['variables'] = {
    input: {
      entityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
