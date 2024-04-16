import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem as DefaultMenuItem,
  Box,
} from '@chakra-ui/react';
import { useSlate } from 'slate-react';
import { BaseEditor, BaseRange, Editor } from 'slate';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import CodeIcon from '@mui/icons-material/Code';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import SvgIcon from '@mui/material/SvgIcon';
import H1Icon from '../../icons/H1';
import H2Icon from '../../icons/H2';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';

import Tooltip from '../Tooltip';

import { ElementType, Mark } from 'bento-common/types/slate';

import {
  getMarkValue,
  isBlockActive,
  isMarkActive,
  noSelection,
  setCursorToLineHead,
  setMarkValue,
  toggleBlock,
  toggleMark,
} from './helpers';

import useButtonTrigger from './extensions/Button/useButtonTrigger';
import useImageTrigger from './extensions/Image/useImageTrigger';
import useLinkTrigger from './extensions/Link/useLinkTrigger';
import useCalloutTrigger from './extensions/Callout/useCalloutTrigger';

import ButtonModal from './extensions/Button/ButtonModal';
import ImageModal from './extensions/Image/ImageModal';
import LinkModal from './LinkModal';
import CalloutModal from './extensions/Callout/CalloutModal';

import { useRichTextEditorProvider } from './providers/RichTextEditorProvider';
import VideoModal from './extensions/Video/VideoModal';
import useVideoTrigger from './extensions/Video/useVideoTrigger';

import { AlignmentEnum, FillEnum } from 'bento-common/types';
import useDividerTrigger from './extensions/Divider/useDividerTrigger';
import ColorField from '../ColorField';
import { isMac } from '../../utils/browser';

interface FormattingButtonProps {
  color: string;
  icon?: typeof SvgIcon;
  isSet?: boolean;
  onClick: () => void;
  isDisabled?: boolean;
  iconElement?: JSX.Element;
  tooltipLabel?: string;
}

function FormattingButton({
  onClick,
  color,
  icon: Icon,
  isSet = false,
  isDisabled,
  iconElement,
  tooltipLabel,
}: FormattingButtonProps): JSX.Element {
  return (
    <Tooltip placement="top" label={tooltipLabel}>
      <Box
        as="button"
        type="button"
        my="auto"
        display="flex"
        h="24px"
        w="24px"
        borderRadius="4px"
        color={color}
        _active={{ backgroundColor: isSet ? 'bento.bright' : 'gray.50' }}
        _focus={{ outline: 'none' }}
        _hover={{ backgroundColor: isSet ? 'bento.pale' : 'bento.pale' }}
        // use onMouseDown to avoid focusing button (and unfocusing text editor)
        onMouseDown={(e: React.MouseEvent<unknown>) => {
          e.preventDefault();
          if (!isDisabled) {
            onClick();
          }
        }}
      >
        {Icon ? (
          <Icon style={{ margin: 'auto', width: '18px', height: '18px' }} />
        ) : (
          iconElement
        )}
      </Box>
    </Tooltip>
  );
}

export interface BlockButtonProps {
  type: ElementType | AlignmentEnum | FillEnum;
  icon?: typeof SvgIcon;
  iconElement?: JSX.Element;
  isDisabled?: boolean;
  tooltipLabel?: string;
}
export function BlockButton({
  type,
  icon,
  iconElement,
  isDisabled,
  tooltipLabel,
}: BlockButtonProps): JSX.Element {
  const editor = useSlate();
  const isSet = isBlockActive(editor, type);
  const color = isSet ? 'bento.bright' : 'icon.secondary';
  return (
    <FormattingButton
      color={color}
      icon={icon}
      isSet={isSet}
      isDisabled={isDisabled}
      iconElement={iconElement}
      onClick={() => {
        toggleBlock(editor, type);
      }}
      tooltipLabel={tooltipLabel}
    />
  );
}

const HEADER_MARKS = ['h1', 'h2'];

