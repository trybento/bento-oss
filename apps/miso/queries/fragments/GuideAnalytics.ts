import { graphql } from 'react-relay';

graphql`
  fragment GuideAnalytics_template_stats on TemplateStats {
    usersSeenGuide
    completedAStep
    percentCompleted
    usersDismissed
    usersClickedCta
    usersSavedForLater
    guidesViewed
    guidesWithCompletedStep
    percentGuidesCompleted
    averageStepsCompleted
    averageStepsCompletedForEngaged
    inputStepAnswersCount
    usersAnswered
    accountsSeen
  }

  fragment GuideAnalytics_branching_module_stats on Module {
    displayTitle
    entityId
    stepPrototypes {
      name
      stepType
      stepCompletionStats {
        stepsCompleted
        totalSteps
      }
    }
  }

  fragment GuideAnalytics_template_content on Template {
    name
    designType
    formFactor
    isCyoa
    theme
    type
    isSideQuest
    inputsCount
    announcementActivity {
      date
      dismissed
      savedForLater
      viewed
      ctaActivity {
        ctaEntityId
        text
        count
      }
    }
    modules {
      stepPrototypes {
        name
        stepType
        isAutoCompletable
        stepCompletionStats(templateEntityId: $templateEntityId) {
          stepsCompleted
          viewedSteps
          totalSteps
        }
        branchingPerformance(templateEntityId: $templateEntityId) {
          createdModule {
            ...GuideAnalytics_branching_module_stats @relay(mask: false)
          }
          triggeredCount
          choiceText
        }
        ctas {
          text
          type
          url
          destinationGuideObj {
            entityId
            name
          }
          settings {
            eventName
          }
        }
      }
    }
    formFactorStyle {
      ...Guide_formFactorStyle @relay(mask: false)
    }
  }

  fragment GuideAnalytics_template on Template {
    ...GuideAnalytics_template_content @relay(mask: false)
    stats(useLocked: $useLocked) {
      ...GuideAnalytics_template_stats @relay(mask: false)
    }
  }

  fragment GuideAnalytics_main on Template {
    entityId
    type
    ...GuideAnalytics_template @relay(mask: false)
    branchingPerformance(detachedOnly: true) {
      createdModule {
        ...GuideAnalytics_branching_module_stats @relay(mask: false)
      }
      createdTemplate {
        entityId
        name
      }
      count
    }
    branchedGuidesCount
    splitSources {
      entityId
      lastUsedAt
      updatedAt
      state
      splitTestState
      name
      splitTargets {
        ...EditSplitTest_splitTarget @relay(mask: false)
        ...GuideAnalytics_template_content @relay(mask: false)
        stats(useLocked: true) {
          ...GuideAnalytics_template_stats @relay(mask: false)
        }
      }
    }
  }
`;
