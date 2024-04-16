import React, { createContext, useContext } from 'react';
import { graphql } from 'react-relay';

import QueryRenderer from 'components/QueryRenderer';
import { CurrentAccountProviderQuery } from 'relay-types/CurrentAccountProviderQuery.graphql';

const CurrentAccountContext = createContext({
  account: null,
  organization: null,
});

export function useCurrentAccount() {
  const { account, organization } = useContext(CurrentAccountContext);

  return { account, organization };
}

function CurrentAccountProvider({ account, organization, children }) {
  return (
    <CurrentAccountContext.Provider value={{ account, organization }}>
      {children}
    </CurrentAccountContext.Provider>
  );
}

const CURRENT_ACCOUNT_QUERY = graphql`
  query CurrentAccountProviderQuery($entityId: EntityId!) {
    account: findAccount(entityId: $entityId) {
      entityId
      name
      attributes
      accountUsers {
        __typename
        avatarUrl
        entityId
        fullName
        email
      }
    }
    organization {
      users {
        __typename
        avatarUrl
        entityId
        fullName
        email
      }
    }
  }
`;

export default function CurrentAccountProviderQueryRenderer({
  accountEntityId,
  children: containerChildren,
}) {
  if (!accountEntityId) return;

  return (
    <QueryRenderer<CurrentAccountProviderQuery>
      query={CURRENT_ACCOUNT_QUERY}
      variables={{
        entityId: accountEntityId,
      }}
      render={({
        props,
      }: {
        props: CurrentAccountProviderQuery['response'];
      }) => {
        if (props) {
          const { account, organization } = props;
          if (account && organization) {
            return (
              <CurrentAccountProvider
                account={account}
                organization={organization}
                children={containerChildren}
              />
            );
          }
        }
      }}
    />
  );
}
