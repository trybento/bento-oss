import { graphql } from 'react-relay';

import { TemplateManuallyLaunchedQuery } from 'relay-types/TemplateManuallyLaunchedQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query TemplateManuallyLaunchedQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      manuallyLaunchedAccounts {
        entityId
        name
      }
    }
  }
`;

type Args = TemplateManuallyLaunchedQuery['variables'];

export default function commit({
  templateEntityId,
}: Args): Promise<TemplateManuallyLaunchedQuery['response']> {
  const variables: TemplateManuallyLaunchedQuery['variables'] = {
    templateEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
