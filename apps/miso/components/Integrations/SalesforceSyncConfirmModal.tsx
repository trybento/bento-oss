import React, { useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';

interface SalesforceSyncConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  handleConfirmSync: () => void;
}

export default function SalesforceSyncConfirmModal({
  isOpen,
  onCancel,
  handleConfirmSync,
}: SalesforceSyncConfirmModalProps): JSX.Element {
  const onTest = useCallback((): void => {
    handleConfirmSync();
    onCancel();
  }, [onCancel, handleConfirmSync]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="md">
      <ModalOverlay />
      <ModalContent display="table">
        <ModalHeader>Test sync</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            Bento will request a full sync of your Salesforce data. You can then
            check to see if attributes were added correctly in Customer Details
          </Box>
        </ModalBody>
        <ModalFooter
          display="flex"
          justifyContent="space-between"
          alignContent="center"
        >
          <Box />
          <ButtonGroup>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button isDisabled={false} onClick={onTest}>
              Test
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function SalesforceEnableSyncConfirmModal({
  isOpen,
  onCancel,
  handleConfirmSync,
}: SalesforceSyncConfirmModalProps): JSX.Element {
  const onEnabled = useCallback((): void => {
    handleConfirmSync();
    onCancel();
  }, [onCancel, handleConfirmSync]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="md">
      <ModalOverlay />
      <ModalContent display="table">
        <ModalHeader>Enable sync</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            Every 24 hours Bento will pull all requested fields and add them to
            Bento as attributes and update values.
          </Box>
        </ModalBody>
        <ModalFooter
          display="flex"
          justifyContent="space-between"
          alignContent="center"
        >
          <Box />
          <ButtonGroup>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button isDisabled={false} onClick={onEnabled}>
              Enable
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
