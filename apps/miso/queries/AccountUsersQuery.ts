import { graphql } from 'react-relay';

import { AccountUsersQuery } from 'relay-types/AccountUsersQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query AccountUsersQuery($accountEntityId: EntityId!) {
    account: findAccount(entityId: $accountEntityId) {
      accountUsers {
        __typename
        avatarUrl
        entityId
        fullName
        email
        externalId
      }
    }
  }
`;

type Args = AccountUsersQuery['variables'];

export default function commit({
  accountEntityId,
}: Args): Promise<AccountUsersQuery['response']> {
  const variables: AccountUsersQuery['variables'] = {
    accountEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
