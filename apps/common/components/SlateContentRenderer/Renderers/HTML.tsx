import React from 'react';

import { Box } from '@chakra-ui/react';

interface HTMLNode {
  type: 'html';
  children: any;
}

interface HTMLProps {
  node: HTMLNode;
  children: any;
}

export default function HTML({ node }: HTMLProps) {
  return (
    <Box
      textAlign="center"
      margin="auto"
      display="flex"
      justifyContent="center"
    >
      <div dangerouslySetInnerHTML={{ __html: node.children?.[0]?.text }} />
    </Box>
  );
}
