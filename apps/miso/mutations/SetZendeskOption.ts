import {
  SetZendeskOptionInput,
  SetZendeskOptionMutation,
} from './../relay-types/SetZendeskOptionMutation.graphql';
import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

const mutation = graphql`
  mutation SetZendeskOptionMutation($input: SetZendeskOptionInput!) {
    setZendeskOption(input: $input) {
      integration {
        entityId
      }
    }
  }
`;

type Args = SetZendeskOptionMutation['variables']['input'];

const SetZendeskOptionMutation = (args: Args): Promise<SetZendeskOptionInput> =>
  commitMutation({
    mutation,
    mutationName: 'setZendeskOption',
    variables: {
      input: args,
    },
  });
export default SetZendeskOptionMutation;
