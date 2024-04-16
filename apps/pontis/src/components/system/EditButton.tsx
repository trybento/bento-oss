import { Box, BoxProps } from '@chakra-ui/react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import React, { forwardRef } from 'react';

import { withTooltip } from './Badge';

interface EditButtonProps {
  disabled?: boolean;
}

const EditButton = forwardRef(
  (
    {
      children,
      disabled,
      _hover,
      onClick,
      ...props
    }: BoxProps & EditButtonProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <Box
        ref={ref}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        color={disabled ? 'gray.300' : 'gray.400'}
        _hover={
          disabled
            ? _hover || null
            : {
                color: 'gray.600',
                ..._hover,
              }
        }
        onClick={disabled ? null : onClick}
        {...props}>
        <EditOutlinedIcon style={{ height: 'inherit' }} />
      </Box>
    );
  },
);

export default withTooltip<BoxProps & EditButtonProps>(EditButton);
