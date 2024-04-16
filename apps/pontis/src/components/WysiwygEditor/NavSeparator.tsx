import { Box, BoxProps } from '@chakra-ui/react';
import React, { FC } from 'react';

interface Props extends BoxProps {}

const NavSeparator: FC<Props> = ({ borderColor = 'bento.logo', ...props }) => (
  <Box
    w="1px"
    h="30px"
    opacity="0.8"
    borderRightWidth="1px"
    borderRightStyle="solid"
    borderColor={borderColor}
    {...props}
  />
);

export default NavSeparator;
