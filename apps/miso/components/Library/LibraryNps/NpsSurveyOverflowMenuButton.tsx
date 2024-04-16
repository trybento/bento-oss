import React, { useCallback, useState } from 'react';
import { MenuList, MenuItem } from '@chakra-ui/react';
import Text from 'system/Text';
import MoreVertMenu from 'bento-common/components/MoreVertMenu';
import ConfirmDeleteModal from 'components/ConfirmDeleteModal';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import * as DeleteNpsSurveyMutation from 'mutations/DeleteNpsSurvey';

interface Props {
  npsSurveyEntityId: string;
  npsSurveyName: string;
  onDeleted: (name: string) => void;
}

const NpsSurveyOverflowMenuButton: React.FC<Props> = ({
  npsSurveyEntityId,
  npsSurveyName,
  onDeleted,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteNpsSurvey = useCallback(async () => {
    await DeleteNpsSurveyMutation.commit({ entityId: npsSurveyEntityId });

    onDeleted(npsSurveyName);
  }, []);

  return (
    <>
      <MoreVertMenu offset={[0, 0]}>
        <MenuList fontSize="sm" p="0" zIndex={3}>
          <MenuItem onClick={handleOpenDelete}>
            <Text color="bento.errorText">Delete permanently</Text>
          </MenuItem>
        </MenuList>
      </MoreVertMenu>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onDelete={handleDeleteNpsSurvey}
        onClose={() => setIsDeleteModalOpen(false)}
        entityName={npsSurveyName}
        confirmText="DELETE"
        header="Delete NPS survey"
      >
        <EmojiList>
          <EmojiListItem emoji="🙈">
            This survey will no longer be available to end users
          </EmojiListItem>
          <EmojiListItem emoji="🗑️">
            All analytics for this survey will be deleted
          </EmojiListItem>
        </EmojiList>
      </ConfirmDeleteModal>
    </>
  );
};

export default NpsSurveyOverflowMenuButton;
