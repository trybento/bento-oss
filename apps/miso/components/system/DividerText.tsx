import React, { FC } from 'react';
import { BoxProps } from '@chakra-ui/react';

import Box from 'system/Box';
import Text from 'system/Text';
import colors from 'helpers/colors';

const DividerText: FC<{ text: string; dividerWidth?: string } & BoxProps> = ({
  text,
  dividerWidth,
  ...props
}) => (
  <Box width={dividerWidth || '3xs'} my="4">
    <Box
      w="full"
      borderBottom={`1px solid ${colors.gray[200]}`}
      lineHeight="0.1em"
      textAlign="center"
      {...props}
    >
      <Text background="#fff" px="2" as="span">
        {text}
      </Text>
    </Box>
  </Box>
);

export default DividerText;
