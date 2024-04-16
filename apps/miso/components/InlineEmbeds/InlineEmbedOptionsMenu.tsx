import React, { useCallback, useState } from 'react';
import { MenuList, MenuItem, Box } from '@chakra-ui/react';
import pick from 'lodash/pick';
import { InlineEmbed } from 'bento-common/types/globalShoyuState';
import Text from 'system/Text';
import ConfirmDeleteModal, {
  ConfirmModalVariations,
} from 'components/ConfirmDeleteModal';
import useToast from 'hooks/useToast';
import EditInlineEmbedMutation, {
  COMMON_INLINE_EMBED_EDIT_ARGS,
} from 'mutations/EditInlineEmbed';
import MoreVertMenu from 'bento-common/components/MoreVertMenu';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { useTemplate } from 'providers/TemplateProvider';
import EditElementLocationModal from 'components/EditElementLocationModal';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import ExtensionRequiredTooltip from 'components/WysiwygEditor/ExtensionRequiredTooltip';
import DeleteInlineEmbedMutation from 'mutations/DeleteInlineEmbed';

interface Props {
  inlineEmbed: InlineEmbed;
  /** Otherwise, template context seems to assume we're editing template's mounting */
  editingGlobal?: boolean;
  onRemove?: () => void;
  openInlineEmbedEditor: () => void;
}

function InlineEmbedOptionsMenuButton({
  inlineEmbed,
  editingGlobal,
  onRemove,
  openInlineEmbedEditor,
}: Props) {
  const { entityId } = inlineEmbed || {};
  const {
    isTemplateContext,
    handleDeleteInlineEmbed,
    handleInlineEmbedUrlChange,
  } = useTemplate();

  const toast = useToast();
  const extension = useChromeExtensionInstalled();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const openDeleteModal = useCallback(() => setIsDeleteModalOpen(true), []);
  const closeDeleteModal = useCallback(() => setIsDeleteModalOpen(false), []);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const openConfigModal = useCallback(() => setIsConfigModalOpen(true), []);
  const closeConfigModal = useCallback(() => setIsConfigModalOpen(false), []);

  const editingTemplateEmbed = isTemplateContext && !editingGlobal;

  const handleUrlChange = useCallback(
    async (
      newWildcardUrl: string,
      newUrl: string,
      newElementSelector?: string
    ) => {
      try {
        if (editingTemplateEmbed) {
          handleInlineEmbedUrlChange(
            newWildcardUrl,
            newUrl,
            newElementSelector
          );
        } else {
          await EditInlineEmbedMutation(
            pick(
              {
                ...inlineEmbed,
                wildcardUrl: newWildcardUrl,
                url: newUrl,
                elementSelector: newElementSelector,
              },
              COMMON_INLINE_EMBED_EDIT_ARGS
            ) as InlineEmbed
          );
          toast({ status: 'success', title: 'Inline Embed URL updated!' });
        }
        closeConfigModal();
      } catch (err) {
        console.error(err);
        toast({
          status: 'error',
          title: 'An error occurred. Please try again later.',
        });
      }
    },
    [editingTemplateEmbed, inlineEmbed, handleInlineEmbedUrlChange]
  );

  const handleDelete = useCallback(
    () =>
      onRemove
        ? onRemove()
        : editingTemplateEmbed
        ? handleDeleteInlineEmbed()
        : DeleteInlineEmbedMutation({ entityId }),
    [editingTemplateEmbed, handleDeleteInlineEmbed, onRemove]
  );

  if (!inlineEmbed) return null;

  return (
    <>
      {/* Hack: This is needed to prevent buttons from triggering submit
      on underlying formik/forms. */}
      <Box onClick={(e) => void e.preventDefault()}>
        <MoreVertMenu offset={[0, 0]}>
          <MenuList fontSize="sm" p="0" zIndex={3}>
            <MenuItem
              onClick={openInlineEmbedEditor}
              isDisabled={!extension.installed}
            >
              <ExtensionRequiredTooltip isDisabled={extension.installed}>
                <Text>Edit placement</Text>
              </ExtensionRequiredTooltip>
            </MenuItem>
            <MenuItem onClick={openConfigModal}>
              <Text>Change URL</Text>
            </MenuItem>
            <MenuItem onClick={openDeleteModal} borderTop="1px solid #d9d9d9">
              <Text color="bento.errorText">Remove</Text>
            </MenuItem>
          </MenuList>
        </MoreVertMenu>
      </Box>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
        entityName={
          !editingGlobal ? (
            <>
              the inline guide from
              <br />
              <Box
                bg="gray.50"
                borderRadius="sm"
                p="2"
                fontSize="sm"
                mt="2"
                isTruncated
              >
                {wildcardUrlToDisplayUrl(inlineEmbed.wildcardUrl)}
              </Box>
            </>
          ) : null
        }
        quoteEntityName={false}
        variation={ConfirmModalVariations.remove}
        header={
          editingGlobal
            ? `You're about to remove all inline onboarding guides`
            : 'Remove inline guide'
        }
      >
        {editingGlobal && (
          <>
            <Box>Your onboarding guides are currently set to show on:</Box>
            <Box
              bg="gray.50"
              borderRadius="sm"
              p="2"
              fontSize="sm"
              my="2"
              isTruncated
            >
              {wildcardUrlToDisplayUrl(inlineEmbed.wildcardUrl)}
            </Box>
            <Box>
              This will remove the location and onboarding guides will only show
              in the sidebar.
            </Box>
          </>
        )}
      </ConfirmDeleteModal>
      <EditElementLocationModal
        title="Edit inline embed targeting"
        isOpen={isConfigModalOpen}
        data={{
          wildcardUrl: inlineEmbed.wildcardUrl,
          url: inlineEmbed.url,
          elementSelector: inlineEmbed.elementSelector,
        }}
        onClose={closeConfigModal}
        onSubmit={handleUrlChange}
        submitLabel={isTemplateContext ? 'Done' : 'Save'}
      />
    </>
  );
}

export default InlineEmbedOptionsMenuButton;
