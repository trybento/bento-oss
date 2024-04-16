import { graphql } from 'react-relay';

graphql`
  fragment GuideBaseOverflowMenuButton_guideBase on GuideBase {
    account {
      entityId
      name
    }
    name
    entityId
    state
    isTargetedForSplitTesting
    wasAutoLaunched
    createdFromTemplate {
      name
      entityId
    }
  }
`;
