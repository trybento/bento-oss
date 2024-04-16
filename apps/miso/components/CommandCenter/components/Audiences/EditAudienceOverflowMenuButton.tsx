import React, { useCallback, useMemo, useState } from 'react';
import {
  MenuList,
  MenuItem,
  Text,
  Input,
  Box,
  MenuButtonProps,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import MoreVertMenu from 'bento-common/components/MoreVertMenu';
import useToggleState from 'hooks/useToggleState';
import BasicConfirmationModal from 'system/BasicConfirmationModal';
import FormLabel from 'system/FormLabel';
import useToast from 'hooks/useToast';
import * as DuplicateAudienceMutation from 'mutations/DuplicateAudience';
import * as DeleteAudienceMutation from 'mutations/DeleteAudience';
import { useTargetingAudiencesContext } from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import DeleteAudienceModal from './DeleteAudienceModal';

type Props = {
  audienceName: string;
  audienceEntityId: string;
  refetch?: () => void;
} & Omit<MenuButtonProps, 'children'>;

export default function EditAudienceOverflowMenuButton({
  audienceEntityId,
  audienceName,
  refetch,
  ...menuProps
}: Props) {
  const [duplicateName, setDuplicateName] = useState(`${audienceName} (Copy)`);
  const modalStates = useToggleState(['duplicate', 'delete']);
  const toast = useToast();
  const router = useRouter();
  const { nameExists } = useTargetingAudiencesContext();

  const handleDelete = useCallback(async () => {
    await DeleteAudienceMutation.commit({
      entityId: audienceEntityId,
    });

    toast({
      title: 'Audience deleted!',
      status: 'success',
      isClosable: true,
    });

    if (!refetch) router.push('/command-center?tab=audiences');
    else refetch();
  }, [audienceEntityId, refetch]);

  const handleDuplicate = useCallback(async () => {
    try {
      const duplicated = await DuplicateAudienceMutation.commit({
        newName: duplicateName,
        entityId: audienceEntityId,
      });

      if (duplicated.duplicateAudience.audience.entityId)
        window.location.href = `/command-center/audiences/${duplicated.duplicateAudience.audience.entityId}`;

      toast({
        status: 'success',
        title: 'Audience duplicated!',
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: 'Something went wrong!',
        status: 'error',
        isClosable: true,
      });
    }
  }, [duplicateName, audienceEntityId]);

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setDuplicateName(event.target.value),
    []
  );

  const errorText = useMemo(() => {
    if (nameExists(duplicateName))
      return 'You already have a saved audience with this name';

    return null;
  }, [nameExists, duplicateName]);

  return (
    <MoreVertMenu offset={[0, 0]} id="audiences-more" {...menuProps}>
      <MenuList fontSize="sm" p="0">
        <MenuItem onClick={modalStates.duplicate.on}>
          <Text fontWeight="normal">Duplicate</Text>
        </MenuItem>
        <MenuItem onClick={modalStates.delete.on} borderTop="1px solid #d9d9d9">
          <Text color="bento.errorText">Delete permanently</Text>
        </MenuItem>
      </MenuList>

      <BasicConfirmationModal
        title="Duplicate audience"
        isOpen={modalStates.duplicate.isOn}
        onCancel={modalStates.duplicate.off}
        handleConfirm={handleDuplicate}
        disableConfirm={!!errorText}
      >
        <Box pb="4">
          <FormLabel label="Audience name" />
          <Input value={duplicateName} onChange={handleNameChange} />
          {errorText && (
            <Text
              pos="absolute"
              fontSize="xs"
              color="error.bright"
              fontWeight="normal"
            >
              {errorText}
            </Text>
          )}
        </Box>
      </BasicConfirmationModal>

      <DeleteAudienceModal
        isOpen={modalStates.delete.isOn}
        onDelete={handleDelete}
        onClose={modalStates.delete.off}
        audienceName={audienceName}
      />
    </MoreVertMenu>
  );
}
