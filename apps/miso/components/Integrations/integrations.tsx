import React from 'react';
import { copyToClipboard } from 'utils/helpers';

import { IntegrationOption } from './types';
import useToast from 'hooks/useToast';
import * as DeleteBentoApiKeyMutation from '../../mutations/DeleteBentoApiKey';
import * as GenerateBentoApiKeyMutation from '../../mutations/GenerateBentoApiKey';
import CopyButton from './CopyButton';
import WebhookIntegrationBody from './WebhookIntegrationBody';
import { IntegrationsFormValues } from '.';
import { IntegrationType } from 'bento-common/types';
import {
  BentoApiKeyType,
  IntegrationState,
} from 'bento-common/types/integrations';

type IntegrationArgs = {
  values: IntegrationsFormValues['orgSettings'];
  /** For updating the render with changed server data */
  refetch: () => void;
  toast: ReturnType<typeof useToast>;

  getToken?: () => string;
};

export const getWebhookIntegration = (
  { values, refetch, toast }: IntegrationArgs,
  disabled?: boolean
): IntegrationOption => {
  const handleWebhookIntegration = () => {};

  const onChange = (title: string, status: 'success' | 'error' | 'info') => {
    refetch();
    toast.closeAll();
    toast({
      title,
      status,
      isClosable: true,
    });
  };

  const someActive = values?.webhooks.some((wh) => wh.state === 'active');

  return {
    name: 'Webhooks',
    onClick: handleWebhookIntegration,
    currentIntegration: {
      value: someActive ? 'active' : null,
      check: () => someActive,
    },
    description: 'Send Bento guide progress events to an external service',
    logoUrl: '/webhooks.png',
    CustomBody: (
      <WebhookIntegrationBody
        disabled={disabled}
        webhooks={values?.webhooks}
        onChange={onChange}
      />
    ),
  };
};

export const getZendeskIntegration = (
  { values }: IntegrationArgs,
  disabled?: boolean
): IntegrationOption => {
  const zendeskKey = values?.integrationApiKeys?.find(
    (i) => i.type === IntegrationType.zendesk
  )?.state;

  const redirectToZendeskConfig = () =>
    (window.location.href = '/data-and-integrations/integrations/zendesk');

  return {
    name: 'Zendesk',
    onClick: redirectToZendeskConfig,
    currentIntegration: {
      value: zendeskKey ? 'active' : null,
      check: () => zendeskKey === IntegrationState.Active,
    },
    description:
      'Enable users to file a ticket, search the help center, or toggle on support chat',
    logoUrl: '/zendesk.png',
    disabled,
    editButtonLabel: 'Modify integration',
  };
};

export const getBentoApiIntegration = ({
  values,
  refetch,
  toast,
}: IntegrationArgs): IntegrationOption => {
  const handleApiIntegration = async () => {
    // Check if it already exists
    const alreadyActive = values?.bentoApiKey?.key;
    await GenerateBentoApiKeyMutation.commit({
      recreate: !!alreadyActive,
      keyType: BentoApiKeyType.api,
    });
    refetch();
    toast({
      title: alreadyActive ? 'API key regenerated!' : 'API key requested!',
      isClosable: true,
      status: 'success',
    });
  };

  const cancelApiIntegration = async () => {
    await DeleteBentoApiKeyMutation.commit({
      keyType: BentoApiKeyType.api,
    });
    refetch();
    toast({
      title: 'API key removed!',
      isClosable: true,
      status: 'success',
    });
  };

  const copyApiKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    copyToClipboard(values?.bentoApiKey.key);
    toast({
      title: 'Copied!',
      isClosable: true,
      status: 'success',
    });
    e.preventDefault();
  };

  const apiButton = <CopyButton variant="secondary" onClick={copyApiKey} />;

  return {
    name: 'API',
    onClick: handleApiIntegration,
    onCancel: cancelApiIntegration,
    currentIntegration: {
      value: values?.bentoApiKey?.key,
      check: () => !!values?.bentoApiKey?.integratedAt,
    },
    description:
      "Send data attributes to Bento's REST API for guide targeting and auto-completion",
    logoUrl: '/bentologo-new.png',
    logoStyling: {
      maxW: '300px',
      maxH: '45px',
    },
    startButtonLabel: 'Get API Token',
    cancelButtonLabel: 'Revoke',
    editButtonLabel: 'Regenerate',
    actionButton: apiButton,
  };
};
