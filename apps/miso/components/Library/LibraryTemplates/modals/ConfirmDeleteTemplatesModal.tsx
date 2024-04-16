import React, { FormEvent, useCallback, useState } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Flex,
  Text,
  Input,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import HelperText from 'system/HelperText';
import * as DeleteTemplatesMutation from 'mutations/DeleteTemplates';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import { pluralize } from 'bento-common/utils/pluralize';

const CONFIRM_DELETE_TEXT = 'DELETE';

interface Props {
  templateEntityIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

const ConfirmDeleteTemplatesModal: React.FC<Props> = ({
  templateEntityIds,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const isDeleteDisabled = confirmText !== CONFIRM_DELETE_TEXT;

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await DeleteTemplatesMutation.commit({
        templateEntityIds,
      });

      onDeleted();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyUp = useCallback(
    (e) => {
      if (e.key === 'Enter' && !isDeleteDisabled) {
        handleDelete();
      }
    },
    [isDeleteDisabled]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete guides</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          <Flex flexDirection="column" gap={2}>
            <Text>
              You are about to delete{' '}
              <strong>{templateEntityIds.length}</strong>{' '}
              {pluralize(templateEntityIds.length, 'guide')}.
            </Text>
            <EmojiList>
              <EmojiListItem emoji="🗑️">
                This will delete any step progress analytics
              </EmojiListItem>
              <EmojiListItem emoji="🚫">
                Steps that branch to this will no longer function
              </EmojiListItem>
            </EmojiList>
            <Flex flexDirection="column" gap={1}>
              <Text fontWeight="semibold" color={DEFAULT_COLORS.primaryText}>
                To confirm, please type "{CONFIRM_DELETE_TEXT}"
              </Text>
              <Input
                size="lg"
                value={confirmText}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  setConfirmText(e.currentTarget.value)
                }
                onKeyUp={handleInputKeyUp}
              />
              <HelperText>Press Enter to submit</HelperText>
            </Flex>
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
            <Button
              variant="red"
              isDisabled={isDeleteDisabled}
              isLoading={isLoading}
              onClick={handleDelete}
            >
              Permanently delete
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteTemplatesModal;
