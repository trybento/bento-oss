import React from 'react';
import { Box } from '@chakra-ui/react';
import { useFocused, useSelected } from 'slate-react';

export default function HtmlElement({ element, attributes }) {
  const selected = useSelected();
  const focused = useFocused();
  const boxShadow = selected && focused ? `0 0 0 1px #cbd5e0` : 'none';

  return (
    <Box {...attributes}>
      <Box
        textAlign="center"
        margin="auto"
        display="flex"
        justifyContent="center"
        contentEditable={false}
        boxShadow={boxShadow}
      >
        <div
          dangerouslySetInnerHTML={{ __html: element.children?.[0]?.text }}
        />
      </Box>
    </Box>
  );
}
