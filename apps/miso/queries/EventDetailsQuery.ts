import { graphql } from 'react-relay';

import { EventDetailsQuery } from 'relay-types/EventDetailsQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query EventDetailsQuery($customApiEventEntityId: EntityId!) {
    customApiEvent: findCustomApiEvent(entityId: $customApiEventEntityId) {
      entityId
      name
      type
      source
      lastSeen
      debugInformation {
        payload
        autoCompletedSteps {
          name
        }
        triggeredByAccountUser {
          fullName
          account {
            name
          }
        }
      }
    }
  }
`;

type Args = EventDetailsQuery['variables'];

export default function commit({
  customApiEventEntityId,
}: Args): Promise<EventDetailsQuery['response']> {
  const variables: EventDetailsQuery['variables'] = {
    customApiEventEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
