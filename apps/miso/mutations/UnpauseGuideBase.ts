import { graphql } from 'react-relay';

import commitMutation from './commitMutation';
import { UnpauseGuideBaseMutation } from 'relay-types/UnpauseGuideBaseMutation.graphql';

const mutationName = 'unpauseGuideBase';

const mutation = graphql`
  mutation UnpauseGuideBaseMutation($input: UnpauseGuideBaseInput!) {
    unpauseGuideBase(input: $input) {
      guideBase {
        id
        entityId
        state
      }
    }
  }
`;

type Args = UnpauseGuideBaseMutation['variables']['input'];

export function commit({
  guideBaseEntityId,
}: Args): Promise<UnpauseGuideBaseMutation['response']> {
  const variables: UnpauseGuideBaseMutation['variables'] = {
    input: {
      guideBaseEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
