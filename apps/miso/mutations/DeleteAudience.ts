import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DeleteAudienceMutation } from 'relay-types/DeleteAudienceMutation.graphql';

const mutationName = 'deleteAudience';
const mutation = graphql`
  mutation DeleteAudienceMutation($input: DeleteAudienceInput!) {
    deleteAudience(input: $input) {
      deletedAudienceId
      errors
    }
  }
`;

type Args = DeleteAudienceMutation['variables']['input'];

export function commit({
  entityId,
}: Args): Promise<DeleteAudienceMutation['response']> {
  const variables: DeleteAudienceMutation['variables'] = {
    input: {
      entityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
