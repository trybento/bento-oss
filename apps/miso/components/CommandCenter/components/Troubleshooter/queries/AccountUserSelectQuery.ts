import { graphql } from 'react-relay';
import fetchQuery, { QueryOptions } from 'queries/fetchQuery';
import { AccountUserSelectQuery } from 'relay-types/AccountUserSelectQuery.graphql';

const commit = (
  props?: QueryOptions & { variables: AccountUserSelectQuery['variables'] }
) => {
  return fetchQuery<
    AccountUserSelectQuery['variables'],
    AccountUserSelectQuery['response']
  >({
    query: graphql`
      query AccountUserSelectQuery(
        $query: String
        $queryField: AccountUserQueryFieldEnum!
        $filterEntityId: String
      ) {
        entities: searchAccountUsers(
          query: $query
          queryField: $queryField
          filterAccountEntityId: $filterEntityId
        ) {
          entityId
          externalId
          fullName
          email
          account {
            name
          }
        }
      }
    `,
    variables: props?.variables || ({} as AccountUserSelectQuery['variables']),
    options: {
      fetchPolicy: props?.fetchPolicy,
    },
    doNotRetain: true,
  });
};

export default commit;
