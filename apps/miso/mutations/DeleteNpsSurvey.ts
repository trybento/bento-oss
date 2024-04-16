import { graphql } from 'react-relay';
import commitMutation from './commitMutation';
import { DeleteNpsSurveyMutation } from 'relay-types/DeleteNpsSurveyMutation.graphql';

const mutationName = 'deleteNpsSurvey';
const mutation = graphql`
  mutation DeleteNpsSurveyMutation($input: DeleteNpsSurveyInput!) {
    deleteNpsSurvey(input: $input) {
      deletedNpsSurveyId
    }
  }
`;

type Args = DeleteNpsSurveyMutation['variables']['input'];

export function commit(
  input: Args
): Promise<DeleteNpsSurveyMutation['response']> {
  const variables: DeleteNpsSurveyMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
