import { graphql } from 'react-relay';

import { AutoLaunchableTemplatesQuery } from 'relay-types/AutoLaunchableTemplatesQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query AutoLaunchableTemplatesQuery {
    autoLaunchableTemplates: templates(
      autoLaunchableOnly: true
      category: all
    ) {
      entityId
      name
      formFactor
      isCyoa
      priorityRanking
      isAutoLaunchEnabled
    }
  }
`;

export default function commit(): Promise<
  AutoLaunchableTemplatesQuery['response']
> {
  return fetchQuery({ query, variables: {}, doNotRetain: true });
}
