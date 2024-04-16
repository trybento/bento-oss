import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { ConfigureZendeskMutation } from 'relay-types/ConfigureZendeskMutation.graphql';

const mutationName = 'ConfigureZendesk';
const mutation = graphql`
  mutation ConfigureZendeskMutation($input: ConfigureZendeskInput!) {
    configureZendesk(input: $input) {
      errors
    }
  }
`;

export default function ConfigureZendesk(
  input: ConfigureZendeskMutation['variables']['input']
): Promise<ConfigureZendeskMutation['response']> {
  return commitMutation({
    mutation,
    mutationName,
    variables: {
      input,
    },
  });
}