const handleHeadersOff = (editor: BaseEditor, mark: Mark) => {
  HEADER_MARKS.forEach((hMark) => {
    if (isMarkActive(editor, hMark) && mark !== hMark)
      toggleMark(editor, hMark);
  });
};
export interface MarkButtonProps {
  mark: Mark;
  icon?: typeof SvgIcon;
  iconElement?: JSX.Element;
  isDisabled?: boolean;
  tooltipLabel?: string;
}
export function MarkButton({
  mark,
  icon,
  isDisabled,
  iconElement,
  tooltipLabel,
}: MarkButtonProps): JSX.Element {
  const editor = useSlate();
  const isSet = isMarkActive(editor, mark);
  const color = isSet ? 'bento.bright' : 'icon.secondary';
  return (
    <FormattingButton
      color={color}
      icon={icon}
      isSet={isSet}
      isDisabled={isDisabled}
      iconElement={iconElement}
      onClick={() => {
        toggleMark(editor, mark);
        handleHeadersOff(editor, mark);
      }}
      tooltipLabel={tooltipLabel}
    />
  );
}

export interface LinkButtonProps {
  isDisabled?: boolean;
  isSet: boolean;
  onTriggerLinkModal: () => void;
  tooltipLabel?: string;
}

export function LinkButton({
  isDisabled,
  isSet,
  onTriggerLinkModal,
  tooltipLabel,
}: LinkButtonProps): JSX.Element {
  const color = isSet ? 'bento.bright' : 'icon.secondary';

  return (
    <>
      <FormattingButton
        color={color}
        icon={InsertLinkIcon}
        isSet={isSet}
        isDisabled={isDisabled}
        onClick={onTriggerLinkModal}
        tooltipLabel={tooltipLabel}
      />
    </>
  );
}

export interface ImageButtonProps {
  isDisabled?: boolean;
  isSet: boolean;
  onTriggerImageModal: () => void;
}

export function ImageButton({
  isDisabled,
  isSet,
  onTriggerImageModal,
}: ImageButtonProps): JSX.Element {
  const color = isSet ? 'bento.bright' : 'icon.secondary';

  return (
    <>
      <FormattingButton
        color={color}
        icon={ImageIcon}
        isSet={isSet}
        isDisabled={isDisabled}
        onClick={onTriggerImageModal}
      />
    </>
  );
}

export interface TextColorButtonProps {
  isDisabled?: boolean;
}

const prependHex = (hex: string) =>
  hex?.[0] !== '#' && hex !== '' ? `#${hex}` : hex;

// TODO: Extract
export function TextColorButton({
  isDisabled,
}: TextColorButtonProps): JSX.Element {
  const editor = useSlate();
  const markColor = getMarkValue(editor, 'color');
  const color = markColor ? 'bento.bright' : 'icon.secondary';
  const [pickerColor, setPickerColor] = useState(markColor || '');

  const persistColorMark = useCallback(() => {
    if (noSelection(editor)) return;

    if (pickerColor) {
      setMarkValue(editor, 'color', prependHex(pickerColor));
    } else {
      Editor.removeMark(editor, 'color');
    }

    /* Workaround for a crash if user clicks into line end after selecting */
    setCursorToLineHead(editor);
  }, [pickerColor, editor]);

  const handleSetColor = useCallback((color: string | null) => {
    setPickerColor(color || '');
  }, []);

  return (
    <Box display="flex" position="relative">
      <ColorField
        name="textColor"
        defaultValue={pickerColor}
        onChange={handleSetColor}
        onClose={persistColorMark}
        popoverTrigger={
          <Box display="flex">
            {markColor ? (
              <Box
                width="6"
                height="6"
                backgroundColor={markColor}
                border="1px solid #e7e7e7"
                borderRadius="4px"
                alignSelf="center"
                transform="scale(0.7)"
                cursor="pointer"
              />
            ) : (
              <FormattingButton
                color={color}
                icon={PaletteOutlinedIcon}
                isSet={!!markColor}
                isDisabled={isDisabled}
                onClick={() => {}}
                tooltipLabel="Text color"
              />
            )}
          </Box>
        }
        width="unset"
        display="flex"
        allowTransparent={false}
        showUnset
      />
    </Box>
  );
}

