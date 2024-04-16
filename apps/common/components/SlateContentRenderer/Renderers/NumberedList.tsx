import React from 'react';
import { List } from '@chakra-ui/react';

export default function NumberedList({ node, children, ...restProps }) {
  return (
    <List
      as="ol"
      styleType="decimal"
      stylePosition="outside"
      mb="2"
      {...restProps}
      pl="8"
    >
      {children}
    </List>
  );
}
