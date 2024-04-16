import { Box } from '@chakra-ui/react';
import React from 'react';
import { useSelected, useFocused } from 'slate-react';

export default function DynamicAttribute({ attributes, children }) {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <Box
      {...attributes}
      padding="3px 3px 2px"
      margin="0 1px"
      verticalAlign="baseline"
      display="inline-block"
      border="1px solid #e0e0e0"
      borderRadius="4px"
      backgroundColor="#eee"
      fontSize="12px"
      boxShadow={selected && focused ? '0 0 0 2px #B4D5FF' : 'none'}
      spellCheck={false}
    >
      {children}
    </Box>
  );
}
