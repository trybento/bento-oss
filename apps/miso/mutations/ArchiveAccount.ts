import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { ArchiveAccountMutation } from 'relay-types/ArchiveAccountMutation.graphql';

const mutationName = 'archiveAccount';
const mutation = graphql`
  mutation ArchiveAccountMutation($input: ArchiveAccountInput!) {
    archiveAccount(input: $input) {
      account {
        entityId
        name
      }
      errors
    }
  }
`;

type Args = ArchiveAccountMutation['variables']['input'];

export function commit({
  accountEntityId,
}: Args): Promise<ArchiveAccountMutation['response']> {
  const variables: ArchiveAccountMutation['variables'] = {
    input: {
      accountEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
