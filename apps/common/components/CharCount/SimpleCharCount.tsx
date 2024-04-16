import React, { memo } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

import { CharCountProps, getCharCountColor } from './helpers';

export default memo(function SimpleCharCount({
  limit,
  text,
  fontSize = 'xs',
  color = 'gray.500',
  ...restProps
}: CharCountProps & BoxProps) {
  const count = (text || '').length;
  const countColor = getCharCountColor(limit, count);

  return (
    <Box fontSize={fontSize} {...restProps} color={countColor || color}>
      {count}/{limit}
    </Box>
  );
});
