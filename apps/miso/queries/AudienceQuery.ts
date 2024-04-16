import { graphql } from 'react-relay';

import { AudienceQuery } from 'relay-types/AudienceQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query AudienceQuery($audienceEntityId: EntityId!) {
    audience: findAudience(entityId: $audienceEntityId) {
      entityId
      name
      ...AudienceRule_targets @relay(mask: false)
      templates {
        name
        entityId
        privateName
        formFactor
        type
        theme
        state
        isCyoa
        designType
      }
    }
  }
`;

type Args = AudienceQuery['variables'];

export default function commit({
  audienceEntityId,
}: Args): Promise<AudienceQuery['response']> {
  const variables: AudienceQuery['variables'] = {
    audienceEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
