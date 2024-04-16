import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { ResetGuideBaseMutation } from 'relay-types/ResetGuideBaseMutation.graphql';

const mutationName = 'resetGuideBase';
const mutation = graphql`
  mutation ResetGuideBaseMutation($input: ResetGuideBaseInput!) {
    resetGuideBase(input: $input) {
      guideBase {
        entityId
        name
      }
      errors
    }
  }
`;

type Args = ResetGuideBaseMutation['variables']['input'];

export function commit({
  guideBaseEntityId,
}: Args): Promise<ResetGuideBaseMutation['response']> {
  const variables: ResetGuideBaseMutation['variables'] = {
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
