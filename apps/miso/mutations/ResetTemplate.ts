import { graphql } from 'react-relay';
import commitMutation from './commitMutation';
import { ResetTemplateMutation } from 'relay-types/ResetTemplateMutation.graphql';

const mutationName = 'resetTemplate';
const mutation = graphql`
  mutation ResetTemplateMutation($input: ResetTemplateInput!) {
    resetTemplate(input: $input) {
      template {
        entityId
        name
      }
      errors
    }
  }
`;

type Args = ResetTemplateMutation['variables']['input'];

export function commit({
  templateEntityId,
}: Args): Promise<ResetTemplateMutation['response']> {
  const variables: ResetTemplateMutation['variables'] = {
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
