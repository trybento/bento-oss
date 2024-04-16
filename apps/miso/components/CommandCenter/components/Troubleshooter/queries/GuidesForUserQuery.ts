import { graphql } from 'react-relay';
import fetchQuery, { QueryOptions } from 'queries/fetchQuery';
import { GuidesForUserQuery } from 'relay-types/GuidesForUserQuery.graphql';

const commit = (
  props?: QueryOptions & { variables: GuidesForUserQuery['variables'] }
) => {
  return fetchQuery<
    GuidesForUserQuery['variables'],
    GuidesForUserQuery['response']
  >({
    query: graphql`
      query GuidesForUserQuery($accountUserEntityId: EntityId!) {
        findGuidesForUser(entityId: $accountUserEntityId) {
          entityId
          createdFromTemplate {
            entityId
          }
        }
      }
    `,
    variables: props?.variables || ({} as GuidesForUserQuery['variables']),
    options: {
      fetchPolicy: props?.fetchPolicy,
    },
    doNotRetain: true,
  });
};

export default commit;
