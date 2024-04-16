import { graphql } from 'react-relay';
import commitMutation from './commitMutation';
import { CreateVisualBuilderSessionMutation } from 'relay-types/CreateVisualBuilderSessionMutation.graphql';

const mutationName = 'createVisualBuilderSession';

const mutation = graphql`
  mutation CreateVisualBuilderSessionMutation(
    $input: CreateVisualBuilderSessionInput!
  ) {
    createVisualBuilderSession(input: $input) {
      visualBuilderSession {
        entityId
      }
      accessToken
      appId
    }
  }
`;

type Args = CreateVisualBuilderSessionMutation['variables']['input'];

export function commit({
  type,
  initialData,
}: Args): Promise<CreateVisualBuilderSessionMutation['response']> {
  const variables: CreateVisualBuilderSessionMutation['variables'] = {
    input: {
      type,
      initialData,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
