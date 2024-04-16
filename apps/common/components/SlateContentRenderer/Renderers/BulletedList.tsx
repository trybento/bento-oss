import React from 'react';
import { List } from '@chakra-ui/react';

export default function NumberedList({ node, children, ...restProps }) {
  return (
    <List styleType="disc" stylePosition="outside" mb="2" {...restProps} pl="8">
      {children}
    </List>
  );
}
