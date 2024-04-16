import { graphql } from 'react-relay';

import { TemplatePropagationCountQuery } from 'relay-types/TemplatePropagationCountQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query TemplatePropagationCountQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      propagationCount
    }
  }
`;

type Args = TemplatePropagationCountQuery['variables'];

export default function commit({
  templateEntityId,
}: Args): Promise<TemplatePropagationCountQuery['response']> {
  const variables: TemplatePropagationCountQuery['variables'] = {
    templateEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
