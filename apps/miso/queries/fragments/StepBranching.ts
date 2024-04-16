import { graphql } from 'react-relay';

export const STEP_BRANCHING_STYLE = graphql`
  fragment StepBranching_style on BranchingStyle {
    ... on BranchingCardStyle {
      backgroundImageUrl
      backgroundImagePosition
    }
  }
`;
