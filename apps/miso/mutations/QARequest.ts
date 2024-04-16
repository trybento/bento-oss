import { graphql } from 'react-relay';

import commitMutation from './commitMutation';
import { QARequestMutation } from 'relay-types/QARequestMutation.graphql';

const mutationName = 'qaRequest';

const mutation = graphql`
  mutation QARequestMutation($input: QARequestInput!) {
    qaRequest(input: $input) {
      result
      jsonString
      errors
    }
  }
`;

type Args = QARequestMutation['variables']['input'];

export function commit(input: Args): Promise<QARequestMutation['response']> {
  const variables: QARequestMutation['variables'] = {
    input,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
