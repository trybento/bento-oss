import React, { useCallback } from 'react';
import { StepPrototypeValue } from 'bento-common/types/templateData';

import { WysiwygEditorAction } from 'components/WysiwygEditor/utils';
import { useTemplate } from 'providers/TemplateProvider';
import EditElementLocationModal from 'components/EditElementLocationModal';
import { ContextualTagTypeEnumType } from 'relay-types/EditTemplateQuery.graphql';
import { WysiwygEditorMode } from 'bento-common/types';

type TaggedElementData = {
  entityId: string;
  type: ContextualTagTypeEnumType;
  wildcardUrl: string;
  elementSelector: string;
  url: string;
  stepPrototype?: { name: string };
  template?: { entityId: string };
};

type Props = {
  formKey: string;
  taggedElement: TaggedElementData;
  stepPrototype?: StepPrototypeValue;
  isOpen: boolean;
  onClose: () => void;
};

const TagEditorModal: React.FC<Props> = ({
  taggedElement,
  stepPrototype,
  formKey,
  isOpen,
  onClose,
}) => {
  const { handleEditOrCreateTag, handleDeleteTag, handleTagUrlChange } =
    useTemplate();

  const handleEditTag = useCallback(() => {
    handleEditOrCreateTag(
      stepPrototype,
      formKey,
      WysiwygEditorAction.edit,
      WysiwygEditorMode.customize
    );
    onClose();
  }, [stepPrototype, formKey, taggedElement, handleEditOrCreateTag]);

  const handleEditLocation = useCallback(
    (newWildcardUrl: string, newUrl: string, newElementSelector?: string) => {
      handleTagUrlChange(formKey, newWildcardUrl, newUrl, newElementSelector);
      onClose();
    },
    [onClose]
  );

  const deleteTag = useCallback(() => {
    handleDeleteTag(formKey);
    onClose();
  }, [handleDeleteTag, onClose]);

  if (!taggedElement) return null;

  return (
    <EditElementLocationModal
      title="Edit visual tag targeting"
      isOpen={isOpen}
      submitLabel="Done"
      data={{
        wildcardUrl: taggedElement.wildcardUrl,
        url: taggedElement.url,
        elementSelector: taggedElement.elementSelector,
      }}
      onClose={onClose}
      onDelete={deleteTag}
      onWysiwyg={handleEditTag}
      onSubmit={handleEditLocation}
    />
  );
};

export default TagEditorModal;
