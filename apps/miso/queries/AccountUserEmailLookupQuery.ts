import { graphql } from 'react-relay';

import { AccountUserEmailLookupQuery } from 'relay-types/AccountUserEmailLookupQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query AccountUserEmailLookupQuery($accountUserEmail: String!) {
    accountUser: findAccountUser(email: $accountUserEmail) {
      fullName
      email
      attributes
      externalId
      account {
        name
        externalId
      }
    }
  }
`;

type Args = AccountUserEmailLookupQuery['variables'];

export default function commit({
  accountUserEmail,
}: Args): Promise<AccountUserEmailLookupQuery['response']> {
  const variables: AccountUserEmailLookupQuery['variables'] = {
    accountUserEmail,
  };

  return fetchQuery({
    query,
    variables,
    doNotRetain: true,
    options: { fetchPolicy: 'store-or-network' },
  });
}
