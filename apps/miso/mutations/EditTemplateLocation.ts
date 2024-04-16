import { graphql } from 'react-relay';
import commitMutation from './commitMutation';
import { EditTemplateLocationMutation } from 'relay-types/EditTemplateLocationMutation.graphql';

const mutationName = 'editTemplateLocation';
const mutation = graphql`
  mutation EditTemplateLocationMutation($input: EditTemplateLocationInput!) {
    editTemplateLocation(input: $input) {
      template {
        entityId
      }
      errors
    }
  }
`;

type Args = EditTemplateLocationMutation['variables']['input'];

export function commit(
  args: Args
): Promise<EditTemplateLocationMutation['response']> {
  const variables: EditTemplateLocationMutation['variables'] = {
    input: {
      ...args,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
