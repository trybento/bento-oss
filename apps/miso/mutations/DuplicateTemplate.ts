import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DuplicateTemplateMutation } from 'relay-types/DuplicateTemplateMutation.graphql';

const mutationName = 'duplicateTemplate';
const mutation = graphql`
  mutation DuplicateTemplateMutation($input: DuplicateTemplateInput!) {
    duplicateTemplate(input: $input) {
      template {
        entityId
      }
      errors
    }
  }
`;

type Args = DuplicateTemplateMutation['variables']['input'];

export function commit({
  entityId,
  type,
  name,
  theme,
  duplicateStepGroups,
}: Args): Promise<DuplicateTemplateMutation['response']> {
  const variables: DuplicateTemplateMutation['variables'] = {
    input: {
      entityId,
      type,
      name,
      theme,
      duplicateStepGroups,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
