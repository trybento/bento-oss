import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const ConfirmLaunchGuideBasesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm guide launch</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          <EmojiList>
            <EmojiListItem emoji="🔢">
              All guides launch based on their template priority.
            </EmojiListItem>
            <EmojiListItem emoji="✏️">
              To modify priority, head to the Targeting tab of any template.
            </EmojiListItem>
          </EmojiList>
        </ModalBody>
        <ModalFooter borderTop="1px solid #d9d9d9">
          <ButtonGroup>
            <Button variant="secondary" isDisabled={loading} onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={loading} onClick={onConfirm}>
              Launch
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmLaunchGuideBasesModal;
