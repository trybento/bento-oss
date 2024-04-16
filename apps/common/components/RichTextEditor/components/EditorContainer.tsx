import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import colors from '../../../frontend/colors';
import { EDITOR_HEIGHT } from '../helpers';

interface EditorContainerProps extends BoxProps {
  isFocused: boolean;
  hasWarning?: boolean;
  componentStyle?: {
    backgroundColor?: string;
    /** Refers to text color */
    color?: string;
  };
}

export default function EditorContainer({
  children,
  isFocused,
  hasWarning,
  onClick,
  componentStyle,
  ...restProps
}: EditorContainerProps) {
  const borderColor = hasWarning
    ? colors.warning.bright
    : isFocused
    ? '#3283ce'
    : '#cbd5e0';
  const boxShadow = isFocused ? `0 0 0 1px ${borderColor}` : 'none';

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minWidth="400px"
      minHeight={EDITOR_HEIGHT}
      border="1px solid"
      borderRadius="4px"
      cursor="text"
      bg="white"
      borderColor={borderColor}
      boxShadow={boxShadow}
      onClick={onClick}
      {...(componentStyle || {})}
      {...restProps}
    >
      {children}
    </Box>
  );
}
