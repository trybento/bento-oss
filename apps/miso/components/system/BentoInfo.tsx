import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

const BentoInfo: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="bento.logo"
      p="4"
      borderRadius="4px"
      display="inline-block"
      {...props}
    >
      <Box display="flex" alignItems="center">
        <InfoOutlined style={{ width: '24px', color: 'white' }} />
        <Box ml="1" color="white">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default BentoInfo;
