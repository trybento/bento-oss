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

interface RestrictedStepGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function RestrictedStepGroupModal({
  isOpen,
  onClose,
  onContinue,
}: RestrictedStepGroupModalProps) {
  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Branching step group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          This step group is already in your guide. If you want to make it
          dynamic (as a branching option), you must first remove it from the
          guide.
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={handleContinue}>Okay</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
