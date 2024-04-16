import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { LaunchGuideBaseMutation } from 'relay-types/LaunchGuideBaseMutation.graphql';

const mutationName = 'editGuide';
const mutation = graphql`
  mutation LaunchGuideBaseMutation($input: LaunchGuideBaseInput!) {
    launchGuideBase(input: $input) {
      guideBase {
        entityId
        type
        createdFromTemplate {
          entityId
        }
        accountGuide {
          entityId
        }
      }
    }
  }
`;

type Args = LaunchGuideBaseMutation['variables']['input'];

export function commit({
  guideBaseEntityId,
  priorityRanking,
}: Args): Promise<LaunchGuideBaseMutation['response']> {
  const variables: LaunchGuideBaseMutation['variables'] = {
    input: {
      guideBaseEntityId,
      priorityRanking,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
