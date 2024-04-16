import { graphql } from 'react-relay';

graphql`
  fragment Cta_stepPrototypeCta on StepPrototypeCta {
    entityId
    type
    style
    text
    url
    settings {
      bgColorField
      textColorField
      eventName
      markComplete
      implicit
      opensInNewTab
    }
    destinationGuide
  }

  fragment Cta_guideBaseStepCta on GuideBaseStepCta {
    entityId
    type
    style
    text
    url
    settings {
      bgColorField
      textColorField
      eventName
      markComplete
      implicit
      opensInNewTab
    }
    destinationGuide
  }
`;
