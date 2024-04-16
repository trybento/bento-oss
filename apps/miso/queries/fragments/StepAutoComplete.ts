import { graphql } from 'react-relay';

export const STEP_PROTOTYPE_AUTO_COMPLETE_INTERACTION_FRAGMENT = graphql`
  fragment StepAutoComplete_autoCompleteInteractions on AutoCompleteInteraction {
    ... on OnGuideCompletion {
      interactionType
      templateEntityId
    }
  }
`;
