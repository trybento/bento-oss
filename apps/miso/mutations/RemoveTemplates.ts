import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { RemoveTemplatesMutation } from 'relay-types/RemoveTemplatesMutation.graphql';

const mutationName = 'removeTemplates';
const mutation = graphql`
  mutation RemoveTemplatesMutation($input: RemoveTemplatesInput!) {
    removeTemplates(input: $input) {
      removedTemplateIds
      errors
    }
  }
`;

type Args = RemoveTemplatesMutation['variables']['input'];

export function commit({
  templateEntityIds,
}: Args): Promise<RemoveTemplatesMutation['response']> {
  const variables: RemoveTemplatesMutation['variables'] = {
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
