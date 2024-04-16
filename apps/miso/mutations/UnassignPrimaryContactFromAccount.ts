import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { UnassignPrimaryContactFromAccountMutation } from 'relay-types/UnassignPrimaryContactFromAccountMutation.graphql';

const mutationName = 'assignPrimaryContactToAccount';
const mutation = graphql`
  mutation UnassignPrimaryContactFromAccountMutation(
    $input: UnassignPrimaryContactFromAccountInput!
  ) {
    unassignPrimaryContactFromAccount(input: $input) {
      account {
        primaryContact {
          id
          entityId
        }
      }
      errors
    }
  }
`;

type Args = UnassignPrimaryContactFromAccountMutation['variables']['input'];

export function commit({
  accountEntityId,
}: Args): Promise<UnassignPrimaryContactFromAccountMutation['response']> {
  const variables: UnassignPrimaryContactFromAccountMutation['variables'] = {
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
