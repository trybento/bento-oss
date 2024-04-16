import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { TestWebhookMutation } from 'relay-types/TestWebhookMutation.graphql';

const mutationName = 'testWebhook';
const mutation = graphql`
  mutation TestWebhookMutation($input: TestWebhookInput!) {
    testWebhook(input: $input) {
      message
      errors
    }
  }
`;

type Args = TestWebhookMutation['variables']['input'];

export function commit({
  secretKey,
  webhookUrl,
  eventType,
  webhookType,
}: Args): Promise<TestWebhookMutation['response']> {
  const variables: TestWebhookMutation['variables'] = {
    input: {
      secretKey,
      webhookUrl,
      eventType,
      webhookType,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
