import { graphql } from 'react-relay';

import {
  SetUISettingsMutation,
  SetUISettingsInput,
} from 'relay-types/SetUISettingsMutation.graphql';

import commitMutation from './commitMutation';

const mutationName = 'setUISettings';
const mutation = graphql`
  mutation SetUISettingsMutation($input: SetUISettingsInput!) {
    setUISettings(input: $input) {
      uiSettings {
        ...UISettings_all @relay(mask: false)
      }
      errors
    }
  }
`;

export function commit(
  input: SetUISettingsInput
): Promise<SetUISettingsMutation['response']> {
  const variables: SetUISettingsMutation['variables'] = {
    input: { ...input },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
