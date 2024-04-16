import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  DeleteGuideBasesForAccountMutationVariables,
  DeleteGuideBasesForAccountMutationResponse,
} from 'relay-types/DeleteGuideBasesForAccountMutation.graphql';

const mutationName = 'deleteGuideBasesForAccount';
const mutation = graphql`
  mutation DeleteGuideBasesForAccountMutation(
    $input: DeleteGuideBasesForAccountInput!
  ) {
    deleteGuideBasesForAccount(input: $input) {
      account {
        entityId
        name
      }
      errors
    }
  }
`;

type Args = DeleteGuideBasesForAccountMutationVariables['input'];

export default function DeleteGuideBasesForAccountMutation({
  accountEntityId,
}: Args): Promise<DeleteGuideBasesForAccountMutationResponse> {
  const variables: DeleteGuideBasesForAccountMutationVariables = {
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
