import React, { createContext, useContext, useEffect } from 'react';

import { graphql } from 'react-relay';
import QueryRenderer from 'components/QueryRenderer';
import { useRouter } from 'next/router';

import { LoggedInUserProviderQuery } from 'relay-types/LoggedInUserProviderQuery.graphql';
import UserCache from 'helpers/UserCache';
import { SessionRedirect } from 'helpers';

export type LoggedInUser =
  LoggedInUserProviderQuery['response']['loggedInUser'];

interface LoggedInUserProviderValue {
  loggedInUser: LoggedInUser | null;
  organization: LoggedInUser['organization'];
}

export const LoggedInUserContext = createContext<LoggedInUserProviderValue>({
  loggedInUser: null,
  organization: null,
});

function LoggedInUserProvider({ loggedInUser, children }) {
  const router = useRouter();

  useEffect(() => {
    if (!loggedInUser && !window.location.href.includes('/login')) {
      SessionRedirect.set(window.location.href);
      router.push('/login');
    }
  }, [loggedInUser]);

  if (!loggedInUser) return null;

  const { organization, orgSettings } = loggedInUser;

  return (
    <LoggedInUserContext.Provider
      value={{ loggedInUser, organization, orgSettings }}
    >
      {children}
    </LoggedInUserContext.Provider>
  );
}

export function useLoggedInUser() {
  const { loggedInUser } = useContext(LoggedInUserContext);

  return { loggedInUser };
}

export function useOrganization() {
  const { organization } = useContext(LoggedInUserContext);

  return { organization };
}

const LOGGED_IN_USER_QUERY = graphql`
  query LoggedInUserProviderQuery {
    loggedInUser: currentUser {
      entityId
      fullName
      email
      isSuperadmin
      avatarUrl
      createdAt
      hasBentoOnboardingGuide
      isBentoOnboardingGuideComplete
      extra
      allOrgs {
        entityId
      }
      organization {
        entityId
        name
        slug
        state
        domain
        createdAt
        allottedGuides
        enabledFeatureFlags
        controlSyncing
        hasAudiences
        hasAccountUsers
        hasDiagnosticWarnings
      }
    }
  }
`;

export default function LoggedInUserProviderQueryRenderer({
  children: containerChildren,
}) {
  /* Relying on store-or-network is still causing some query time wait */
  const infoCache = UserCache.getLoggedInUserResponse();

  return (
    <QueryRenderer<LoggedInUserProviderQuery>
      query={LOGGED_IN_USER_QUERY}
      fetchPolicy="store-and-network"
      render={({ props }) => {
        if (props || infoCache) {
          if (props && !infoCache) UserCache.setLoggedInUserResponse(props);
          const { loggedInUser } = props || {};
          return (
            <LoggedInUserProvider
              loggedInUser={loggedInUser || infoCache.loggedInUser}
              children={containerChildren}
            />
          );
        }
      }}
    />
  );
}
