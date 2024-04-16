import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { EditTemplateMutation } from 'relay-types/EditTemplateMutation.graphql';

const mutationName = 'editTemplate';
const mutation = graphql`
  mutation EditTemplateMutation($input: EditTemplateInput!) {
    editTemplate(input: $input) {
      template {
        updatedAt
        entityId
        privateName
        description
        name
        theme
        isSideQuest
        formFactor
        formFactorStyle {
          ...Guide_formFactorStyle @relay(mask: false)
        }
        pageTargetingType
        pageTargetingUrl
        isAutoLaunchEnabled
        enableAutoLaunchAt
        disableAutoLaunchAt
        archivedAt
        expireBasedOn
        expireAfter
        notificationSettings {
          ...Guide_notificationSettings @relay(mask: false)
        }
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
            branchingKey
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
              templateEntityId
              template {
                entityId
              }
              moduleEntityId
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
        }
      }
      errors
    }
  }
`;

type Args = EditTemplateMutation['variables']['input'];

export function commit({
  templateData,
}: Args): Promise<EditTemplateMutation['response']> {
  const variables: EditTemplateMutation['variables'] = {
    input: {
      templateData,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
