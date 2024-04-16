import React from 'react';
import { Box, Image as DefaultImage } from '@chakra-ui/react';

interface ImageNode {
  type: 'image';
  url: string;
  children: any;
}

interface ImageProps {
  node: ImageNode;
  children: any;
}

export default function Image({ node }: ImageProps) {
  const imageAlt = node.children?.[0]?.text;

  return (
    <Box textAlign="center">
      <DefaultImage
        alt={imageAlt}
        display="inline-block"
        maxWidth="100%"
        src={node.url}
      />
    </Box>
  );
}
