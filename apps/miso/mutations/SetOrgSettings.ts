import { graphql } from 'react-relay';

import {
  SetOrgSettingsMutation,
  SetOrgSettingsInput,
} from 'relay-types/SetOrgSettingsMutation.graphql';

import commitMutation from './commitMutation';

const mutationName = 'setOrgSettings';

const mutation = graphql`
  mutation SetOrgSettingsMutation($input: SetOrgSettingsInput!) {
    setOrgSettings(input: $input) {
      orgSettings {
        defaultUserNotificationURL
        sendAccountUserNudges
        sendEmailNotifications
        fallbackCommentsEmail
      }
    }
  }
`;

export function commit(
  input: SetOrgSettingsInput
): Promise<SetOrgSettingsMutation['response']> {
  const variables: SetOrgSettingsMutation['variables'] = {
    input: { ...input },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
