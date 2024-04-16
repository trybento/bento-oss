import { graphql } from 'react-relay';

import { TemplatesLaunchingTemplateQuery } from 'relay-types/TemplatesLaunchingTemplateQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query TemplatesLaunchingTemplateQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      launchedBy {
        ...RankableObjects_templates @relay(mask: false)
      }
    }
  }
`;

type Args = TemplatesLaunchingTemplateQuery['variables'];

export default function commit({
  templateEntityId,
}: Args): Promise<TemplatesLaunchingTemplateQuery['response']> {
  const variables: TemplatesLaunchingTemplateQuery['variables'] = {
    templateEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