/** Extra element types dropdown */
function OverflowMenuButton(props) {
  const {
    handleFocusEditor,
    formFactor,
    formFactorStyle,
    uiSettings,
    organizationDomain,
    accessToken,
    fileUploadConfig,
    dynamicAttributes,
  } = props;

  const {
    isButtonModalOpen,
    onButtonModalClose,
    onButton,
    onTriggerButtonModal,
  } = useButtonTrigger();

  const buttonModalKey = useMemo(
    () => `new-button-modal-${Math.random()}`,
    [isButtonModalOpen]
  );

  const { isImageModalOpen, onImageModalClose, onImage, onTriggerImageModal } =
    useImageTrigger();

  const {
    isCalloutModalOpen,
    onTriggerCalloutModal,
    onCallout,
    onCalloutModalClose,
  } = useCalloutTrigger();

  const { onDivider } = useDividerTrigger();

  const { isVideoModalOpen, onVideoModalClose, onVideo, onTriggerVideoModal } =
    useVideoTrigger();

  const { setPersistedSelection, isTypeEnabled } = useRichTextEditorProvider();
  const editor = useSlate();

  const MenuItem = (props) => (
    <DefaultMenuItem
      {...props}
      _hover={{ backgroundColor: 'gray.200' }}
      height="30px"
    />
  );

  const handleImageOption = useCallback(
    (e: React.MouseEvent) => {
      onTriggerImageModal();
    },
    [onTriggerImageModal]
  );

  const handleClose = () => {
    // Timeout needed when the menu is closed onBlur and the editor is the next activeElement.
    setTimeout(() => {
      handleFocusEditor();
    }, 100);
  };

  const handleOpen = () => {
    if (editor.selection && typeof setPersistedSelection === 'function') {
      setPersistedSelection(editor.selection as BaseRange);
    }
  };

  if (
    !['image', 'callout', 'videos', 'button', 'file-upload'].some((type) =>
      isTypeEnabled(type as ElementType)
    )
  ) {
    return null;
  }

  return (
    <>
      <Box mt="2" mb="2">
        <Menu placement="top-start" onClose={handleClose} onOpen={handleOpen}>
          <MenuButton
            color="bento.bright"
            _active={{ backgroundColor: 'silver.100' }}
            _focus={{ outline: 'none' }}
            _hover={{ backgroundColor: 'bento.pale' }}
            h="24px"
            w="24px"
            borderRadius="4px"
          >
            <Box display={'flex'}>
              <AddCircleIcon style={{ margin: 'auto' }} />
            </Box>
          </MenuButton>
          <MenuList>
            {isTypeEnabled('image') && (
              <MenuItem onClick={handleImageOption}>Image / GIF</MenuItem>
            )}
            {isTypeEnabled('videos') && (
              <MenuItem onClick={onTriggerVideoModal}>Video</MenuItem>
            )}
            {isTypeEnabled('callout') && (
              <MenuItem onClick={onTriggerCalloutModal}>Callout</MenuItem>
            )}
            <MenuItem onClick={onDivider}>Divider</MenuItem>
            {isTypeEnabled('button') && (
              <MenuItem onClick={onTriggerButtonModal}>Button</MenuItem>
            )}
          </MenuList>
        </Menu>
        {isTypeEnabled('button') && (
          <ButtonModal
            uiSettings={uiSettings}
            organizationDomain={organizationDomain}
            key={buttonModalKey}
            isOpen={isButtonModalOpen}
            onCancel={onButtonModalClose}
            onButton={onButton}
            formFactor={formFactor}
            formFactorStyle={formFactorStyle}
            attributes={dynamicAttributes}
          />
        )}
        {isTypeEnabled('videos') && (
          <VideoModal
            isOpen={isVideoModalOpen}
            onCancel={onVideoModalClose}
            onVideo={onVideo}
          />
        )}
        {isTypeEnabled('image') && (
          <ImageModal
            isOpen={isImageModalOpen}
            onImage={onImage}
            onCancel={onImageModalClose}
            formFactor={formFactor}
            accessToken={accessToken}
            fileUploadConfig={fileUploadConfig}
          />
        )}
        {isTypeEnabled('callout') && (
          <CalloutModal
            isOpen={isCalloutModalOpen}
            onCancel={onCalloutModalClose}
            onCallout={onCallout}
          />
        )}
      </Box>
      <Box mt="2" width="2px" height="24px" bg="gray.200" borderRadius="2px" />
    </>
  );
}

