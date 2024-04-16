import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

interface Props extends Omit<TextProps, 'as'> {
  children: React.ReactNode;
}

const Span = React.forwardRef<HTMLDivElement, Props>((props: Props, ref) => (
  <Text as="span" {...props} ref={ref} />
));

export default Span;
