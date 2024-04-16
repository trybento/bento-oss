import { graphql } from 'react-relay';

import { AccountUserQuery } from 'relay-types/AccountUserQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query AccountUserQuery($entityId: EntityId!) {
    accountUser: findAccountUser(entityId: $entityId) {
      fullName
      entityId
      externalId
      attributes
      account {
        name
        entityId
        attributes
      }
    }
    guides: findGuidesForUser(entityId: $entityId) {
      entityId
      name
      state
      isSideQuest
      formFactor
      isCyoa
      designType
      lastActiveAt
      completedAt
      completionPercentage
      createdFromGuideBase {
        wasAutoLaunched
        entityId
      }
      createdFromTemplate {
        entityId
        name
        privateName
      }
    }
  }
`;

type Args = AccountUserQuery['variables'];

export default function commit({
  entityId,
}: Args): Promise<AccountUserQuery['response']> {
  const variables: AccountUserQuery['variables'] = {
    entityId,
  };

  return fetchQuery({
    query,
    variables,
    doNotRetain: true,
    options: { fetchPolicy: 'store-or-network' },
  });
}
