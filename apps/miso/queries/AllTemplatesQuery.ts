import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { AllTemplatesQuery } from 'relay-types/AllTemplatesQuery.graphql';

/**
 * @todo deprecate `withMeta` arg
 */
const commit = (withMeta = true) => {
  return fetchQuery<
    AllTemplatesQuery['variables'],
    AllTemplatesQuery['response']
  >({
    query: graphql`
      query AllTemplatesQuery($withMeta: Boolean!) {
        templates {
          entityId
          name
          type
          privateName
          state
          isCyoa
          isSideQuest
          isTargetedForSplitTesting
          theme @include(if: $withMeta)
          designType @include(if: $withMeta)
          formFactor @include(if: $withMeta)
          archivedAt @include(if: $withMeta)
        }
      }
    `,
    variables: { withMeta },
    doNotRetain: true,
  });
};

export default commit;
