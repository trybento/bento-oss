import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  SetStepAutoCompleteMappingInput,
  SetStepAutoCompleteMappingMutation,
} from 'relay-types/SetStepAutoCompleteMappingMutation.graphql';

const mutationName = 'setStepAutoCompleteMapping';
const mutation = graphql`
  mutation SetStepAutoCompleteMappingMutation(
    $input: SetStepAutoCompleteMappingInput!
  ) {
    setStepAutoCompleteMapping(input: $input) {
      organization {
        name
      }
    }
  }
`;

export function commit({
  stepPrototypeEntityId,
  eventName,
  completeForWholeAccount,
  rules,
}: SetStepAutoCompleteMappingInput): Promise<
  SetStepAutoCompleteMappingMutation['response']
> {
  const variables: SetStepAutoCompleteMappingMutation['variables'] = {
    input: {
      stepPrototypeEntityId,
      eventName,
      completeForWholeAccount,
      rules,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
