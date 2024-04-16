import React, { createContext, useContext } from 'react';
import { graphql } from 'react-relay';

import QueryRenderer from 'components/QueryRenderer';
import { UsersProviderQuery } from 'relay-types/UsersProviderQuery.graphql';
import UserCache from 'helpers/UserCache';
import { OrgUsersDropdown_users$data } from 'relay-types/OrgUsersDropdown_users.graphql';

const UsersContext = createContext({
  users: [],
});

export type UsersQuery_users = OrgUsersDropdown_users$data;

export function useUsers(): {
  users: UsersQuery_users;
} {
  const { users } = useContext(UsersContext);

  return { users: users || [] };
}

function UsersProvider({ children, users }) {
  return (
    <UsersContext.Provider value={{ users }}>{children}</UsersContext.Provider>
  );
}

const USERS_QUERY = graphql`
  query UsersProviderQuery {
    organization {
      slug
      users {
        email
        avatarUrl
        fullName
        ...OrgUsersDropdown_users
      }
    }
  }
`;

/**
 * Load users separately becauser avatarUrls take time to resolve
 */
export default function UsersProviderQueryRenderer({
  children: containerChildren,
}) {
  const infoCache = UserCache.getUsersResponse();
  return (
    <QueryRenderer<UsersProviderQuery>
      query={USERS_QUERY}
      render={({ props }: { props: UsersProviderQuery['response'] }) => {
        if (props || infoCache) {
          if (props?.organization?.users) UserCache.setUsersResponse(props);
          const { organization } = props || {};
          return (
            <UsersProvider
              users={
                organization?.users || infoCache?.organization?.users || []
              }
              children={containerChildren}
            />
          );
        }
      }}
    />
  );
}
