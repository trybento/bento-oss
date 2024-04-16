import { graphql } from 'react-relay';

import commitMutation from './commitMutation';
import {
  EditInlineEmbedMutation as EditInlineEmbedMutationType,
  EditOrganizationInlineEmbedInput,
} from 'relay-types/EditInlineEmbedMutation.graphql';

export const COMMON_INLINE_EMBED_EDIT_ARGS: Array<
  keyof EditOrganizationInlineEmbedInput
> = [
  'entityId',
  'elementSelector',
  'url',
  'wildcardUrl',
  'position',
  'topMargin',
  'rightMargin',
  'bottomMargin',
  'padding',
  'borderRadius',
  'leftMargin',
  'alignment',
  'maxWidth',
  'state',
];

const mutationName = 'editInlineEmbed';
const mutation = graphql`
  mutation EditInlineEmbedMutation($input: EditOrganizationInlineEmbedInput!) {
    editInlineEmbed(input: $input) {
      inlineEmbed {
        ...InlineEmbed_inlineEmbedWithTemplate @relay(mask: false)
      }
    }
  }
`;

type Args = EditInlineEmbedMutationType['variables']['input'];

export default function EditInlineEmbedMutation(
  args: Args
): Promise<EditInlineEmbedMutationType['response']> {
  const variables: EditInlineEmbedMutationType['variables'] = {
    input: args,
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
