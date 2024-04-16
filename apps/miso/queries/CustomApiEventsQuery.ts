import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { CustomApiEventsQuery } from 'relay-types/CustomApiEventsQuery.graphql';

const commit = (excludeBentoEvents?: boolean, excludePseudoEvents = false) => {
  return fetchQuery<
    CustomApiEventsQuery['variables'],
    CustomApiEventsQuery['response']
  >({
    query: graphql`
      query CustomApiEventsQuery(
        $excludeBentoEvents: Boolean!
        $excludePseudoEvents: Boolean!
      ) {
        customApiEvents(
          excludeBentoEvents: $excludeBentoEvents
          excludePseudoEvents: $excludePseudoEvents
        ) {
          entityId
          name
          type
          source
        }
      }
    `,
    variables: { excludeBentoEvents, excludePseudoEvents },
    doNotRetain: true,
  });
};

export default commit;
