import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DeleteTemplatesMutation } from 'relay-types/DeleteTemplatesMutation.graphql';

const mutationName = 'deleteTemplates';
const mutation = graphql`
  mutation DeleteTemplatesMutation($input: DeleteTemplatesInput!) {
    deleteTemplates(input: $input) {
      deletedTemplateIds
      errors
    }
  }
`;

type Args = DeleteTemplatesMutation['variables']['input'];

export function commit({
  templateEntityIds,
}: Args): Promise<DeleteTemplatesMutation['response']> {
  const variables: DeleteTemplatesMutation['variables'] = {
    input: {
      templateEntityIds,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
