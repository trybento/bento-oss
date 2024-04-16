import { graphql } from 'react-relay';
import fetchQuery, { QueryOptions } from 'queries/fetchQuery';
import { AccountSelectQuery } from 'relay-types/AccountSelectQuery.graphql';

const commit = (
  props?: QueryOptions & { variables: AccountSelectQuery['variables'] }
) => {
  return fetchQuery<
    AccountSelectQuery['variables'],
    AccountSelectQuery['response']
  >({
    query: graphql`
      query AccountSelectQuery(
        $query: String
        $queryField: AccountQueryFieldEnum!
        $filterEntityId: String
      ) {
        entities: searchAccounts(
          query: $query
          queryField: $queryField
          filterAccountUserEntityId: $filterEntityId
        ) {
          entityId
          externalId
          name
        }
      }
    `,
    variables: props?.variables || ({} as AccountSelectQuery['variables']),
    options: {
      fetchPolicy: props?.fetchPolicy,
    },
    doNotRetain: true,
  });
};

export default commit;
