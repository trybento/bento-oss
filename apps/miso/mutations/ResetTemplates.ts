import { graphql } from 'react-relay';
import commitMutation from './commitMutation';
import { ResetTemplatesMutation } from 'relay-types/ResetTemplatesMutation.graphql';

const mutationName = 'resetTemplates';
const mutation = graphql`
  mutation ResetTemplatesMutation($input: ResetTemplatesInput!) {
    resetTemplates(input: $input) {
      resetTemplateIds
      errors
    }
  }
`;

type Args = ResetTemplatesMutation['variables']['input'];

export function commit({
  templateEntityIds,
}: Args): Promise<ResetTemplatesMutation['response']> {
  const variables: ResetTemplatesMutation['variables'] = {
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
