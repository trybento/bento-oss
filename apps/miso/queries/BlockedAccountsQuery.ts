import { graphql } from 'react-relay';

import { BlockedAccountsQuery } from 'relay-types/BlockedAccountsQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query BlockedAccountsQuery {
    accounts(blocked: true) {
      name
      entityId
      externalId
      blockedAt
      blockedBy {
        fullName
        email
      }
    }
  }
`;

export default function commit(): Promise<BlockedAccountsQuery['response']> {
  return fetchQuery({ query, variables: {}, doNotRetain: true });
}
