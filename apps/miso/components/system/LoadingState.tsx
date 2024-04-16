import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { BentoLoadingSpinner } from 'components/TableRenderer';

/**
 * Simple box loading state with a light gray background.
 * Accepts children to use as additional content under the spinner
 */
const LoadingState: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box w="full" py="8" background="gray.50" borderRadius="sm" {...props}>
    <BentoLoadingSpinner />
    {children}
  </Box>
);

export default LoadingState;
