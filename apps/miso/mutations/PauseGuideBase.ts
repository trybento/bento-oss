import { graphql } from 'react-relay';

import commitMutation from './commitMutation';
import { PauseGuideBaseMutation } from 'relay-types/PauseGuideBaseMutation.graphql';

const mutationName = 'pauseGuideBase';

const mutation = graphql`
  mutation PauseGuideBaseMutation($input: PauseGuideBaseInput!) {
    pauseGuideBase(input: $input) {
      guideBase {
        id
        entityId
        state
      }
    }
  }
`;

type Args = PauseGuideBaseMutation['variables']['input'];

export function commit({
  guideBaseEntityId,
}: Args): Promise<PauseGuideBaseMutation['response']> {
  const variables: PauseGuideBaseMutation['variables'] = {
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
