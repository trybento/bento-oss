import React, { useCallback, useMemo, useRef } from 'react';
import { Link } from '@chakra-ui/react';
import ElementDetails, {
  updateNodeField,
  useElementDetails,
} from '../../components/ElementDetails';
import LinkModal from '../../LinkModal';
import { useSlate } from 'slate-react';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { FloatingControlAdditionalAction } from '../../../FloatingControls';
import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';

enum ModalStates {
  edit = 'edit',
}

export default function LinkElement({
  attributes,
  element,
  children,
  dynamicAttributes,
}): JSX.Element {
  const editor = useSlate();
  const ref = useRef<HTMLDivElement>(null);
  const { isReadonly, zIndex: rteZIndex } = useRichTextEditorProvider();

  const {
    detailsPos,
    isHovered,
    mouseHandlers,
    handleEditFinish,
    modalHandlers,
    modalStates,
  } = useElementDetails({
    modalStatesEnum: ModalStates,
    element: ref.current,
    positionOffsetPx: { y: -50, x: 0 },
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      element.url && window.open(element.url, '_blank').focus();
    },
    [element.url]
  );

  const handleEditLink = useCallback(
    (newUrl: string) => {
      updateNodeField(editor, element, 'url', newUrl);
      handleEditFinish();
    },
    [editor, element]
  );

  const additionalActions: FloatingControlAdditionalAction[] = useMemo(
    () => [
      {
        icon: EditOutlined,
        tooltipLabel: 'Edit link',
        action: modalHandlers.edit.open,
      },
    ],
    [modalHandlers]
  );

  return (
    <Link
      {...attributes}
      color="b-primary.600"
      ref={ref}
      // href not working here
      onClick={handleClick}
      onMouseEnter={mouseHandlers.enter}
      onMouseLeave={mouseHandlers.leave}
      position="relative"
    >
      {isHovered && !isReadonly && (
        <>
          <ElementDetails
            element={element}
            elRef={ref.current}
            zIndex={rteZIndex}
            top={detailsPos.top}
            left={detailsPos.left}
            textToDisplay={element.url}
            additionalActions={additionalActions}
          />
          <LinkModal
            attributes={dynamicAttributes}
            isOpen={modalStates.edit}
            initialUrl={element.url}
            onCancel={modalHandlers.edit.close}
            onLink={handleEditLink}
          />
        </>
      )}
      {children}
    </Link>
  );
}
