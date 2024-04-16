import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { EditModuleDetailsMutation } from 'relay-types/EditModuleDetailsMutation.graphql';

const mutationName = 'editModuleDetails';
const mutation = graphql`
  mutation EditModuleDetailsMutation($input: EditModuleDetailsInput!) {
    editModuleDetails(input: $input) {
      module {
        updatedAt
        entityId
        name
        displayTitle
        description
      }
      errors
    }
  }
`;

type Args = EditModuleDetailsMutation['variables']['input'];

export function commit({
  moduleData,
}: Args): Promise<EditModuleDetailsMutation['response']> {
  const variables: EditModuleDetailsMutation['variables'] = {
    input: {
      moduleData,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
