import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  EditAudienceInput,
  EditAudienceMutation,
} from 'relay-types/EditAudienceMutation.graphql';

const mutationName = 'editAudience';
const mutation = graphql`
  mutation EditAudienceMutation($input: EditAudienceInput!) {
    editAudience(input: $input) {
      errors
    }
  }
`;

export function commit(
  input: EditAudienceInput
): Promise<EditAudienceMutation['response']> {
  const variables: EditAudienceMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
