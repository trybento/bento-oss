import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { CreateTemplateMutation } from 'relay-types/CreateTemplateMutation.graphql';

const mutationName = 'editTemplate';
const mutation = graphql`
  mutation CreateTemplateMutation($input: CreateTemplateInput!) {
    createTemplate(input: $input) {
      template {
        entityId
        name
        privateName
        isSideQuest
        formFactor
        theme
        modules {
          name
          displayTitle
          description
          entityId
          stepPrototypes {
            name
            entityId
            body
            bodySlate
            stepType
          }
        }
      }
      errors
    }
  }
`;

type Args = CreateTemplateMutation['variables']['input'];

export function commit({
  variation,
  templateData,
}: Args): Promise<CreateTemplateMutation['response']> {
  const variables: CreateTemplateMutation['variables'] = {
    input: {
      variation,
      templateData,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
