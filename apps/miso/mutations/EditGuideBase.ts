import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { EditGuideBaseMutation } from 'relay-types/EditGuideBaseMutation.graphql';

const mutationName = 'editGuideBase';
const mutation = graphql`
  mutation EditGuideBaseMutation($input: EditGuideBaseInput!) {
    editGuideBase(input: $input) {
      guideBase {
        state
        name
        description
        guideModuleBases {
          entityId
          name
          orderIndex
          guideStepBases {
            entityId
            name
            bodySlate
            stepType
            orderIndex
            dismissLabel
            createdFromStepPrototype {
              entityId
              isAutoCompletable
            }
          }
          participants {
            fullName
            email
          }
          participantsCount
          participantsWhoViewed {
            fullName
            email
          }
          participantsWhoViewedCount
          dynamicallyAddedByStep {
            entityId
            name
          }
          createdFromModule {
            entityId
          }
        }
      }
      errors
    }
  }
`;

type Args = EditGuideBaseMutation['variables']['input'];

export function commit({
  guideBaseEntityId,
  data,
}: Args): Promise<EditGuideBaseMutation['response']> {
  const variables: EditGuideBaseMutation['variables'] = {
    input: {
      guideBaseEntityId,
      data,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
