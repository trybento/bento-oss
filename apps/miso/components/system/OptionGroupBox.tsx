import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface Props extends BoxProps {
  children: React.ReactNode;
}

/** Create a background for a group of options */
const OptionGroupBox: React.FC<Props> = ({ children, ...boxProps }) => (
  <Box backgroundColor="gray.50" borderRadius="4px" p="4" {...boxProps}>
    {children}
  </Box>
);

export default OptionGroupBox;
