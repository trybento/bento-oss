import { graphql } from 'react-relay';
import fetchQuery, { QueryOptions } from 'queries/fetchQuery';
import { AllModulesQuery } from 'relay-types/AllModulesQuery.graphql';

const commit = (props?: QueryOptions) => {
  return fetchQuery<AllModulesQuery['variables'], AllModulesQuery['response']>({
    query: graphql`
      query AllModulesQuery {
        modules {
          name
          displayTitle
          description
          entityId
          templates {
            entityId
          }
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
            inputs {
              entityId
              label
              type
              settings {
                ...StepInput_settings @relay(mask: false)
              }
            }
            autoCompleteInteraction {
              url
              type
              wildcardUrl
              elementSelector
              elementText
              elementHtml
            }
          }
        }
      }
    `,
    variables: {},
    options: {
      fetchPolicy: props?.fetchPolicy,
    },
    doNotRetain: true,
  });
};

export default commit;
