import React, { useState } from 'react';
import { Button, Flex, Box } from '@chakra-ui/react';

import { WebhookOptions, EventHookState } from './types';
import * as SetWebhookMutation from 'mutations/SetWebhook';
import WebhookModal from './WebhookModal';
import { IntegrationsFormValues } from '.';
import UpgradePlanButton from './UpgradePlanButton';

type Props = {
  webhooks: IntegrationsFormValues['orgSettings']['webhooks'];
  onChange: (toastMessage: string, toastStatus: string) => void;
  disabled?: boolean;
};

export default function WebhookIntegrationBody({
  onChange,
  webhooks,
  disabled,
}: Props) {
  const hasHooks = webhooks?.some((wh) => wh.state === EventHookState.Active);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setModalOpen(true);
    e.preventDefault();
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const cancelAllWebhooks = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const allHook = webhooks?.[0];

    if (!allHook) return;

    const { secretKey, webhookUrl, eventType } = allHook;
    try {
      await SetWebhookMutation.commit({
        eventType,
        secretKey,
        webhookUrl,
        state: 'inactive',
      });
      onChange('Webhook integration removed!', 'success');
    } catch {
      onChange('An error has occurred. Please try again later', 'error');
    }
  };

  const handleSetWebhook = async (opts: WebhookOptions) => {
    try {
      await SetWebhookMutation.commit(opts);
      onChange('Webhook integration saved!', 'success');
      closeModal();
    } catch {
      onChange('An error has occurred. Please try again later', 'error');
    }
  };

  return (
    <Box>
      {hasHooks ? (
        <Box>
          <Flex
            justifyContent="space-between"
            width="100%"
            p="0.5em"
            position="absolute"
            bottom="0"
          >
            <Button variant="ghost" onClick={cancelAllWebhooks}>
              Disconnect
            </Button>
            <Button variant="ghost" onClick={openModal}>
              Edit
            </Button>
          </Flex>
        </Box>
      ) : disabled ? (
        <UpgradePlanButton />
      ) : (
        <Button
          variant="secondary"
          position="absolute"
          bottom="1.5em"
          left="50%"
          transform="translateX(-50%)"
          onClick={openModal}
        >
          Configure
        </Button>
      )}
      <WebhookModal
        isOpen={isModalOpen}
        onCancel={closeModal}
        webhooks={webhooks}
        handleSetWebhook={handleSetWebhook}
      />
    </Box>
  );
}
