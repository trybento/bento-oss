import { graphql } from 'react-relay';
import { AudiencesQuery } from 'relay-types/AudiencesQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query AudiencesQuery {
    audiences {
      entityId
      name
      ...AudienceRule_targets @relay(mask: false)
    }
  }
`;

export default function commit(): Promise<AudiencesQuery['response']> {
  return fetchQuery({
    query,
    variables: {},
    doNotRetain: true,
  });
}
