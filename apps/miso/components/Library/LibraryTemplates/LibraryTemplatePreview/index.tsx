import React from 'react';
import { graphql } from 'react-relay';

import Box from 'system/Box';

graphql`
  query LibraryTemplatePreviewQuery($entityId: EntityId!) {
    template: findTemplate(entityId: $entityId) {
      entityId
      name
      type
      isCyoa
      displayTitle
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
        }
      }
    }
    uiSettings {
      ...UISettings_all
    }
  }
`;

export default function LibraryTemplatePreviewQueryRenderer() {
  return <Box>Deprecated</Box>;
}
