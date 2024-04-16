import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { SetWebhookMutation } from 'relay-types/SetWebhookMutation.graphql';

const mutationName = 'setWebhook';
const mutation = graphql`
  mutation SetWebhookMutation($input: SetWebhookInput!) {
    setWebhook(input: $input) {
      errors
    }
  }
`;

type Args = SetWebhookMutation['variables']['input'];

export function commit({
  secretKey,
  state,
  eventType,
  webhookUrl,
  webhookType,
}: Args): Promise<SetWebhookMutation['response']> {
  const variables: SetWebhookMutation['variables'] = {
    input: {
      secretKey,
      state,
      eventType,
      webhookUrl,
      webhookType,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
