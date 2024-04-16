import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

/**
 * A rounded white box for use inside gray-background layout sections.
 */
const DetailBox: React.FC<BoxProps> = ({ children, ...boxProps }) => {
  return (
    <Box
      backgroundColor="white"
      borderRadius={4}
      borderStyle="solid"
      borderWidth={1}
      borderColor="gray.200"
      lineHeight={8}
      fontSize="xs"
      {...boxProps}
    >
      {children}
    </Box>
  );
};

export default DetailBox;
