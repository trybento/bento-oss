import React from 'react';
import { Box as DefaultBox, BoxProps } from '@chakra-ui/react';

export interface Props extends BoxProps {
  children: React.ReactNode;
}

const DataDisplayBox = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <DefaultBox
      w="full"
      bg="gray.50"
      p="2"
      borderRadius="4"
      {...props}
      ref={ref}
    />
  )
);

export default DataDisplayBox;
