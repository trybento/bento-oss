import { graphql } from 'react-relay';

import { TemplateDynamicModulesQuery } from 'relay-types/TemplateDynamicModulesQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query TemplateDynamicModulesQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      dynamicModules {
        entityId
        name
        displayTitle
        targetingData {
          targetTemplate
          autoLaunchRules {
            ruleType
            rules
          }
        }
      }
    }
  }
`;

type Args = TemplateDynamicModulesQuery['variables'];

export default function commit({
  templateEntityId,
}: Args): Promise<TemplateDynamicModulesQuery['response']> {
  const variables: TemplateDynamicModulesQuery['variables'] = {
    templateEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
