import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { RemoveTemplateMutation } from 'relay-types/RemoveTemplateMutation.graphql';

const mutationName = 'removeTemplate';
const mutation = graphql`
  mutation RemoveTemplateMutation($input: RemoveTemplateInput!) {
    removeTemplate(input: $input) {
      removedTemplateId
      errors
    }
  }
`;

type Args = RemoveTemplateMutation['variables']['input'];

export function commit({
  templateEntityId,
}: Args): Promise<RemoveTemplateMutation['response']> {
  const variables: RemoveTemplateMutation['variables'] = {
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
