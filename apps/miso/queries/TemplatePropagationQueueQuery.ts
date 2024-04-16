import { graphql } from 'react-relay';

import { TemplatePropagationQueueQuery } from 'relay-types/TemplatePropagationQueueQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query TemplatePropagationQueueQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      entityId
      propagationQueue
    }
  }
`;

type Args = TemplatePropagationQueueQuery['variables'];

export default function commit({
  templateEntityId,
}: Args): Promise<TemplatePropagationQueueQuery['response']> {
  const variables: TemplatePropagationQueueQuery['variables'] = {
    templateEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
