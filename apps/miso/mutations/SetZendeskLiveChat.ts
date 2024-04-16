import {
  SetZendeskLiveChatInput,
  SetZendeskLiveChatMutation,
} from './../relay-types/SetZendeskLiveChatMutation.graphql';
import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

const mutation = graphql`
  mutation SetZendeskLiveChatMutation($input: SetZendeskLiveChatInput!) {
    setZendeskLiveChat(input: $input) {
      integration {
        entityId
      }
    }
  }
`;

type Args = SetZendeskLiveChatMutation['variables']['input'];

const SetZendeskLiveChatMutation = (
  args: Args
): Promise<SetZendeskLiveChatInput> =>
  commitMutation({
    mutation,
    mutationName: 'setZendeskLiveChat',
    variables: {
      input: args,
    },
  });
export default SetZendeskLiveChatMutation;
