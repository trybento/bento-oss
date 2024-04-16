import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DeleteUserMutation } from 'relay-types/DeleteUserMutation.graphql';

const mutationName = 'deleteUser';
const mutation = graphql`
  mutation DeleteUserMutation($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      deletedUserId
      errors
    }
  }
`;

type Args = DeleteUserMutation['variables']['input'];

export function commit({
  userEntityId,
}: Args): Promise<DeleteUserMutation['response']> {
  const variables: DeleteUserMutation['variables'] = {
    input: {
      userEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
