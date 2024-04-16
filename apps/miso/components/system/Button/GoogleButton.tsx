import { BoxProps, Flex } from '@chakra-ui/react';

import GoogleIcon from 'icons/Google';
import Text from 'system/Text';
import Box from 'system/Box';

const GoogleButton: React.FC<BoxProps> = ({ children, ...props }) => (
  <Flex
    as="button"
    transition="background-color .218s,border-color .218s,box-shadow .218s"
    className="trial-sign-up-btn"
    bg="#4285F4"
    borderRadius="4px"
    w="100%"
    p="4px"
    alignItems="center"
    _active={{ bg: '#3367d6' }}
    {...props}
  >
    <Box
      p="8px"
      background="white"
      borderRadius="4px"
      width="40px"
      height="40px"
    >
      <GoogleIcon />
    </Box>
    <Text
      width="100%"
      textAlign="center"
      fontSize="16px"
      fontWeight="bold"
      color="white"
      flexGrow={1}
    >
      {children}
    </Text>
  </Flex>
);
export default GoogleButton;
