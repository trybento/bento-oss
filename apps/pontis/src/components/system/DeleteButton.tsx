import { Box, BoxProps } from '@chakra-ui/react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import React, { forwardRef } from 'react';

import { withTooltip } from './Badge';

interface DeleteButtonProps {
  disabled?: boolean;
}

const DeleteButton = forwardRef(
  (
    {
      children,
      disabled,
      _hover,
      onClick,
      ...props
    }: BoxProps & DeleteButtonProps,
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
        <DeleteIcon style={{ height: 'inherit' }} />
      </Box>
    );
  },
);

export default withTooltip<BoxProps & DeleteButtonProps>(DeleteButton);
