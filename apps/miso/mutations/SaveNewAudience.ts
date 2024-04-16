import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  SaveNewAudienceInput,
  SaveNewAudienceMutation,
} from 'relay-types/SaveNewAudienceMutation.graphql';

const mutationName = 'saveNewAudience';
const mutation = graphql`
  mutation SaveNewAudienceMutation($input: SaveNewAudienceInput!) {
    saveNewAudience(input: $input) {
      audience {
        entityId
      }
      errors
    }
  }
`;

export function commit({
  name,
  targets,
}: SaveNewAudienceInput): Promise<SaveNewAudienceMutation['response']> {
  const variables: SaveNewAudienceMutation['variables'] = {
    input: {
      name,
      targets,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
