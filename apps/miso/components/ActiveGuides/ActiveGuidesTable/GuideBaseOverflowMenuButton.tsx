import React, { useCallback } from 'react';
import { MenuList, MenuItem, useToast } from '@chakra-ui/react';
import Text from 'system/Text';
import ConfirmDeleteModal, {
  ConfirmModalVariations,
} from 'components/ConfirmDeleteModal';
import * as DeleteGuideBaseMutation from 'mutations/DeleteGuideBase';
import { GuideBaseOverflowMenuButton_guideBase$data } from 'relay-types/GuideBaseOverflowMenuButton_guideBase.graphql';
import { useRouter } from 'next/router';
import MoreVertMenu from 'bento-common/components/MoreVertMenu';
import { isGuideInActiveSplitTest } from 'bento-common/data/helpers';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import ConfirmResetGuideBaseModal from './ConfirmResetGuideBaseModal';
import useToggleState from 'hooks/useToggleState';

interface Props {
  guideBase: GuideBaseOverflowMenuButton_guideBase$data;
  onRefetch?: () => void;
  onDeleteStart?: () => void;
  onDeleted?: () => void;
  accountEntityId?: string;
  showViewTemplate?: boolean;
}

export default function GuideBaseOverflowMenuButton({
  guideBase,
  onDeleteStart,
  onDeleted,
  onRefetch,
  accountEntityId,
  showViewTemplate,
}: Props) {
  const toast = useToast();
  const modalStates = useToggleState(['remove', 'reset']);
  const router = useRouter();
  const isInActiveSplitTest = isGuideInActiveSplitTest(
    guideBase.isTargetedForSplitTesting as any
  );
  const templateEntityId = guideBase.createdFromTemplate?.entityId;

  const handleDeleteGuideBase = useCallback(async () => {
    onDeleteStart?.();
    await DeleteGuideBaseMutation.commit({
      guideBaseEntityId: guideBase.entityId,
      templateEntityId: templateEntityId,
    });

    toast({
      title: 'Guide removed',
      isClosable: true,
      status: 'success',
    });

    // Check if we are in the guide view.
    const shouldRedirect = window.location.href.includes('/guide-bases/');
    if (shouldRedirect) {
      router.push(
        `/customers` + (accountEntityId ? `/${accountEntityId}` : '')
      );
    } else {
      onRefetch?.();
    }
    onDeleted?.();
  }, [accountEntityId, guideBase, onDeleteStart, onDeleted, onRefetch, router]);

  const handleViewTemplate = useCallback(() => {
    window.open(`/library/templates/${templateEntityId}`, '_blank');
  }, [templateEntityId]);

  if (isInActiveSplitTest) return null;

  return (
    <>
      <MoreVertMenu offset={[0, 0]} id="guide-base-more">
        <MenuList fontSize="sm" p="0" zIndex="3">
          {showViewTemplate && (
            <MenuItem
              onClick={handleViewTemplate}
              borderBottom="1px solid #d9d9d9"
            >
              <Text fontWeight="normal">View template</Text>
            </MenuItem>
          )}
          <MenuItem onClick={modalStates.remove.on}>
            <Text color="bento.errorText">Remove guide</Text>
          </MenuItem>
          <MenuItem onClick={modalStates.reset.on}>
            <Text color="bento.errorText">Reset guide</Text>
          </MenuItem>
        </MenuList>
      </MoreVertMenu>
      <ConfirmDeleteModal
        isOpen={modalStates.remove.isOn}
        onDelete={handleDeleteGuideBase}
        onClose={modalStates.remove.off}
        entityName={guideBase.createdFromTemplate.name}
        additionalText={
          <>
            {' '}
            from <i>{guideBase.account.name}</i>
          </>
        }
        header="Remove guide"
        variation={ConfirmModalVariations.remove}
      >
        <EmojiList>
          <EmojiListItem emoji="⏳">
            It may take a few minutes for the guide to stop showing to existing
            users.
          </EmojiListItem>
          <EmojiListItem emoji="📊">
            This will also remove any related analytics.
          </EmojiListItem>
          <EmojiListItem emoji="✈️">
            This guide <strong>will automatically re-launch</strong> to accounts
            and users if the template targeting rules match. Edit the template
            targeting rules if you no longer want this guide to launch.
          </EmojiListItem>
        </EmojiList>
      </ConfirmDeleteModal>
      <ConfirmResetGuideBaseModal
        guideBaseName={guideBase.name}
        guideBaseEntityId={guideBase.entityId}
        isOpen={modalStates.reset.isOn}
        onClose={modalStates.reset.off}
      />
    </>
  );
}
