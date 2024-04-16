import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from '@chakra-ui/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useToggleState from 'hooks/useToggleState';
import React, { useCallback, useMemo } from 'react';
import { LibraryTemplate } from './libraryTemplates.helpers';
import ConfirmRemoveTemplatesModal from './modals/ConfirmRemoveTemplatesModal';
import ConfirmDeleteTemplatesModal from './modals/ConfirmDeleteTemplatesModal';
import ConfirmResetTemplatesModal from './modals/ConfirmResetTemplatesModal';

interface Props {
  selectedTemplates: LibraryTemplate[];
  refetch: () => void;
}

const LibraryActionsMenu: React.FC<Props> = ({
  selectedTemplates,
  refetch,
}) => {
  const toast = useToast();
  const modalState = useToggleState(['delete', 'remove', 'reset']);

  const entityIds = useMemo(
    () => selectedTemplates.map(({ entityId }) => entityId),
    [selectedTemplates]
  );

  const onRemoved = useCallback(() => {
    refetch();

    toast({
      title: 'Guides removed',
      isClosable: true,
      status: 'success',
    });
  }, [refetch]);

  const onDelete = useCallback(() => {
    refetch();

    toast({
      title: 'Guides deleted',
      isClosable: true,
      status: 'success',
    });
  }, [refetch]);

  const onReset = useCallback(() => {
    refetch();
  }, [refetch]);

  if (selectedTemplates.length === 0) {
    return null;
  }

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          variant="secondary"
          rightIcon={<ArrowDropDownIcon />}
        >
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem onClick={modalState.remove.on} color="bento.errorText">
            Remove from all users
          </MenuItem>
          <MenuItem onClick={modalState.reset.on} color="bento.errorText">
            Reset for all users
          </MenuItem>
          <MenuItem onClick={modalState.delete.on} color="bento.errorText">
            Delete permanently
          </MenuItem>
        </MenuList>
      </Menu>
      <ConfirmRemoveTemplatesModal
        templateEntityIds={entityIds}
        isOpen={modalState.remove.isOn}
        onRemoved={onRemoved}
        onClose={modalState.remove.off}
      />
      <ConfirmDeleteTemplatesModal
        templateEntityIds={entityIds}
        isOpen={modalState.delete.isOn}
        onDeleted={onDelete}
        onClose={modalState.delete.off}
      />
      <ConfirmResetTemplatesModal
        templateEntityIds={entityIds}
        isOpen={modalState.reset.isOn}
        onReset={onReset}
        onClose={modalState.reset.off}
      />
    </>
  );
};

export default LibraryActionsMenu;
