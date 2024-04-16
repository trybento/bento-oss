import React, { useCallback, useState } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Flex,
  Text,
  ButtonGroup,
  useToast,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import Button from 'system/Button';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import * as ResetGuideBaseMutation from 'mutations/ResetGuideBase';
import { useGuideResetToast } from 'components/GuideResetToast';

interface Props {
  guideBaseName: string;
  guideBaseEntityId: string;
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmResetGuideBaseModal: React.FC<Props> = ({
  guideBaseName,
  guideBaseEntityId,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { trigger } = useGuideResetToast();

  const handleResetGuideBase = useCallback(async () => {
    try {
      setLoading(true);

      await ResetGuideBaseMutation.commit({
        guideBaseEntityId,
      });

      trigger('guide_base', [guideBaseEntityId]);

      onClose();
    } catch (e) {
      toast({
        title: e.message || 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [guideBaseEntityId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset guide</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          <Flex flexDirection="column" gap={2}>
            <Text>
              You're about to reset "<i>{guideBaseName}</i>"
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
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="red"
              onClick={handleResetGuideBase}
              disabled={loading}
              isLoading={loading}
            >
              Reset
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmResetGuideBaseModal;
