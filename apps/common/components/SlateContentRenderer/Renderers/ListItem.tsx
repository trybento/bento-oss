import React from 'react';
import { ListItem as DefaultListItem } from '@chakra-ui/react';

export default function ListItem({ node, children, ...restProps }) {
  return <DefaultListItem {...restProps}>{children}</DefaultListItem>;
}
