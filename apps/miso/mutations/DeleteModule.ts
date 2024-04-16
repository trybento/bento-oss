import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DeleteModuleMutation } from 'relay-types/DeleteModuleMutation.graphql';

const mutationName = 'deleteModule';
const mutation = graphql`
  mutation DeleteModuleMutation($input: DeleteModuleInput!) {
    deleteModule(input: $input) {
      deletedModuleId
      errors
    }
  }
`;

type Args = DeleteModuleMutation['variables']['input'];

export function commit({
  moduleEntityId,
}: Args): Promise<DeleteModuleMutation['response']> {
  const variables: DeleteModuleMutation['variables'] = {
    input: {
      moduleEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
