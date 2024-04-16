import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { CreateModuleMutation } from 'relay-types/CreateModuleMutation.graphql';

const mutationName = 'editmodule';
const mutation = graphql`
  mutation CreateModuleMutation($input: CreateModuleInput!) {
    createModule(input: $input) {
      module {
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
          manualCompletionDisabled
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
          branchingQuestion
          branchingMultiple
          branchingDismissDisabled
          branchingFormFactor
          branchingChoices {
            label
            choiceKey
            style {
              ...StepBranching_style @relay(mask: false)
            }
          }
          branchingPaths {
            choiceKey
            entityType
            template {
              entityId
            }
            module {
              entityId
            }
          }
          ctas {
            ...Cta_stepPrototypeCta @relay(mask: false)
          }
          mediaReferences {
            ...Media_stepMedia @relay(mask: false)
          }
        }
      }
      errors
    }
  }
`;

type Args = CreateModuleMutation['variables']['input'];

export function commit({
  moduleData,
}: Args): Promise<CreateModuleMutation['response']> {
  const variables: CreateModuleMutation['variables'] = {
    input: {
      moduleData,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
