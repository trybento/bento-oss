import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { GuideBaseResetQuery } from 'relay-types/GuideBaseResetQuery.graphql';

const commit = (accountEntityId: string) => {
  return fetchQuery<
    GuideBaseResetQuery['variables'],
    GuideBaseResetQuery['response']
  >({
    query: graphql`
      query GuideBaseResetQuery($entityId: EntityId!) {
        account: findAccount(entityId: $entityId) {
          hasGuides
        }
      }
    `,
    variables: { entityId: accountEntityId },
    doNotRetain: true,
  });
};

export default commit;
