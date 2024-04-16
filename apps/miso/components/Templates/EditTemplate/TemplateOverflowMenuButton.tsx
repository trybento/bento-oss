import React, { useCallback, useEffect, useMemo } from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { MenuList, MenuItem } from '@chakra-ui/react';
import { isSplitTestGuide } from 'bento-common/data/helpers';

import useToast from 'hooks/useToast';
import Text from 'system/Text';
import ConfirmDeleteModal, {
  ConfirmModalVariations,
} from 'components/ConfirmDeleteModal';
import * as RemoveTemplateMutation from 'mutations/RemoveTemplate';
import { TemplateOverflowMenuButton_template$data } from 'relay-types/TemplateOverflowMenuButton_template.graphql';
import LaunchModal from '../LaunchModal';
import CreateOrDuplicateTemplateModal from '../../Library/CreateOrDuplicateTemplateModal';
import MoreVertMenu from 'bento-common/components/MoreVertMenu';
import useToggleState from 'hooks/useToggleState';
import { getFormEntityLabel, getUrlQuery } from 'utils/helpers';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import ConfirmDeleteTemplateModal from '../../Library/LibraryTemplates/modals/ConfirmDeleteTemplateModal';
import * as ResetTemplate from 'mutations/ResetTemplate';
import ResetTemplateModal from 'components/Templates/components/ConfirmResetTemplateModal';
import { useTemplate } from 'providers/TemplateProvider';
import EditTemplateDetailsModal from './EditTemplateDetailsModal';
import EditTemplateNotificationsModal from './EditTemplateNotificationsModal';
import { isDesignType, isFormFactor } from 'helpers/transformedHelpers';
import { useGuideResetToast } from 'components/GuideResetToast';
import { SplitTestState } from 'bento-common/types';

interface Props {
  template: TemplateOverflowMenuButton_template$data;
  onRefetch?: () => void;
  onDeleteStart?: () => void;
  onDeleted?: () => void;
  onDuplicateTemplate?: (newEntityId: string) => void;
  /** Seems to just hard disable the ability to launch from the menu. */
  disableLaunch?: boolean;
  /** If under TemplateProvider we can allow modifying details. Does not persist via mutation. */
  showDetails?: boolean;
}

