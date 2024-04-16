import React, { useCallback, useState, useEffect } from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Box,
  Text,
  Switch,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import throttle from 'lodash/throttle';
import useToast from 'hooks/useToast';

import * as TestWebhookMutation from 'mutations/TestWebhook';

import { WebhookOptions, EventHookState, WebhookType } from './types';
import { IntegrationsFormValues } from '.';

const MAX_TEST_RATE = 10 * 1000;
interface WebhookModalProps {
  isOpen: boolean;
  onCancel: () => void;
  handleSetWebhook: (opts: WebhookOptions) => void;
  webhooks: IntegrationsFormValues['orgSettings']['webhooks'];
}

export default function WebhookModal({
  isOpen,
  onCancel,
  webhooks,
  handleSetWebhook,
}: WebhookModalProps): JSX.Element {
  const initialRef = React.useRef();

  // This will eeed to change someday to support other hooks
  const firstHook = webhooks?.[0];
  const toast = useToast();

  const [secretKey, setSecretKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!firstHook) return;

    setSecretKey(firstHook.secretKey);
    setWebhookUrl(firstHook.webhookUrl);
    setIsActive(firstHook.state === 'active');
  }, [firstHook]);

  const autoFocusInput = useCallback((el) => el?.focus(), []);

  const cancelAndClear = useCallback((): void => {
    onCancel();
  }, []);

  const onSetWebhook = (): void => {
    handleSetWebhook &&
      handleSetWebhook({
        secretKey,
        webhookUrl,
        state: isActive ? EventHookState.Active : EventHookState.Inactive,
        eventType: WebhookType.All,
      });
  };

  const onTestWebhook = throttle(async () => {
    try {
      await TestWebhookMutation.commit({
        webhookUrl,
        secretKey,
      });

      toast({
        title: 'Test event successful!',
        isClosable: true,
        status: 'success',
      });
    } catch (e) {
      toast({
        title: getActualErrorMessage(e) || 'Test failed!',
        isClosable: true,
        status: 'error',
      });
    }
  }, MAX_TEST_RATE);

  const handleWebhookUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWebhookUrl(e.target.value);
    },
    []
  );

  const handleSecretKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSecretKey(e.target.value);
    },
    []
  );

  const onToggleActive = () => {
    setIsActive(!isActive);
  };

  // Possibly update to use a form
  return (
    <Modal
      isOpen={isOpen}
      onClose={cancelAndClear}
      size="md"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent display="table">
        <ModalHeader>Send Bento events via webhooks</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color="gray.500" size="sm" mb="4">
            Please include a destination URL and a security token/key
          </Text>
          <Box mb="3" mx="2">
            <Text fontSize="sm" fontWeight="semibold" mb={1}>
              Destination URL
            </Text>
            <Input
              value={webhookUrl}
              onChange={handleWebhookUrlChange}
              ref={autoFocusInput}
            />
          </Box>
          <Box mb="5" mx="2">
            <Text fontSize="sm" fontWeight="semibold" mb={1}>
              Secret Key (recommended)
            </Text>
            <Input
              value={secretKey}
              onChange={handleSecretKeyChange}
              ref={autoFocusInput}
            />
          </Box>
          <Box mb="5" display="flex" justifyContent="center">
            <Button variant="ghost" onClick={onTestWebhook}>
              Send test event
            </Button>
          </Box>
        </ModalBody>
        <ModalFooter
          display="flex"
          justifyContent="space-between"
          alignContent="center"
        >
          <Box mb="3" mt="2">
            <Switch
              size="md"
              isChecked={isActive}
              onChange={onToggleActive}
              mr="3"
            />
            {isActive ? 'On' : 'Off'}
          </Box>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button isDisabled={false} onClick={onSetWebhook}>
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const getActualErrorMessage = (errors) => {
  const first = errors?.[0];

  return Array.isArray(first)
    ? first[0].message
    : typeof first === 'object'
    ? first.message
    : first;
};
