import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { DeleteGuideBaseMutation } from 'relay-types/DeleteGuideBaseMutation.graphql';

const mutationName = 'deleteGuideBase';
const mutation = graphql`
  mutation DeleteGuideBaseMutation(
    $input: DeleteGuideBaseInput!
    $templateEntityId: EntityId
  ) {
    deleteGuideBase(input: $input) {
      deletedGuideBaseId
      account {
        hasGuideBaseWithTemplate(templateEntityId: $templateEntityId)
      }
      errors
    }
  }
`;

type Args = {
  guideBaseEntityId: string;
  templateEntityId: string;
};

export function commit({
  guideBaseEntityId,
  templateEntityId,
}: Args): Promise<DeleteGuideBaseMutation['response']> {
  const variables: DeleteGuideBaseMutation['variables'] = {
    templateEntityId,
    input: {
      guideBaseEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