export default function TemplateOverflowMenuButton({
  template,
  onRefetch,
  onDeleteStart,
  onDeleted,
  onDuplicateTemplate,
  disableLaunch,
  showDetails,
}: Props) {
  const { trigger } = useGuideResetToast();
  const toast = useToast();

  const modalState = useToggleState([
    'autoLaunch',
    'delete',
    'duplicate',
    'remove',
    'reset',
    'details',
    'notifications',
  ]);

  useEffect(() => {
    const openModal = getUrlQuery('open');

    if (openModal === 'details') modalState.details.on();

    if (openModal === 'notifications') modalState.notifications.on();
  }, []);

  const isSplitTest = isSplitTestGuide(template?.type as any);
  const formEntityLabel = getFormEntityLabel({ isSplitTest });

  const isArchived = !!template.archivedAt;

  const { handleLaunchOrPause } = useTemplate();

  const handleLaunch = useCallback(
    async (remove: boolean) => {
      await handleLaunchOrPause(remove);

      modalState.autoLaunch.off();
      dispatchRefetch();
    },
    [modalState]
  );

  const dispatchRefetch = useCallback(() => void onRefetch?.(), [onRefetch]);

  const handleRemoveTemplate = useCallback(async () => {
    try {
      await RemoveTemplateMutation.commit({
        templateEntityId: template.entityId,
      });

      dispatchRefetch();

      toast({
        title: 'Guide removed',
        isClosable: true,
        status: 'success',
      });
    } catch (error) {
      const title = Array.isArray(error) ? error[0].message : 'Unknown error';

      toast({
        title,
        isClosable: true,
        status: 'error',
      });
    }
  }, [template.entityId, dispatchRefetch]);

  const handleDuplicateTemplate = useCallback(
    (newEntityId: string) => onDuplicateTemplate(newEntityId),
    [template.entityId]
  );

  const handleResetTemplate = useCallback(async () => {
    modalState.reset.off();

    try {
      await ResetTemplate.commit({
        templateEntityId: template.entityId,
      });

      trigger('template', [template.entityId]);
      dispatchRefetch();
    } catch (error) {
      const message =
        (Array.isArray(error) ? error[0].message : undefined) ||
        'Something went wrong';

      toast({
        title: message,
        isClosable: true,
        status: 'error',
      });
    }
  }, [template.entityId]);

  const isAnnouncement = isDesignType.announcement(template.designType);
  const isTooltip = isFormFactor.tooltip(template.formFactor);
  const isFlow = isFormFactor.flow(template.formFactor);

  const guideHasConfigs = !(
    isAnnouncement ||
    isTooltip ||
    isFlow ||
    isSplitTest
  );

  const show = useMemo(
    () => ({
      remove:
        !template.isTemplate &&
        !isArchived &&
        !isSplitTest &&
        template.isTargetedForSplitTesting === SplitTestState.none,
      reset: !template.isTemplate && !isArchived && !isSplitTest,
      delete:
        isSplitTest ||
        template.isTargetedForSplitTesting === SplitTestState.none,
      notifications: showDetails && guideHasConfigs,
      detailedSettings: showDetails,
    }),
    [
      isArchived,
      template.isTemplate,
      template.isTargetedForSplitTesting,
      isSplitTest,
      showDetails,
      guideHasConfigs,
    ]
  );

  return (
    <>
      <MoreVertMenu offset={[0, 0]} id="template-more">
        <MenuList fontSize="sm" p="0" zIndex={3}>
          {show.remove && !disableLaunch && (
            <MenuItem onClick={modalState.autoLaunch.on}>
              <Text fontWeight="normal">
                {template.isAutoLaunchEnabled ? 'Pause' : 'Launch'}
              </Text>
            </MenuItem>
          )}
          {show.detailedSettings && (
            <MenuItem onClick={modalState.details.on}>
              <Text fontWeight="normal">Details</Text>
            </MenuItem>
          )}
          {show.notifications && (
            <MenuItem onClick={modalState.notifications.on}>
              <Text fontWeight="normal">Notifications</Text>
            </MenuItem>
          )}
          {!!onDuplicateTemplate && (
            <MenuItem onClick={modalState.duplicate.on}>
              <Text fontWeight="normal">Duplicate</Text>
            </MenuItem>
          )}
          {show.remove && (
            <MenuItem
              onClick={modalState.remove.on}
              borderTop="1px solid #d9d9d9"
            >
              <Text color="bento.errorText" id="template-archive">
                Remove from all users
              </Text>
            </MenuItem>
          )}
          {show.reset && (
            <MenuItem onClick={modalState.reset.on}>
              <Text color="bento.errorText" id="template-reset">
                Reset for all users
              </Text>
            </MenuItem>
          )}
          {show.delete && (
            <MenuItem
              onClick={modalState.delete.on}
              {...(isArchived ? { borderTop: '1px solid #d9d9d9' } : {})}
            >
              <Text color="bento.errorText">Delete permanently</Text>
            </MenuItem>
          )}
        </MenuList>
      </MoreVertMenu>
      <LaunchModal
        template={template}
        isOpen={modalState.autoLaunch.isOn}
        onConfirm={handleLaunch}
        onClose={modalState.autoLaunch.off}
      />
      {show.notifications && (
        <EditTemplateNotificationsModal
          isOpen={modalState.notifications.isOn}
          onClose={modalState.notifications.off}
        />
      )}
      {show.detailedSettings && (
        <EditTemplateDetailsModal
          isOpen={modalState.details.isOn}
          onClose={modalState.details.off}
        />
      )}
      {!!onDuplicateTemplate && (
        <CreateOrDuplicateTemplateModal
          template={template as any}
          isOpen={modalState.duplicate.isOn}
          onClose={modalState.duplicate.off}
          onDuplicate={handleDuplicateTemplate}
        />
      )}
      {show.remove && (
        <ConfirmDeleteModal
          isOpen={modalState.remove.isOn}
          onDelete={handleRemoveTemplate}
          onClose={modalState.remove.off}
          entityName={template.name || '(Untitled guide)'}
          variation={ConfirmModalVariations.remove}
          header="Remove guide"
          modalSize="md"
        >
          <EmojiList>
            <EmojiListItem emoji="🙈">
              This guide will be removed from all end users
            </EmojiListItem>
            <EmojiListItem emoji="👯">
              You cannot undo this action, but you can always duplicate and
              relaunch
            </EmojiListItem>
            <EmojiListItem emoji="⏳">
              This can take a few minutes to complete
            </EmojiListItem>
          </EmojiList>
        </ConfirmDeleteModal>
      )}
      {show.delete && (
        <ConfirmDeleteTemplateModal
          templateEntityId={template.entityId}
          isOpen={modalState.delete.isOn}
          onDeleted={onDeleted}
          onClose={modalState.delete.off}
          formEntityLabel={formEntityLabel}
          isSplitTest={isSplitTest}
          onDeleteStart={onDeleteStart}
        />
      )}
      {show.reset && (
        <ResetTemplateModal
          templateName={template.name}
          onConfirm={handleResetTemplate}
          onClose={modalState.reset.off}
          isOpen={modalState.reset.isOn}
        />
      )}
    </>
  );
}

createFragmentContainer(TemplateOverflowMenuButton, {
  template: graphql`
    fragment TemplateOverflowMenuButton_template on Template
    @relay(mask: false) {
      name
      type
      isCyoa
      formFactor
      designType
      isSideQuest
      privateName
      entityId
      isTargetedForSplitTesting
      theme
      isAutoLaunchEnabled
      enableAutoLaunchAt
      disableAutoLaunchAt
      archivedAt
      stoppedAt
      isTemplate
      hasGuideBases
      splitTargets {
        name
        privateName
      }
      hasAutoLaunchedGuideBases
      ...Template_targets @relay(mask: false)
    }
  `,
});
