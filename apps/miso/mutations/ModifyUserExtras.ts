import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { ModifyUserExtrasMutation } from 'relay-types/ModifyUserExtrasMutation.graphql';

const mutationName = 'modifyUserExtras';
const mutation = graphql`
  mutation ModifyUserExtrasMutation($input: ModifyUserExtrasUserInput!) {
    modifyUserExtras(input: $input) {
      errors
    }
  }
`;

type Args = ModifyUserExtrasMutation['variables']['input'];

export function commit({
  userEntityId,
  key,
}: Args): Promise<ModifyUserExtrasMutation['response']> {
  const variables: ModifyUserExtrasMutation['variables'] = {
    input: {
      userEntityId,
      key,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
