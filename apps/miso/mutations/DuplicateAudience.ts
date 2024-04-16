import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  DuplicateAudienceInput,
  DuplicateAudienceMutation,
} from 'relay-types/DuplicateAudienceMutation.graphql';

const mutationName = 'duplicateAudience';
const mutation = graphql`
  mutation DuplicateAudienceMutation($input: DuplicateAudienceInput!) {
    duplicateAudience(input: $input) {
      errors
      audience {
        entityId
      }
    }
  }
`;

export function commit(
  input: DuplicateAudienceInput
): Promise<DuplicateAudienceMutation['response']> {
  const variables: DuplicateAudienceMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
