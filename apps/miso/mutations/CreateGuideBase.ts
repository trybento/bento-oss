import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { CreateGuideBaseMutation } from 'relay-types/CreateGuideBaseMutation.graphql';

const mutationName = 'createGuideBase';
const mutation = graphql`
  mutation CreateGuideBaseMutation(
    $input: CreateGuideBaseInput!
    $templateEntityId: EntityId!
  ) {
    createGuideBase(input: $input) {
      guideBase {
        account {
          hasGuideBaseWithTemplate(templateEntityId: $templateEntityId)
        }
        id
        entityId
        name
        type
        isSideQuest
        formFactor
        guideModuleBases {
          id
          name
          guideStepBases {
            name
            body
            stepType
            dismissLabel
          }
        }
      }
    }
  }
`;

type Args = CreateGuideBaseMutation['variables']['input'];

export function commit({
  accountEntityId,
  templateEntityId,
  targets,
}: Args): Promise<CreateGuideBaseMutation['response']> {
  const variables: CreateGuideBaseMutation['variables'] = {
    templateEntityId,
    input: {
      accountEntityId,
      templateEntityId,
      targets,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
