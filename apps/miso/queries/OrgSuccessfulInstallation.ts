import { graphql } from 'react-relay';
import { DiagnosticStates, OrgState } from 'bento-common/types';

import fetchQuery from 'queries/fetchQuery';
import { OrgSuccessfulInstallationQuery as OrgSuccessfulInstallationQueryType } from 'relay-types/OrgSuccessfulInstallationQuery.graphql';
import { useEffect, useState } from 'react';
import { useDiagnosticsOverride } from 'hooks/useFeatureFlag';

const query = graphql`
  query OrgSuccessfulInstallationQuery {
    organization {
      state
      diagnostics {
        successfulInitialization
      }
    }
  }
`;

export function OrgSuccessfulInstallationQuery(): Promise<
  OrgSuccessfulInstallationQueryType['response']
> {
  return fetchQuery({
    query,
    variables: {},
    doNotRetain: true,
    options: { fetchPolicy: 'store-or-network' },
  });
}

export default function useSuccessfulInstallation() {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  /* To override disables, but maybe we need a distinction eventually between overridden and healthy? */
  const override = useDiagnosticsOverride();

  useEffect(() => {
    if (override) return setHealthy(true);

    OrgSuccessfulInstallationQuery().then(
      ({
        organization: {
          state,
          diagnostics: { successfulInitialization },
        },
      }) => {
        setHealthy(
          successfulInitialization === DiagnosticStates.healthy &&
            state !== OrgState.Inactive
        );
      }
    );
  }, []);

  return override || healthy;
}
