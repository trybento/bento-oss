import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import colors from 'helpers/colors';
import Tooltip from 'system/Tooltip';

type DotIndicatorProps = BoxProps & {
  tooltip?: string;
  size?: number;
  color?: string;
};

/**
 * Def not a vTag at all, much inferior because its parent component needs pos="relative"
 */
const DotIndicator: React.FC<DotIndicatorProps> = ({
  tooltip,
  color,
  size = 6,
  ...boxProps
}) => (
  <Tooltip label={tooltip || ''} placement="top">
    <Box
      backgroundColor={color || colors.warning.bright}
      w={`${size}px`}
      h={`${size}px`}
      borderRadius="100%"
      position="absolute"
      top="0"
      right="-3"
      {...boxProps}
    />
  </Tooltip>
);

export default DotIndicator;
