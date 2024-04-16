import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  SetAutoLaunchRulesAndTargetsForTemplateInput,
  SetAutoLaunchRulesAndTargetsForTemplateMutation,
} from 'relay-types/SetAutoLaunchRulesAndTargetsForTemplateMutation.graphql';

const mutationName = 'setAutoLaunchRulesAndTargetsForTemplate';
const mutation = graphql`
  mutation SetAutoLaunchRulesAndTargetsForTemplateMutation(
    $input: SetAutoLaunchRulesAndTargetsForTemplateInput!
  ) {
    setAutoLaunchRulesAndTargetsForTemplate(input: $input) {
      template {
        ...Template_targets @relay(mask: false)
      }
    }
  }
`;

export function commit({
  templateEntityId,
  isAutoLaunchEnabled,
  targets,
  onlySetAutolaunchState,
  gptRequestId,
}: SetAutoLaunchRulesAndTargetsForTemplateInput): Promise<
  SetAutoLaunchRulesAndTargetsForTemplateMutation['response']
> {
  const variables: SetAutoLaunchRulesAndTargetsForTemplateMutation['variables'] =
    {
      input: {
        templateEntityId,
        isAutoLaunchEnabled,
        targets,
        onlySetAutolaunchState,
        gptRequestId,
      },
    };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