/** Default icon bar */
export default function FormattingButtons({
  attributes,
  uiSettings,
  organizationDomain,
  accessToken,
  fileUploadConfig,
  handleFocusEditor,
  hotkeyEnabled,
  resetHotkey,
  formFactor,
  formFactorStyle,
  addMenuDisabled,
}) {
  const { isTypeEnabled } = useRichTextEditorProvider();

  const {
    isLinkModalOpen,
    onLinkModalClose,
    isLinkSet,
    onLink,
    onTriggerLinkModal,
  } = useLinkTrigger();

  useEffect(() => {
    if (hotkeyEnabled === 'link') {
      resetHotkey();
      isTypeEnabled('link') && onTriggerLinkModal();
    }
  }, [hotkeyEnabled]);

  const shortcutKey = React.useMemo(() => (isMac() ? 'CMD' : 'CTRL'), []);

  return (
    <>
      <ButtonGroup
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        h="40px"
        px="4"
        display="flex"
        flexDir="row"
        position="relative"
        backgroundColor="white"
      >
        {!addMenuDisabled && (
          <OverflowMenuButton
            organizationDomain={organizationDomain}
            uiSettings={uiSettings}
            handleFocusEditor={handleFocusEditor}
            formFactor={formFactor}
            formFactorStyle={formFactorStyle}
            accessToken={accessToken}
            fileUploadConfig={fileUploadConfig}
          />
        )}
        {isTypeEnabled(AlignmentEnum.left) && (
          <BlockButton
            type={AlignmentEnum.left}
            tooltipLabel="Align left"
            icon={FormatAlignLeftIcon}
          />
        )}
        {isTypeEnabled(AlignmentEnum.center) && (
          <BlockButton
            type={AlignmentEnum.center}
            tooltipLabel="Align center"
            icon={FormatAlignCenterIcon}
          />
        )}
        {isTypeEnabled(AlignmentEnum.right) && (
          <BlockButton
            type={AlignmentEnum.right}
            tooltipLabel="Align right"
            icon={FormatAlignRightIcon}
          />
        )}
        {isTypeEnabled('h1') && (
          <MarkButton mark="h1" tooltipLabel="H1 header" icon={H1Icon as any} />
        )}
        {isTypeEnabled('h2') && (
          <MarkButton mark="h2" tooltipLabel="H2 header" icon={H2Icon as any} />
        )}
        <TextColorButton />
        <MarkButton
          mark="bold"
          tooltipLabel={`Bold (${shortcutKey} + B)`}
          icon={FormatBoldIcon}
        />
        <MarkButton
          mark="italic"
          tooltipLabel={`Italic (${shortcutKey} + I)`}
          icon={FormatItalicIcon}
        />
        <MarkButton
          mark="underline"
          tooltipLabel={`Underline (${shortcutKey} + U)`}
          icon={FormatUnderlinedIcon}
        />
        {isTypeEnabled('link') && (
          <LinkButton
            isSet={isLinkSet}
            onTriggerLinkModal={onTriggerLinkModal}
            tooltipLabel={`Hyperlink (${shortcutKey} + K)`}
          />
        )}
        {isTypeEnabled('bulleted-list') && (
          <BlockButton
            type="bulleted-list"
            tooltipLabel="Bulleted list ( * or - )"
            icon={FormatListBulletedIcon}
          />
        )}
        {isTypeEnabled('numbered-list') && (
          <BlockButton
            type="numbered-list"
            tooltipLabel="Numbered list ( 1. )"
            icon={FormatListNumberedIcon}
          />
        )}
        {isTypeEnabled('block-quote') && (
          <BlockButton
            type="block-quote"
            tooltipLabel="Style as quote ( > )"
            icon={FormatQuoteOutlinedIcon}
          />
        )}

        {isTypeEnabled('code') && (
          <MarkButton mark="code" tooltipLabel="Inline code" icon={CodeIcon} />
        )}
        {isTypeEnabled('code-block') && (
          <BlockButton
            type="code-block"
            tooltipLabel="Code block"
            icon={IntegrationInstructionsOutlinedIcon as any}
          />
        )}
      </ButtonGroup>
      <LinkModal
        attributes={attributes}
        isOpen={isLinkModalOpen}
        onCancel={onLinkModalClose}
        onLink={onLink}
      />
    </>
  );
}
