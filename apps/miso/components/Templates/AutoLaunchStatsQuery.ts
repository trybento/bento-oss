import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { AutoLaunchStatsQuery } from 'relay-types/AutoLaunchStatsQuery.graphql';

const commit = (templateEntityId: string) => {
  return fetchQuery<
    AutoLaunchStatsQuery['variables'],
    AutoLaunchStatsQuery['response']
  >({
    query: graphql`
      query AutoLaunchStatsQuery($entityId: EntityId!) {
        template: findTemplate(entityId: $entityId) {
          autoLaunchAudienceCount
          ...Template_targets @relay(mask: false)
        }
      }
    `,
    variables: { entityId: templateEntityId },
    doNotRetain: true,
  });
};

export default commit;
