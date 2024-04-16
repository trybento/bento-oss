import React from 'react';
import { Box, Flex, FlexProps } from '@chakra-ui/react';

import colors from 'helpers/colors';
import H4 from 'system/H4';

type Props = {
  children: React.ReactNode;
  headerDecorator?: React.ReactNode;
  header: string;
  helperText?: string | React.ReactNode;
} & FlexProps;

const EditorTabSection: React.FC<Props> = ({
  children,
  header,
  helperText,
  headerDecorator,
  ...flexProps
}) => (
  <Flex
    borderBottom={`1px solid ${colors.gray[100]}`}
    mb="8"
    pb="8"
    gap="10"
    minW="3xl"
    w="full"
    {...flexProps}
  >
    <Box w="xs">
      <H4 fontWeight="bold" display="flex">
        {header} {headerDecorator}
      </H4>
      <Box>{helperText}</Box>
    </Box>
    <Box w="3xl" mt={1}>
      {children}
    </Box>
  </Flex>
);

export default EditorTabSection;
