import React from 'react';
import { SyntheticEvent, useCallback, useMemo, useRef } from 'react';
import { useFocused, useSelected, useSlate } from 'slate-react';
import { FillEnum } from 'bento-common/types';
import { PerformantImageProps } from 'bento-common/types/slate';
import { isEdgeToEdge } from 'bento-common/utils/image';

import { FloatingControlAdditionalAction } from '../../../FloatingControls';
import { Image } from '@chakra-ui/react';
import ElementDetails, {
  updateNodeField,
  updateNodeFields,
  useElementDetails,
} from '../../components/ElementDetails';
import CenterFocusStrongOutlinedIcon from '@mui/icons-material/CenterFocusStrongOutlined';
import ImageModal from './ImageModal';
import EditOutlined from '@mui/icons-material/EditOutlined';
import LinkModal from '../../LinkModal';
import LinkIcon from '@mui/icons-material/Link';
import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';
import { Box } from '@chakra-ui/react';

const positionOffsetPx = { x: 24, y: 24 };
enum ModalStates {
  edit = 'edit',
  hyperlink = 'hyperlink',
}

export default function ImageElement({
  attributes,
  children,
  element,
  style,
  formFactor,
  accessToken,
  fileUploadConfig,
  dynamicAttributes,
}) {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const { isReadonly, zIndex: rteZIndex } = useRichTextEditorProvider();
  const isEdgeToEdgeActive = isEdgeToEdge(element.fill);
  const boxShadow = selected && focused ? `0 0 0 1px #cbd5e0` : 'none';
  const ref = useRef<HTMLDivElement>(null);

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
    positionOffsetPx,
  });

  const handleEdgeToEdge = useCallback(() => {
    updateNodeField(
      editor,
      element,
      'fill',
      isEdgeToEdgeActive ? FillEnum.unset : FillEnum.marginless
    );
  }, [editor, element, isEdgeToEdgeActive]);

  const handleEditImage = useCallback(
    (newUrl: string, lightboxDisabled: boolean) => {
      updateNodeField(editor, element, null, { url: newUrl, lightboxDisabled });
      handleEditFinish();
    },
    [editor, element]
  );

  const handleEditHyperlink = useCallback(
    (newLink: string) => {
      updateNodeField(editor, element, 'hyperlink', newLink);
      handleEditFinish();
    },
    [editor, element]
  );

  const additionalActions: FloatingControlAdditionalAction[] = useMemo(
    () => [
      {
        icon: LinkIcon,
        tooltipLabel: 'Hyperlink',
        action: modalHandlers.hyperlink.open,
        highlighted: element.hyperlink,
      },
      {
        icon: EditOutlined,
        tooltipLabel: 'Edit image',
        action: modalHandlers.edit.open,
      },
      {
        icon: CenterFocusStrongOutlinedIcon,
        tooltipLabel: 'Edge-to-edge',
        action: handleEdgeToEdge,
        highlighted: isEdgeToEdgeActive,
      },
    ],
    [handleEdgeToEdge, modalHandlers]
  );

  /**
   * Callback responsible for extracting natural dimensions and aspect ratio
   * of the image, and updating the related Slate node with the new info.
   *
   * WARNING: This might have an effect on the Slate state and by consequence
   * mark the related form as dirty.
   *
   * @todo add UI feedback for the end-user
   */
  const handleImageLoaded = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      const { naturalWidth, naturalHeight } = e.target as HTMLImageElement;
      updateNodeFields<PerformantImageProps>(editor, element, {
        naturalWidth,
        naturalHeight,
      });
    },
    [editor, element]
  );

  return (
    <Box {...attributes}>
      <Box
        textAlign="center"
        cursor="default"
        contentEditable={false}
        boxShadow={boxShadow}
        style={style}
        onMouseEnter={mouseHandlers.enter}
        onMouseLeave={mouseHandlers.leave}
        position="relative"
      >
        <Image
          ref={ref as any}
          display="inline-block"
          maxWidth="100%"
          w={isEdgeToEdgeActive ? 'full' : ''}
          draggable="false"
          src={element.url}
          onLoad={handleImageLoaded}
        />
        {isHovered && !isReadonly && (
          <>
            <ElementDetails
              element={element}
              elRef={ref.current}
              zIndex={rteZIndex}
              top={detailsPos.top}
              left={detailsPos.left}
              additionalActions={additionalActions}
              deleteEnabled
            />
            <ImageModal
              isOpen={modalStates.edit}
              initialUrl={element.url}
              initialLightboxDisabled={element.lightboxDisabled}
              onCancel={modalHandlers.edit.close}
              onImage={handleEditImage}
              formFactor={formFactor}
              accessToken={accessToken}
              fileUploadConfig={fileUploadConfig}
            />
            <LinkModal
              attributes={dynamicAttributes}
              isOpen={modalStates.hyperlink}
              initialUrl={element.hyperlink}
              onCancel={modalHandlers.hyperlink.close}
              onLink={handleEditHyperlink}
              allowEmpty
            />
          </>
        )}
      </Box>
      {children}
    </Box>
  );
}
