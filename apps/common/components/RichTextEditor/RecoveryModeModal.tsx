import * as React from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '@chakra-ui/react';
import ModalBody from '../ModalBody';
import { Modal } from '../Modal';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onDiscard: () => void;
}

export default function RecoveryModeModal({
  isOpen,
  onClose,
  onContinue,
  onDiscard,
}: UnsavedChangesModalProps) {
  const handleContinue = () => {
    onContinue();
    onClose();
  };

  const handleDiscard = () => {
    onDiscard();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>🙈 Sorry for the error!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Unfortunately the editor crashed. We've let the engineers know, but
          for now, do you want to restore unsaved changes?
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={handleDiscard}>
              Discard changes
            </Button>
            <Button onClick={handleContinue}>Restore latest changes</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
