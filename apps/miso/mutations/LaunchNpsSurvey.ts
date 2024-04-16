import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  LaunchNpsSurveyInput,
  LaunchNpsSurveyMutation,
} from 'relay-types/LaunchNpsSurveyMutation.graphql';

const mutationName = 'launchNpsSurvey';
const mutation = graphql`
  mutation LaunchNpsSurveyMutation($input: LaunchNpsSurveyInput!) {
    launchNpsSurvey(input: $input) {
      errors
      npsSurvey {
        id
        entityId
        state
        startAt
        launchedAt
      }
    }
  }
`;

export function commit(
  input: LaunchNpsSurveyInput
): Promise<LaunchNpsSurveyMutation['response']> {
  const variables: LaunchNpsSurveyMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
