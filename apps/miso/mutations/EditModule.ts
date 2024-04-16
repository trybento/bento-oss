import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { EditModuleMutation } from 'relay-types/EditModuleMutation.graphql';

const mutationName = 'editModule';
const mutation = graphql`
  mutation EditModuleMutation($input: EditModuleInput!) {
    editModule(input: $input) {
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
          autoCompleteInteraction {
            url
            type
            wildcardUrl
            elementSelector
            elementText
            elementHtml
          }
          inputs {
            entityId
            label
            type
            settings {
              ...StepInput_settings @relay(mask: false)
            }
          }
        }
        targetingData {
          targetTemplate
          autoLaunchRules {
            ruleType
            rules
          }
        }
      }
      errors
    }
  }
`;

type Args = EditModuleMutation['variables']['input'];

export function commit({
  moduleData,
  targetingData,
}: Args): Promise<EditModuleMutation['response']> {
  const variables: EditModuleMutation['variables'] = {
    input: {
      moduleData,
      targetingData,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
