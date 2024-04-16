import { graphql } from 'react-relay';

import commitMutation from './commitMutation';
import { CreateInlineEmbedMutation as CreateInlineEmbedMutationType } from 'relay-types/CreateInlineEmbedMutation.graphql';

const mutationName = 'createInlineEmbed';
const mutation = graphql`
  mutation CreateInlineEmbedMutation(
    $input: CreateOrganizationInlineEmbedInput!
  ) {
    createInlineEmbed(input: $input) {
      inlineEmbed {
        ...InlineEmbed_inlineEmbedWithTemplate @relay(mask: false)
      }
    }
  }
`;

type Args = CreateInlineEmbedMutationType['variables']['input'];

export default function CreateInlineEmbedMutation(
  args: Args
): Promise<CreateInlineEmbedMutationType['response']> {
  return commitMutation({
    mutation,
    mutationName,
    variables: {
      input: args,
    },
  });
}
