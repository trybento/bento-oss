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
import * as ResetTemplatesMutation from 'mutations/ResetTemplates';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import { pluralize } from 'bento-common/utils/pluralize';
import { useGuideResetToast } from 'components/GuideResetToast';
import { ResetLevelEnumType } from 'relay-types/GuideResetToastQuery.graphql';

interface Props {
  templateEntityIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

const ConfirmResetTemplatesModal: React.FC<Props> = ({
  templateEntityIds,
  isOpen,
  onClose,
  onReset,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { trigger } = useGuideResetToast();

  const handleReset = async () => {
    try {
      setIsLoading(true);

      await ResetTemplatesMutation.commit({
        templateEntityIds,
      });

      trigger('template', templateEntityIds);
      onReset();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset guides</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          <Flex flexDirection="column" gap={2}>
            <Text>
              You are about to reset <strong>{templateEntityIds.length}</strong>{' '}
              {pluralize(templateEntityIds.length, 'guide')}.
            </Text>
            <EmojiList>
              <EmojiListItem emoji="🔄">
                This will reset users’ progress and they will start from
                scratch. This may take a few minutes to complete depending on
                the number of active users.
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
            <Button
              variant="secondary"
              isDisabled={isLoading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button variant="red" isLoading={isLoading} onClick={handleReset}>
              Reset
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmResetTemplatesModal;
