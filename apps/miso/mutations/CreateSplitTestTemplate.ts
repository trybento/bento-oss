import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { CreateSplitTestTemplateMutation } from 'relay-types/CreateSplitTestTemplateMutation.graphql';

const mutationName = 'createSplitTestTemplate';
const mutation = graphql`
  mutation CreateSplitTestTemplateMutation(
    $input: CreateSplitTestTemplateInput!
  ) {
    createSplitTestTemplate(input: $input) {
      template {
        entityId
        name
        privateName
      }
      errors
    }
  }
`;

type Args = CreateSplitTestTemplateMutation['variables']['input'];

export function commit({
  templateData,
}: Args): Promise<CreateSplitTestTemplateMutation['response']> {
  const variables: CreateSplitTestTemplateMutation['variables'] = {
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
