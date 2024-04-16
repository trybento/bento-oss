import React, { useCallback } from 'react';
import { WysiwygEditorAction } from 'components/WysiwygEditor/utils';
import { useTemplate } from 'providers/TemplateProvider';
import EditElementLocationModal from 'components/EditElementLocationModal';
import { WysiwygEditorMode } from 'bento-common/types';

type ElementData = {
  wildcardUrl: string;
  elementSelector: string;
  url: string;
};

type Props = {
  data: ElementData;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Currently only supports
 * template inlines.
 */
const InlineEditorModal: React.FC<Props> = ({ data, isOpen, onClose }) => {
  const {
    handleEditOrCreateInlineEmbed,
    handleInlineEmbedUrlChange,
    handleDeleteInlineEmbed,
  } = useTemplate();

  const handleEditInline = useCallback(() => {
    handleEditOrCreateInlineEmbed(
      WysiwygEditorAction.edit,
      WysiwygEditorMode.customize
    );
    onClose();
  }, [onClose, handleEditOrCreateInlineEmbed]);

  const handleEditLocation = useCallback(
    (newWildcardUrl: string, newUrl: string, newElementSelector?: string) => {
      handleInlineEmbedUrlChange(newWildcardUrl, newUrl, newElementSelector);
      onClose();
    },
    [onClose, handleInlineEmbedUrlChange]
  );

  const handleDelete = useCallback(() => {
    handleDeleteInlineEmbed();
    onClose();
  }, [handleDeleteInlineEmbed, onClose]);

  if (!data) return null;

  return (
    <EditElementLocationModal
      title="Edit inline embed targeting"
      isOpen={isOpen}
      submitLabel="Done"
      data={{
        wildcardUrl: data.wildcardUrl,
        url: data.url,
        elementSelector: data.elementSelector,
      }}
      onClose={onClose}
      onDelete={handleDelete}
      onWysiwyg={handleEditInline}
      onSubmit={handleEditLocation}
    />
  );
};

export default InlineEditorModal;
