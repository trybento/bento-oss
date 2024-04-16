import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { AssignPrimaryContactToAccountMutation } from 'relay-types/AssignPrimaryContactToAccountMutation.graphql';

const mutationName = 'assignPrimaryContactToAccount';
const mutation = graphql`
  mutation AssignPrimaryContactToAccountMutation(
    $input: AssignPrimaryContactToAccountInput!
  ) {
    assignPrimaryContactToAccount(input: $input) {
      account {
        primaryContact {
          id
          entityId
          fullName
        }
      }
      errors
    }
  }
`;

type Args = AssignPrimaryContactToAccountMutation['variables']['input'];

export function commit({
  userEntityId,
  accountEntityId,
}: Args): Promise<AssignPrimaryContactToAccountMutation['response']> {
  const variables: AssignPrimaryContactToAccountMutation['variables'] = {
    input: {
      accountEntityId,
      userEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
