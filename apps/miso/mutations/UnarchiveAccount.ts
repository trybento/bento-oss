import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { UnarchiveAccountMutation } from 'relay-types/UnarchiveAccountMutation.graphql';

const mutationName = 'unarchiveAccount';
const mutation = graphql`
  mutation UnarchiveAccountMutation($input: UnarchiveAccountInput!) {
    unarchiveAccount(input: $input) {
      account {
        entityId
        name
      }
      errors
    }
  }
`;

type Args = UnarchiveAccountMutation['variables']['input'];

export function commit({
  accountEntityId,
}: Args): Promise<UnarchiveAccountMutation['response']> {
  const variables: UnarchiveAccountMutation['variables'] = {
    input: {
      accountEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
