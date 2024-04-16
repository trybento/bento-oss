import React from 'react';
import { Flex, BoxProps, Stack } from '@chakra-ui/react';
import Box from 'system/Box';
import Text from 'system/Text';
import BentoLogo from './BentoLogo';

interface Props {
  pageName: string;
}

const MaintenanceWall: React.FC<Props & BoxProps> = ({
  pageName,
  ...boxProps
}) => {
  return (
    <Flex
      width="full"
      height="full"
      align="center"
      justify="center"
      {...boxProps}
    >
      <Stack spacing="10" align="center">
        <BentoLogo color="bento.bright" w="80px" h="80px" />
        <Box textAlign="center" width="full">
          <Text
            color="gray.600"
            fontSize="md"
            fontWeight="normal"
            lineHeight="30px"
          >
            The {pageName} page is taking a break and will be back soon.
            <br />
            If you have any urgent requests, please reach out to your admins.
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
};

export default MaintenanceWall;
