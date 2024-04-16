import { graphql } from 'react-relay';
export const TEMPLATE_FRAGMENT = graphql`
  fragment Template_template on Template {
    entityId
    name
    privateName
    type
    formFactor
    formFactorStyle {
      ...Guide_formFactorStyle @relay(mask: false)
    }
    designType
    isSideQuest
    theme
    pageTargetingType
    modules {
      entityId
      name
      displayTitle
      stepPrototypes {
        entityId
        name
        bodySlate
        stepType
        manualCompletionDisabled
        branchingQuestion
        branchingMultiple
        branchingDismissDisabled
        branchingFormFactor
        branchingKey
        branchingEntityType
        branchingPathData: branchingPaths {
          choiceKey
          branchingKey
          entityType
          templateEntityId
          moduleEntityId
        }
        branchingChoices {
          choiceKey
          label
          style {
            ...StepBranching_style @relay(mask: false)
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
  }

  fragment Template_targets on Template {
    targets {
      account {
        type
        groups {
          rules {
            attribute
            ruleType
            valueType
            value
          }
        }
      }
      accountUser {
        type
        groups {
          rules {
            attribute
            ruleType
            valueType
            value
          }
        }
      }
      audiences {
        type
        groups {
          rules {
            attribute
            ruleType
            valueType
            value
          }
        }
      }
    }
  }
`;
