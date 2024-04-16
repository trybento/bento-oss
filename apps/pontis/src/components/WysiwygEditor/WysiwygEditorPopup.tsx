import { Box, BoxProps, Button } from '@chakra-ui/react';
import { WysiwygEditorMode } from 'bento-common/types';
import { px } from 'bento-common/utils/dom';
import React from 'react';

import { ContentDimensions, ElementDimensions, PopupPosition } from './types';

export type PopupPositionCallback = (
  dim: ElementDimensions,
  elem: HTMLDivElement,
  mode: WysiwygEditorMode,
  contentDim?: ContentDimensions,
) => PopupPosition;

type Props<D> = {
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelLabel?: React.ReactNode;
  submitLabel?: React.ReactNode;
  isSubmitEnabled?: boolean;
  width?: number;
  height?: number;
};

export default function WysiwygEditorPopup<D>({
  onCancel,
  onSubmit,
  cancelLabel = 'Cancel',
  submitLabel = 'Submit',
  isSubmitEnabled = true,
  width,
  height,
  children,
  ...props
}: React.PropsWithChildren<Props<D> & BoxProps>) {
  return (
    <Box
      borderRadius="4px"
      display="flex"
      flexDir="column"
      gap="6"
      width={width !== undefined ? px(width) : 'full'}
      height={height ? px(height) : 'auto'}
      bg="white"
      justifyContent="space-between"
      {...props}>
      <Box>{children}</Box>
      {(onCancel || onSubmit) && (
        <Box
          display="flex"
          justifyContent={
            onCancel && onSubmit
              ? 'space-between'
              : onCancel
              ? 'flex-start'
              : 'flex-end'
          }>
          {onCancel && (
            <Button onClick={onCancel} variant="secondary" size="sm">
              {cancelLabel}
            </Button>
          )}
          {onSubmit && (
            <Button
              onClick={onSubmit}
              isDisabled={!isSubmitEnabled}
              ml="8px"
              size="sm">
              {submitLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
