import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { EditSplitTestTemplateMutation } from 'relay-types/EditSplitTestTemplateMutation.graphql';

const mutationName = 'editSplitTestTemplate';
const mutation = graphql`
  mutation EditSplitTestTemplateMutation($input: EditSplitTestTemplateInput!) {
    editSplitTestTemplate(input: $input) {
      template {
        updatedAt
        entityId
        privateName
        description
        name
      }
      errors
    }
  }
`;

type Args = EditSplitTestTemplateMutation['variables']['input'];

export function commit({
  templateData,
}: Args): Promise<EditSplitTestTemplateMutation['response']> {
  const variables: EditSplitTestTemplateMutation['variables'] = {
    input: {
      templateData,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
