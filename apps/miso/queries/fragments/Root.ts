import { graphql } from 'react-relay';

export const ROOT_BRANCHING_TARGETS = graphql`
  fragment Root_branchingTargets on RootType {
    templates: findTemplates(entityIds: $templateEntityIds) {
      entityId
      name
      privateName
      type
      formFactor
      designType
      isSideQuest
      theme
      formFactor
      formFactorStyle {
        ...Guide_formFactorStyle @relay(mask: false)
      }
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
    modules: findModules(entityIds: $moduleEntityIds) {
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
`;
