import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

/** Card-ish component with some padding and rounded border */
const InfoCard: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      mb="6"
      rounded="base"
      borderColor="gray.300"
      borderWidth="1px"
      p="4"
      w="400px"
      {...props}
    >
      {children}
    </Box>
  );
};

export default InfoCard;
