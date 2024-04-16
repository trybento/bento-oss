import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { ResetGuideBasesForAccountMutation } from 'relay-types/ResetGuideBasesForAccountMutation.graphql';

const mutationName = 'resetGuideBasesForAccount';
const mutation = graphql`
  mutation ResetGuideBasesForAccountMutation(
    $input: ResetGuideBasesForAccountInput!
  ) {
    resetGuideBasesForAccount(input: $input) {
      account {
        entityId
        name
      }
      errors
    }
  }
`;

type Args = ResetGuideBasesForAccountMutation['variables']['input'];

export function commit({
  accountEntityId,
}: Args): Promise<ResetGuideBasesForAccountMutation['response']> {
  const variables: ResetGuideBasesForAccountMutation['variables'] = {
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
