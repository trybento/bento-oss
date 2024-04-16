import React, { useState } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Flex,
  Text,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import * as RemoveTemplatesMutation from '../../../../mutations/RemoveTemplates';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import { pluralize } from 'bento-common/utils/pluralize';

interface Props {
  templateEntityIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onRemoved: () => void;
}

const ConfirmRemoveTemplatesModal: React.FC<Props> = ({
  templateEntityIds,
  isOpen,
  onClose,
  onRemoved,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setIsLoading(true);

      await RemoveTemplatesMutation.commit({
        templateEntityIds,
      });

      onRemoved();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove guides</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          <Flex flexDirection="column" gap={2}>
            <Text>
              You are about to remove{' '}
              <strong>{templateEntityIds.length}</strong>{' '}
              {pluralize(templateEntityIds.length, 'guide')}.
            </Text>
            <EmojiList>
              <EmojiListItem emoji="🙈">
                This guide will be removed from all end users
              </EmojiListItem>
              <EmojiListItem emoji="👯">
                You cannot undo this action, but you can always duplicate and
                relaunch
              </EmojiListItem>
              <EmojiListItem emoji="⏳">
                This can take a few minutes to complete
              </EmojiListItem>
            </EmojiList>
          </Flex>
        </ModalBody>
        <ModalFooter borderTop="1px solid #d9d9d9" mt={4}>
          <ButtonGroup>
            <Button
              variant="secondary"
              isDisabled={isLoading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button variant="red" isLoading={isLoading} onClick={handleRemove}>
              Remove
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmRemoveTemplatesModal;
