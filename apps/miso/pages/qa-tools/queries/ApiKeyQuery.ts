import { graphql } from 'react-relay';

import { ApiKeyQuery } from 'relay-types/ApiKeyQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query ApiKeyQuery {
    orgSettings {
      bentoApiKey {
        key
        integratedAt
      }
    }
  }
`;

export default function commit(): Promise<ApiKeyQuery['response']> {
  return fetchQuery({
    query,
    variables: {},
    doNotRetain: true,
    options: { fetchPolicy: 'store-or-network' },
  });
}
