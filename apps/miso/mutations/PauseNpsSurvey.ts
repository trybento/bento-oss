import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  PauseNpsSurveyInput,
  PauseNpsSurveyMutation,
} from 'relay-types/PauseNpsSurveyMutation.graphql';

const mutationName = 'pauseNpsSurvey';
const mutation = graphql`
  mutation PauseNpsSurveyMutation($input: PauseNpsSurveyInput!) {
    pauseNpsSurvey(input: $input) {
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
  input: PauseNpsSurveyInput
): Promise<PauseNpsSurveyMutation['response']> {
  const variables: PauseNpsSurveyMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
