import { graphql } from 'react-relay';
import { VisualBuilderSessionQuery } from 'relay-types/VisualBuilderSessionQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query VisualBuilderSessionQuery($visualBuilderSessionEntityId: EntityId!) {
    visualBuilderSession: findVisualBuilderSession(
      entityId: $visualBuilderSessionEntityId
    ) {
      entityId
      initialData
      progressData
      state
    }
    organization {
      state
    }
  }
`;

type Args = VisualBuilderSessionQuery['variables'];

export default function commit({
  visualBuilderSessionEntityId,
}: Args): Promise<VisualBuilderSessionQuery['response']> {
  const variables: VisualBuilderSessionQuery['variables'] = {
    visualBuilderSessionEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
