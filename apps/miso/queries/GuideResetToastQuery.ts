import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { GuideResetToastQuery } from 'relay-types/GuideResetToastQuery.graphql';

const query = graphql`
  query GuideResetToastQuery(
    $resetLevel: ResetLevelEnumType!
    $entityIds: [EntityId!]!
  ) {
    organization {
      areEntitiesResetting(resetLevel: $resetLevel, entityIds: $entityIds)
    }
  }
`;

export default function commit(
  variables?: GuideResetToastQuery['variables']
): Promise<GuideResetToastQuery['response']> {
  return fetchQuery({
    query,
    variables,
    doNotRetain: true,
    options: { fetchPolicy: 'network-only' },
  });
}
