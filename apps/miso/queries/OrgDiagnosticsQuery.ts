import { graphql } from 'react-relay';
import fetchQuery, { QueryOptions } from 'queries/fetchQuery';
import { OrgDiagnosticsQuery } from 'relay-types/OrgDiagnosticsQuery.graphql';

const commit = (props?: QueryOptions) => {
  return fetchQuery<
    OrgDiagnosticsQuery['variables'],
    OrgDiagnosticsQuery['response']
  >({
    query: graphql`
      query OrgDiagnosticsQuery {
        organization {
          diagnostics {
            successfulInitialization
            hardCodedUsers
            validAccountUserIds
            hardCodedAccounts
            hasRecommendedAttributes
            inconsistentTypes
            nonIsoDates
          }
        }
      }
    `,
    variables: {} as OrgDiagnosticsQuery['variables'],
    options: {
      fetchPolicy: props?.fetchPolicy,
    },
    doNotRetain: true,
  });
};

export default commit;
