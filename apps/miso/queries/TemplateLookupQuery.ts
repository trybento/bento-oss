import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { TemplateLookupQuery } from 'relay-types/TemplateLookupQuery.graphql';

const commit = (entityId: string) => {
  return fetchQuery<
    TemplateLookupQuery['variables'],
    TemplateLookupQuery['response']
  >({
    query: graphql`
      query TemplateLookupQuery($entityId: EntityId!) {
        findTemplate(entityId: $entityId) {
          entityId
          name
          organization {
            name
          }
        }
      }
    `,
    variables: { entityId },
    doNotRetain: true,
    options: {
      fetchPolicy: 'store-or-network',
    },
  });
};

export default commit;
