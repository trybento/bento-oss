import { Box } from '@chakra-ui/react';
import React from 'react';
import { useSelected, useFocused } from 'slate-react';
import { ElementProps } from '../../Element';

export default function DividerElement({
  uiSettings,
  attributes,
  children,
}: ElementProps) {
  const selected = useSelected();
  const focused = useFocused();

  const borderColor = uiSettings?.borderColor || 'lightgray';

  return (
    <Box {...attributes}>
      <Box
        margin="12px 1px"
        verticalAlign="baseline"
        display="inline-block"
        borderTop={`2px solid ${borderColor}`}
        height="0"
        width="100%"
        lineHeight="0"
        boxShadow={selected && focused ? '0 0 0 2px #B4D5FF' : 'none'}
        contentEditable={false}
      >
        {children as any}
      </Box>
    </Box>
  );
}
