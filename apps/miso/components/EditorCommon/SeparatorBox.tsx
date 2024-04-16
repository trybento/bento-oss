import React, { forwardRef, useMemo } from 'react';
import { BoxProps, Flex } from '@chakra-ui/layout';

type Props = {
  variant?: 'default' | 'secondary' | 'plain';
} & BoxProps;

const SeparatorBox = forwardRef<HTMLDivElement, Props>(
  ({ children, variant = 'default', ...props }, ref) => {
    const styleProps: BoxProps = useMemo(() => {
      const common: BoxProps = { p: '4', borderRadius: 'md' };

      return variant === 'default'
        ? {
            ...common,
            bg: 'white',
            border: '1px solid #E2E8F0',
          }
        : variant === 'secondary'
        ? {
            ...common,
            bg: 'gray.50',
          }
        : {};
    }, [variant]);

    return (
      <Flex {...styleProps} {...props} ref={ref}>
        {children}
      </Flex>
    );
  }
);

export default SeparatorBox;
