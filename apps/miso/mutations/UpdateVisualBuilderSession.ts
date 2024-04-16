import { graphql } from 'react-relay';
import commitMutation from './commitMutation';
import { UpdateVisualBuilderSessionMutation } from 'relay-types/UpdateVisualBuilderSessionMutation.graphql';

const mutationName = 'updateVisualBuilderSession';

const mutation = graphql`
  mutation UpdateVisualBuilderSessionMutation(
    $input: UpdateVisualBuilderSessionInput!
  ) {
    updateVisualBuilderSession(input: $input) {
      visualBuilderSession {
        entityId
      }
    }
  }
`;

type Args = UpdateVisualBuilderSessionMutation['variables']['input'];

export function commit({
  visualBuilderSessionEntityId,
  previewData,
  progressData,
  state,
}: Args): Promise<UpdateVisualBuilderSessionMutation['response']> {
  const variables: UpdateVisualBuilderSessionMutation['variables'] = {
    input: {
      visualBuilderSessionEntityId,
      previewData,
      progressData,
      state,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
