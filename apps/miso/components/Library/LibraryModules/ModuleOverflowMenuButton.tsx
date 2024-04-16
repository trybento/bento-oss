import React, { useCallback, useState } from 'react';
import { MenuList, MenuItem, Portal } from '@chakra-ui/react';
import Text from 'system/Text';
import Tooltip from 'system/Tooltip';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import ModuleDetailsModal, { EditedModuleDetails } from '../ModuleDetailsModal';
import useRandomKey from 'bento-common/hooks/useRandomKey';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import { EditModuleDetailsTemplateInput } from 'relay-types/EditModuleDetailsMutation.graphql';
import MoreVertMenu from 'bento-common/components/MoreVertMenu';
import ConfirmDeleteModuleModal from './ConfirmDeleteModuleModal';

interface Props {
  module: EditedModuleDetails;
  onRefetch?: () => void;
  onDeleted?: () => void;
  onDetailsUpdated?: (moduleData: EditModuleDetailsTemplateInput) => void;
  onDuplicate?: () => void;

  moduleDetailsDisabled?: boolean;
}

function ModuleOverflowMenuButton({
  module,
  onRefetch,
  onDeleted,
  onDetailsUpdated,
  onDuplicate,
  moduleDetailsDisabled,
}: Props) {
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] =
    useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const moduleDetailsModalKey = useRandomKey([
    isEditModuleModalOpen,
    module.entityId,
  ]);

  const onModuleDetailsEdited = useCallback(
    (moduleData: EditModuleDetailsTemplateInput) => {
      onDetailsUpdated?.(moduleData);
    },
    [onDetailsUpdated]
  );

  const handleOpenDetails = useCallback(() => {
    setIsEditModuleModalOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsEditModuleModalOpen(false);
  }, []);

  const handleOpenDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const onModuleDeleted = useCallback(() => {
    onRefetch?.();
    onDeleted?.();
  }, [onRefetch, onDeleted]);

  return (
    <>
      <MoreVertMenu offset={[0, 0]} id="module-more">
        <Portal>
          <MenuList fontSize="sm" p="0" zIndex={8}>
            <MenuItem
              isDisabled={moduleDetailsDisabled}
              onClick={handleOpenDetails}
            >
              {moduleDetailsDisabled ? (
                <Tooltip
                  label="Please save your module first!"
                  placement="left"
                >
                  <Text color={DEFAULT_COLORS.disabled} fontWeight="normal">
                    {`Edit ${MODULE_ALIAS_SINGULAR} details`}
                  </Text>
                </Tooltip>
              ) : (
                <Text fontWeight="normal">{`Edit ${MODULE_ALIAS_SINGULAR} details`}</Text>
              )}
            </MenuItem>
            {!!onDuplicate && (
              <MenuItem onClick={onDuplicate}>
                <Text fontWeight="normal">{`Duplicate ${MODULE_ALIAS_SINGULAR}`}</Text>
              </MenuItem>
            )}
            <MenuItem onClick={handleOpenDelete} borderTop="1px solid #d9d9d9">
              <Text color="bento.errorText">{`Delete ${MODULE_ALIAS_SINGULAR}`}</Text>
            </MenuItem>
          </MenuList>
        </Portal>
      </MoreVertMenu>
      <ModuleDetailsModal
        key={moduleDetailsModalKey}
        module={module as any}
        isOpen={isEditModuleModalOpen}
        onClose={handleCloseDetails}
        onUpdate={onModuleDetailsEdited}
        theme={undefined}
        guideFormFactor={undefined}
      />
      <ConfirmDeleteModuleModal
        moduleEntityId={module.entityId}
        isOpen={isDeleteModalOpen}
        onDeleted={onModuleDeleted}
        onClose={handleCloseDelete}
      />
    </>
  );
}

export default ModuleOverflowMenuButton;
