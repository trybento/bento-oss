import React, { FC, useCallback } from 'react';
import SwitchField from 'components/common/InputFields/SwitchField';
import SetZendeskOptionMutation from 'mutations/SetZendeskOption';
import useToast from 'hooks/useToast';
import { ZendeskOptions } from 'bento-common/types/integrations';

interface Props {
  entityId: string | undefined;
  defaultValue: boolean;
  label: string;
  onChange: () => void;
  option?: keyof ZendeskOptions;
}

const OPTION_LABEL_MAP: Record<keyof ZendeskOptions, string> = {
  liveChat: 'Live chat',
  kbSearch: 'Help center search',
  issueSubmission: 'Issue submission',
  subdomain: 'Subdomain',
  username: 'Username',
};

const ZdSettingToggle: FC<Props> = ({
  entityId,
  defaultValue,
  label,
  onChange,
  option = 'liveChat',
}) => {
  const toast = useToast();

  const handleZdSettingChange = useCallback(
    async (newValue: boolean) => {
      try {
        await SetZendeskOptionMutation({ entityId, enabled: newValue, option });
        toast({
          title: `${OPTION_LABEL_MAP[option]} ${
            newValue ? 'enabled' : 'disabled'
          }!`,
          status: 'success',
        });
        onChange();
      } catch (e) {
        console.error(e);
        toast({
          title: 'There was a problem saving. Please try again.',
          isClosable: true,
          status: 'error',
        });
      }
    },
    [entityId, onChange]
  );

  return (
    <SwitchField
      onChange={handleZdSettingChange}
      defaultValue={defaultValue}
      checkedOption={{
        value: true,
        label,
      }}
      uncheckedOption={{
        value: false,
      }}
      fontWeight="bold"
    />
  );
};

export default ZdSettingToggle;
