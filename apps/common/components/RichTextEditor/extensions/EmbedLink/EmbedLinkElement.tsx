import React, { useCallback, useMemo, useRef } from 'react';
import { useSlate } from 'slate-react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ShortTextIcon from '@mui/icons-material/ShortText';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { mergeRefs } from 'react-merge-refs';
import cx from 'classnames';
import {
  EmbedLinkStyle,
  EmbedLinkElement as EmbedLinkElementType,
  EmbedLinkElementSources,
} from 'bento-common/types/slate';
import { withStopEvent } from 'bento-common/utils/dom';
import { Box, Link } from '@chakra-ui/react';
import ElementDetails, {
  updateNodeField,
  updateNodeFields,
  useElementDetails,
} from '../../components/ElementDetails';
import { FloatingControlAdditionalAction } from '../../../FloatingControls';
import EmbedLinkModal from '../../EmbedLinkModal';
import { getEmbedOptions } from 'bento-common/utils/embedSlate';
import { ElementProps } from '../../Element';
import CalendlyEmbed from './CalendlyEmbed';
import { EmbedLinkComponentProps } from './types';
import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';

enum ModalStates {
  edit = 'edit',
}

type Props = ElementProps & { element: EmbedLinkElementType };

const embedComponents: {
  [key in EmbedLinkElementSources]: React.ComponentType<
    EmbedLinkComponentProps<key>
  >;
} = {
  calendly: CalendlyEmbed,
};

export default function EmbedLinkElement(props: Props): JSX.Element {
  const {
    uiSettings,
    attributes,
    element,
    children,
    formFactor,
    formFactorStyle,
    dynamicAttributes,
  } = props;
  const editor = useSlate();
  const { isReadonly, zIndex: rteZIndex } = useRichTextEditorProvider();
  const localRef = useRef<HTMLDivElement>(null);
  const { embedBackgroundHex, primaryColorHex, fontColorHex } =
    uiSettings || {};

  const {
    detailsPos,
    isHovered,
    mouseHandlers,
    handleEditFinish,
    modalHandlers,
    modalStates,
  } = useElementDetails({
    modalStatesEnum: ModalStates,
    element: localRef.current,
    positionOffsetPx: { y: -50, x: 0 },
  });

  const isEmbed = element.style !== EmbedLinkStyle.link;

  const embedOptions = useMemo(() => getEmbedOptions(element), [element]);

  const handleClick = useCallback(
    withStopEvent(() => {
      if (!isEmbed && element.url) {
        window.open(element.url, '_blank').focus();
      }
    }),
    [element.url, isEmbed]
  );

  const handleEditEmbed = useCallback(
    (data: Partial<EmbedLinkElementType>) => {
      updateNodeFields(editor, element, data);
      handleEditFinish();
    },
    [editor, element]
  );

  const handleToggleEmbed = useCallback(() => {
    updateNodeField(
      editor,
      element,
      'style',
      element.style === EmbedLinkStyle.link
        ? EmbedLinkStyle.inline
        : EmbedLinkStyle.link
    );
  }, [editor, element.style]);

  const additionalActions: FloatingControlAdditionalAction[] = useMemo(
    () => [
      {
        icon: isEmbed ? ShortTextIcon : WysiwygIcon,
        tooltipLabel: isEmbed ? 'URL' : 'Embed',
        action: handleToggleEmbed,
      },
      {
        icon: EditOutlinedIcon,
        tooltipLabel: 'Edit embed URL',
        action: modalHandlers.edit.open,
      },
    ],
    [modalHandlers, isEmbed, handleToggleEmbed]
  );

  const Embed = embedComponents[element.source];

  return (
    <Link
      {...attributes}
      ref={mergeRefs([attributes.ref, localRef])}
      color="b-primary.600"
      // href not working here
      onClick={handleClick}
      position="relative"
      onMouseEnter={mouseHandlers.enter}
      onMouseLeave={mouseHandlers.leave}
      className={cx({
        'inline-block': !isEmbed,
        block: isEmbed,
      })}
    >
      <>
        {isHovered && !isReadonly && (
          <>
            {isEmbed && (
              <Box
                position="absolute"
                zIndex={1}
                left={0}
                top={0}
                display="block"
                w="100%"
                h="100%"
                bgColor="#000"
                opacity=".2"
                cursor="default"
              />
            )}
            <ElementDetails
              element={element}
              elRef={localRef.current}
              zIndex={rteZIndex}
              top={detailsPos.top}
              left={detailsPos.left}
              textToDisplay={element.url}
              additionalActions={additionalActions}
            />
            <EmbedLinkModal
              attributes={dynamicAttributes}
              uiSettings={uiSettings}
              isOpen={modalStates.edit}
              initialUrl={element.url}
              onCancel={modalHandlers.edit.close}
              onSave={handleEditEmbed}
              source={element.source}
              initialOptions={embedOptions}
              formFactor={formFactor}
              formFactorStyle={formFactorStyle}
            />
          </>
        )}
        <Embed
          backgroundColor={embedBackgroundHex}
          primaryColorHex={primaryColorHex}
          fontColorHex={fontColorHex}
          {...props}
        />
        {children}
      </>
    </Link>
  );
}
