import React from 'react';
import { Box, Icon, BoxProps } from '@chakra-ui/react';

import { MuiSvgIcon } from 'types';

type Props = {
  icon: MuiSvgIcon;
  onClick: () => void;
  scale?: number;
  isDisabled?: boolean;
  bozSize?: number;
} & BoxProps;

const IconButton: React.FC<Props> = ({
  onClick,
  icon,
  isDisabled,
  scale = 0.7,
  boxSize = 4,
  ...boxProps
}) => {
  return (
    <Box
      color="text.secondary"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      onClick={isDisabled ? undefined : onClick}
      h={boxSize}
      w={boxSize}
      display="flex"
      alignItems="center"
      _hover={isDisabled ? undefined : { color: 'bento.bright' }}
      {...boxProps}
    >
      <Icon transform={`scale(${scale})`} as={icon} />
    </Box>
  );
};

export default IconButton;
