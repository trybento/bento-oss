import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Flex,
  Text,
  UnorderedList,
  ListItem,
  Input,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from 'react-relay';
import { ConfirmDeleteModuleModalQuery } from 'relay-types/ConfirmDeleteModuleModalQuery.graphql';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import HelperText from 'system/HelperText';
import * as DeleteModuleMutation from 'mutations/DeleteModule';
import { moduleNameOrFallback } from 'bento-common/utils/naming';

const CONFIRM_DELETE_TEXT = 'DELETE';

interface Props {
  moduleEntityId: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

const QUERY = graphql`
  query ConfirmDeleteModuleModalQuery($moduleEntityId: EntityId!) {
    module: findModule(entityId: $moduleEntityId) {
      name
      isEmpty
    }
  }
`;

const LoadedContent: React.FC<{
  queryReference: PreloadedQuery<ConfirmDeleteModuleModalQuery>;
  setDeleteDisabled: (deleteDisabled: boolean) => void;
  handleDelete: () => Promise<void>;
}> = ({ queryReference, setDeleteDisabled, handleDelete }) => {
  const [confirmText, setConfirmText] = useState('');
  const data = usePreloadedQuery<ConfirmDeleteModuleModalQuery>(
    QUERY,
    queryReference
  );
  const isDeleteDisabled =
    !data.module.isEmpty && confirmText !== CONFIRM_DELETE_TEXT;

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
    <Flex flexDirection="column" gap={4}>
      <Text>
        Are you sure you want to delete "
        <i>{moduleNameOrFallback(data.module)}</i>"?
      </Text>
      {!data.module.isEmpty && (
        <>
          <UnorderedList ml="6">
            <ListItem>
              Launched guides will continue to contain this{' '}
              {MODULE_ALIAS_SINGULAR} until the guide changes are propagated
            </ListItem>
            <ListItem>
              Steps that branch to this will no longer function
            </ListItem>
          </UnorderedList>
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
        </>
      )}
    </Flex>
  );
};

const ConfirmDeleteModuleModal: React.FC<Props> = ({
  moduleEntityId,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState<boolean>(true);
  const [queryReference, loadQuery, disposeQuery] =
    useQueryLoader<ConfirmDeleteModuleModalQuery>(QUERY);

  useEffect(() => {
    if (isOpen) {
      loadQuery({ moduleEntityId });
    } else {
      disposeQuery();
    }
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await DeleteModuleMutation.commit({
        moduleEntityId,
      });

      onDeleted();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {MODULE_ALIAS_SINGULAR}</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          {!queryReference && <BentoLoadingSpinner height="100px" />}
          {queryReference && (
            <LoadedContent
              queryReference={queryReference}
              setDeleteDisabled={setDeleteDisabled}
              handleDelete={handleDelete}
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

export default ConfirmDeleteModuleModal;
