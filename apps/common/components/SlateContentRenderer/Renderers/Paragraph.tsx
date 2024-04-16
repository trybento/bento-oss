import React from 'react';

import { Box } from '@chakra-ui/react';

interface ParagraphNode {
  type: 'paragraph';
  children: any;
}

interface ParagraphProps {
  node: ParagraphNode;
  children: any;
}

export default function Paragraph({ children }: ParagraphProps) {
  return <Box mb={2}>{children}</Box>;
}
