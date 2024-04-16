import React, { useCallback, useMemo, useRef } from 'react';
import { useFocused, useSelected, useSlate } from 'slate-react';
import ButtonModal from './ButtonModal';
import ElementDetails, {
  updateNodeField,
  useElementDetails,
} from '../../components/ElementDetails';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { FloatingControlAdditionalAction } from '../../../FloatingControls';
import {
  GuideFormFactor,
  StepCtaSettings,
  StepCtaStyle,
} from 'bento-common/types';
import { getDefaultCtaSetting } from 'bento-common/data/helpers';
import type { ElementProps } from '../../Element';
import { Box, BoxProps, Button } from '@chakra-ui/react';
import type {
  ButtonElement as ButtonElementType,
  TextNode,
} from 'bento-common/types/slate';
import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';
import {
  getButtonStyles,
  undefinedCtaColorFallbacks,
} from '../../../../utils/buttons';

const positionOffsetPx = { x: -50, y: -45 };
enum ModalStates {
  edit = 'edit',
}

type Props = ElementProps & {
  style: BoxProps['style'];
  element: ButtonElementType;
};

export default function ButtonElement({
  uiSettings,
  attributes,
  children,
  element,
  style,
  formFactor,
  formFactorStyle,
  dynamicAttributes,
}: Props) {
  const selected = useSelected();
  const focused = useFocused();
  const { isReadonly, zIndex: rteZIndex } = useRichTextEditorProvider();
  const editor = useSlate();
  const boxShadow = selected && focused ? `0 0 0 1px #cbd5e0` : 'none';
  const deprecatedButtonText = (element.children?.[0] as TextNode)?.text; // Old way of declaring text in the button
  const buttonText = element.buttonText || deprecatedButtonText;
  const ref = useRef<HTMLDivElement>(null);
  // Fallback to legacy since Button nodes haven't had styling before.
  const settings =
    element.settings || getDefaultCtaSetting(GuideFormFactor.legacy);
  const ctaStyle = element.style || StepCtaStyle.solid;

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

  const handleUpdateButton = useCallback(
    (
      buttonText: string,
      url: string,
      shouldCollapseSidebar: boolean,
      clickMessage: string,
      settings: StepCtaSettings,
      style: StepCtaStyle
    ) => {
      updateNodeField(editor, element, null, {
        buttonText,
        url,
        shouldCollapseSidebar,
        clickMessage,
        settings,
        style,
      });
      handleEditFinish();
    },
    [editor, element]
  );

  const additionalActions: FloatingControlAdditionalAction[] = useMemo(
    () => [
      {
        icon: EditOutlined,
        tooltipLabel: 'Edit button',
        action: modalHandlers.edit.open,
      },
    ],
    [modalHandlers]
  );

  return (
    <Box {...attributes}>
      <Box
        width="100%"
        textAlign="center"
        pt="24px"
        pb="32px"
        cursor="default"
        position="relative"
        contentEditable={false}
        onMouseEnter={mouseHandlers.enter}
        onMouseLeave={mouseHandlers.leave}
        boxShadow={boxShadow}
        style={style}
      >
        <Button
          ref={ref as any}
          display="inline-block"
          onClick={isReadonly ? undefined : modalHandlers.edit.open}
          {...getButtonStyles(
            { settings, style: ctaStyle },
            uiSettings,
            formFactorStyle,
            formFactor,
            undefinedCtaColorFallbacks
          )}
          _hover={{ opacity: 0.8 }}
        >
          {buttonText}
        </Button>
        {deprecatedButtonText ? (
          <Box display="none">{children as any}</Box>
        ) : (
          <>{children}</>
        )}
        {isHovered && !isReadonly && (
          <ElementDetails
            element={element}
            elRef={ref.current}
            zIndex={rteZIndex}
            top={detailsPos.top}
            left={detailsPos.left}
            additionalActions={additionalActions}
            deleteEnabled
          />
        )}
        {modalStates.edit && !isReadonly && (
          <ButtonModal
            attributes={dynamicAttributes}
            uiSettings={uiSettings}
            isOpen={modalStates.edit}
            onCancel={modalHandlers.edit.close}
            onButton={handleUpdateButton}
            initialValues={{
              text: buttonText,
              url: element.url,
              shouldCollapseSidebar: !!element?.shouldCollapseSidebar,
              clickMessage: element?.clickMessage,
              settings: element?.settings,
              style: element?.style,
            }}
            formFactor={formFactor}
            formFactorStyle={formFactorStyle}
          />
        )}
      </Box>
    </Box>
  );
}
