import React from 'react';

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

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export default function ResetStylesModal({
  isOpen,
  onClose,
  onReset,
}: ResetModalProps) {
  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset styles</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to revert to default styling?
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleReset}>Yes</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
