import { graphql } from 'react-relay';
import { RankableObjectsQuery } from 'relay-types/RankableObjectsQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query RankableObjectsQuery {
    launchedNpsSurveys: npsSurveys(launched: true) {
      ...RankableObjects_surveys @relay(mask: false)
    }
    autoLaunchableTemplates: templates(
      autoLaunchableOnly: true
      category: all
    ) {
      ...RankableObjects_templates @relay(mask: false)
    }
  }
`;

export default function commit(): Promise<RankableObjectsQuery['response']> {
  return fetchQuery({ query, variables: {}, doNotRetain: true });
}
