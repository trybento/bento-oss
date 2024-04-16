import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DeleteTemplateMutation } from 'relay-types/DeleteTemplateMutation.graphql';

const mutationName = 'deleteTemplate';
const mutation = graphql`
  mutation DeleteTemplateMutation($input: DeleteTemplateInput!) {
    deleteTemplate(input: $input) {
      deletedTemplateId
      errors
    }
  }
`;

type Args = DeleteTemplateMutation['variables']['input'];

export function commit({
  templateEntityId,
}: Args): Promise<DeleteTemplateMutation['response']> {
  const variables: DeleteTemplateMutation['variables'] = {
    input: {
      templateEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
