import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { EventAutocompletesQuery } from 'relay-types/EventAutocompletesQuery.graphql';

const commit = (entityId: string) => {
  return fetchQuery<
    EventAutocompletesQuery['variables'],
    EventAutocompletesQuery['response']
  >({
    query: graphql`
      query EventAutocompletesQuery($entityId: EntityId!) {
        customApiEvent: findCustomApiEvent(entityId: $entityId) {
          entityId
          autocompletes {
            entityId
            name
            templates {
              entityId
            }
            module {
              entityId
            }
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
