import { graphql } from 'react-relay';

import commitMutation from './commitMutation';
import { DeleteInlineEmbedMutation as DeleteInlineEmbedMutationType } from 'relay-types/DeleteInlineEmbedMutation.graphql';

const mutationName = 'deleteInlineEmbed';
const mutation = graphql`
  mutation DeleteInlineEmbedMutation(
    $input: DeleteOrganizationInlineEmbedInput!
  ) {
    deleteInlineEmbed(input: $input) {
      inlineEmbedEntityId
    }
  }
`;

type Args = DeleteInlineEmbedMutationType['variables']['input'];

export default function DeleteInlineEmbedMutation(
  args: Args
): Promise<DeleteInlineEmbedMutationType['response']> {
  const variables: DeleteInlineEmbedMutationType['variables'] = {
    input: args,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
