import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

/**
 * For use with dynamic pieces of inline data
 */
export const Highlight: React.FC<TextProps> = ({ children, ...textProps }) => (
  <Text
    display="inline"
    borderRadius={'base'}
    bg="#edf2f7"
    color="gray.600"
    px="1.5"
    py="1"
    {...textProps}
  >
    {children}
  </Text>
);
