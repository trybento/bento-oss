import { graphql } from 'react-relay';

import { AccountQueryQuery } from 'relay-types/AccountQueryQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query AccountQueryQuery($entityId: EntityId!) {
    account: findAccount(entityId: $entityId) {
      name
      externalId
      attributes
      archived
      blockedAt
      primaryContact {
        entityId
      }
    }
  }
`;

type Args = AccountQueryQuery['variables'];

export default function commit({
  entityId,
}: Args): Promise<AccountQueryQuery['response']> {
  const variables: AccountQueryQuery['variables'] = {
    entityId,
  };

  return fetchQuery({
    query,
    variables,
    doNotRetain: true,
    options: { fetchPolicy: 'store-or-network' },
  });
}
