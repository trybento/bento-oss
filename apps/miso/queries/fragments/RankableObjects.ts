import { graphql } from 'react-relay';

graphql`
  fragment RankableObjects_surveys on NpsSurvey {
    entityId
    name
    launchedAt
    startingType
    priorityRanking
  }
`;

graphql`
  fragment RankableObjects_templates on Template {
    entityId
    name
    privateName
    isCyoa
    launchedAt
    type
    priorityRanking
    isAutoLaunchEnabled
    formFactor
    designType
    splitTargets {
      entityId
      name
      privateName
      displayTitle
    }
  }
`;
