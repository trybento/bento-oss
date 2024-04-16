import { graphql } from 'react-relay';
import commitMutation from './commitMutation';
import { CreateNpsSurveyMutation } from 'relay-types/CreateNpsSurveyMutation.graphql';

const mutationName = 'createNpsSurvey';
const mutation = graphql`
  mutation CreateNpsSurveyMutation($input: CreateNpsSurveyInput!) {
    createNpsSurvey(input: $input) {
      npsSurvey {
        entityId
        name
      }
      errors
    }
  }
`;

type Args = CreateNpsSurveyMutation['variables']['input'];

export function commit(
  input: Args = {}
): Promise<CreateNpsSurveyMutation['response']> {
  const variables: CreateNpsSurveyMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
