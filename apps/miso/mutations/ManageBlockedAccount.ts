import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { ManageBlockedAccountMutation } from 'relay-types/ManageBlockedAccountMutation.graphql';

const mutationName = 'manageBlockedAccountAccount';
const mutation = graphql`
  mutation ManageBlockedAccountMutation($input: ManageBlockedAccountInput!) {
    manageBlockedAccount(input: $input) {
      errors
    }
  }
`;

type Args = ManageBlockedAccountMutation['variables']['input'];

export function commit(
  input: Args
): Promise<ManageBlockedAccountMutation['response']> {
  const variables: ManageBlockedAccountMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
