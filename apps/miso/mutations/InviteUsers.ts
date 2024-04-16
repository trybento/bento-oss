import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { InviteUsersMutation } from 'relay-types/InviteUsersMutation.graphql';

const mutationName = 'inviteUsers';
const mutation = graphql`
  mutation InviteUsersMutation($input: InviteUsersInput!) {
    inviteUsers(input: $input) {
      errors
    }
  }
`;

type Args = InviteUsersMutation['variables']['input'];

export function commit({
  inviteUsers,
}: Args): Promise<InviteUsersMutation['response']> {
  const variables: InviteUsersMutation['variables'] = {
    input: {
      inviteUsers,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
