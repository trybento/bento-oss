import React, { FormEvent, useCallback, useEffect, useState } from 'react';
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
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from 'react-relay';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import HelperText from 'system/HelperText';
import * as DeleteTemplateMutation from 'mutations/DeleteTemplate';
import { ConfirmDeleteTemplateModalQuery } from 'relay-types/ConfirmDeleteTemplateModalQuery.graphql';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import useToast from 'hooks/useToast';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';

const CONFIRM_DELETE_TEXT = 'DELETE';

interface Props {
  templateEntityId: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  formEntityLabel: string;
  isSplitTest: boolean;
  onDeleteStart?: () => void;
}

const QUERY = graphql`
  query ConfirmDeleteTemplateModalQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      name
      isEmpty
    }
  }
`;

const LoadedContent: React.FC<{
  queryReference: PreloadedQuery<ConfirmDeleteTemplateModalQuery>;
  setDeleteDisabled: (deleteDisabled: boolean) => void;
  handleDelete: () => Promise<void>;
  isSplitTest: boolean;
}> = ({ queryReference, setDeleteDisabled, handleDelete, isSplitTest }) => {
  const [confirmText, setConfirmText] = useState('');
  const data = usePreloadedQuery<ConfirmDeleteTemplateModalQuery>(
    QUERY,
    queryReference
  );
  const isDeleteDisabled =
    !data.template.isEmpty && confirmText !== CONFIRM_DELETE_TEXT;

  useEffect(() => {
    setDeleteDisabled(isDeleteDisabled);
  }, [isDeleteDisabled]);

  const handleInputKeyUp = useCallback(
    (e) => {
      if (e.key === 'Enter' && !isDeleteDisabled) {
        handleDelete();
      }
    },
    [isDeleteDisabled]
  );

  return (
    <Flex flexDirection="column" gap={2}>
      <Text>
        Are you sure you want to delete "<i>{data.template.name}</i>"?
      </Text>
      {!isSplitTest && (
        <EmojiList>
          <EmojiListItem emoji="🗑️">
            This will delete any step progress analytics
          </EmojiListItem>
          <EmojiListItem emoji="🚫">
            Steps that branch to this will no longer function
          </EmojiListItem>
        </EmojiList>
      )}
      {!data.template.isEmpty && (
        <Flex flexDirection="column" gap={1}>
          <Text fontWeight="semibold" color={DEFAULT_COLORS.primaryText}>
            To confirm, please type "{CONFIRM_DELETE_TEXT}".
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
      )}
    </Flex>
  );
};

const ConfirmDeleteTemplateModal: React.FC<Props> = ({
  templateEntityId,
  isOpen,
  onClose,
  onDeleted,
  formEntityLabel,
  isSplitTest,
  onDeleteStart,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState<boolean>(true);
  const [queryReference, loadQuery, disposeQuery] =
    useQueryLoader<ConfirmDeleteTemplateModalQuery>(QUERY);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadQuery({ templateEntityId });
    } else {
      disposeQuery();
    }
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      onDeleteStart?.();
      setIsLoading(true);

      await DeleteTemplateMutation.commit({
        templateEntityId,
      });

      toast({
        title: `${capitalizeFirstLetter(formEntityLabel)} deleted!`,
        isClosable: true,
        status: 'success',
      });

      onDeleted();
      onClose();
    } catch (error) {
      const title = Array.isArray(error) ? error[0].message : 'Unknown error';

      toast({
        title,
        isClosable: true,
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {formEntityLabel}</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          {!queryReference && <BentoLoadingSpinner height="100px" />}
          {queryReference && (
            <LoadedContent
              queryReference={queryReference}
              setDeleteDisabled={setDeleteDisabled}
              handleDelete={handleDelete}
              isSplitTest={isSplitTest}
            />
          )}
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
              isDisabled={deleteDisabled}
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

export default ConfirmDeleteTemplateModal;
