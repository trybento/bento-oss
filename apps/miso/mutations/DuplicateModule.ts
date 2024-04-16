import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DuplicateModuleMutation } from 'relay-types/DuplicateModuleMutation.graphql';

const mutationName = 'duplicateModule';
const mutation = graphql`
  mutation DuplicateModuleMutation($input: DuplicateModuleInput!) {
    duplicateModule(input: $input) {
      module {
        updatedAt
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
          eventMappings {
            eventName
            completeForWholeAccount
            rules {
              propertyName
              valueType
              ruleType
              numberValue
              textValue
              booleanValue
              dateValue
            }
          }
        }
      }
      errors
    }
  }
`;

type Args = DuplicateModuleMutation['variables']['input'];

export function commit({
  entityId,
}: Args): Promise<DuplicateModuleMutation['response']> {
  const variables: DuplicateModuleMutation['variables'] = {
    input: {
      entityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
