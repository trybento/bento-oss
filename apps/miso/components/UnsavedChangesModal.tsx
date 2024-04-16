import React, { useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onDiscard: () => void;
}

export default function UnsavedChangesModal({
  isOpen,
  onClose,
  onContinue,
  onDiscard,
}: UnsavedChangesModalProps) {
  const handleContinue = useCallback(() => {
    onContinue();
    onClose();
  }, [onContinue, onClose]);

  const handleDiscard = useCallback(() => {
    onDiscard();
    onClose();
  }, [onDiscard, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Unsaved changes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Your changes haven't been saved. Do you want to save them?
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={handleDiscard}>
              No, discard changes
            </Button>
            <Button onClick={handleContinue}>Yes, save changes</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
