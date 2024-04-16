import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { BootstrapTemplateMutation } from 'relay-types/BootstrapTemplateMutation.graphql';

const mutationName = 'bootstrapTemplate';
const mutation = graphql`
  mutation BootstrapTemplateMutation($input: BootstrapTemplateInput!) {
    bootstrapTemplates(input: $input) {
      template {
        entityId
      }
      errors
    }
  }
`;

type Args = BootstrapTemplateMutation['variables']['input'];

export function commit(
  input: Args
): Promise<BootstrapTemplateMutation['response']> {
  const variables: BootstrapTemplateMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
