import { graphql } from 'react-relay';
import commitMutation from './commitMutation';
import { EditNpsSurveyMutation } from 'relay-types/EditNpsSurveyMutation.graphql';

const mutationName = 'editNpsSurvey';
const mutation = graphql`
  mutation EditNpsSurveyMutation($input: EditNpsSurveyInput!) {
    editNpsSurvey(input: $input) {
      npsSurvey {
        entityId
        name
      }
      errors
    }
  }
`;

type Args = EditNpsSurveyMutation['variables']['input'];

export function commit(
  input: Args
): Promise<EditNpsSurveyMutation['response']> {
  const variables: EditNpsSurveyMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
