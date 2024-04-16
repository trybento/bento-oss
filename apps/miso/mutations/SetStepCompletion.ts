import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { SetStepCompletionMutation } from 'relay-types/SetStepCompletionMutation.graphql';

const mutationName = 'setStepCompletion';
const mutation = graphql`
  mutation SetStepCompletionMutation($input: SetStepCompletionInput!) {
    setStepCompletion(input: $input) {
      step {
        id
        entityId
        isComplete
        completedAt
        completedByUser {
          entityId
        }
        completedByAccountUser {
          entityId
        }
      }
    }
  }
`;

type Args = SetStepCompletionMutation['variables']['input'];

export function commit({
  stepEntityId,
  isComplete,
}: Args): Promise<SetStepCompletionMutation['response']> {
  const variables: SetStepCompletionMutation['variables'] = {
    input: {
      stepEntityId,
      isComplete,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
