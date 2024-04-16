import { graphql } from 'react-relay';
import fetchQuery, { QueryOptions } from 'queries/fetchQuery';
import { TroubleshootTemplateSelectedQuery } from 'relay-types/TroubleshootTemplateSelectedQuery.graphql';

const commit = (
  props?: QueryOptions & {
    variables: TroubleshootTemplateSelectedQuery['variables'];
  }
) => {
  return fetchQuery<
    TroubleshootTemplateSelectedQuery['variables'],
    TroubleshootTemplateSelectedQuery['response']
  >({
    query: graphql`
      query TroubleshootTemplateSelectedQuery($templateEntityId: EntityId!) {
        template: findTemplate(entityId: $templateEntityId) {
          name
          pageTargetingType
          designType
          formFactor
          locationShown
          taggedElements {
            elementSelector
          }
        }
      }
    `,
    variables:
      props?.variables ||
      ({} as TroubleshootTemplateSelectedQuery['variables']),
    options: {
      fetchPolicy: props?.fetchPolicy,
    },
    doNotRetain: true,
  });
};

export default commit;
