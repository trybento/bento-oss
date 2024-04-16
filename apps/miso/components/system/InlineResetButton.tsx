import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

const InlineResetButton: React.FC<BoxProps> = (props) => (
  <Box
    color="bento.bright"
    cursor="pointer"
    userSelect="none"
    _hover={{ textDecoration: 'underline' }}
    {...props}
  >
    Reset
  </Box>
);

export default InlineResetButton;
