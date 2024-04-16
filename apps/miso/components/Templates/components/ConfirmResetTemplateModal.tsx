import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Flex,
  Text,
  ButtonGroup,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import Button from 'system/Button';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';

interface Props {
  templateName: string;
  isOpen?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmResetTemplateModal: React.FC<Props> = ({
  templateName,
  isOpen,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset guide</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          <Flex flexDirection="column" gap={2}>
            <Text>
              You're about to reset "<i>{templateName}</i>"
            </Text>
            <EmojiList>
              <EmojiListItem emoji="🔄">
                This will reset users’ progress and they will start from
                scratch.
              </EmojiListItem>
              <EmojiListItem emoji="📊">
                This will reset the analytics. Note that changes may take up to
                an hour to reflect.
              </EmojiListItem>
            </EmojiList>
          </Flex>
        </ModalBody>
        <ModalFooter borderTop="1px solid #d9d9d9" mt={4}>
          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="red" onClick={onConfirm}>
              Reset
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmResetTemplateModal;
