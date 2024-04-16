import React from 'react';
import { List } from '@chakra-ui/react';

export function CodeBlock({ children, ...props }) {
  return (
    <div {...props.attributes}>
      <List
        as="ol"
        stylePosition="outside"
        mb="2"
        className="font-mono bg-code-block text-code-block whitespace-pre-wrap rounded py-3 pl-5 pr-3 code-list-item"
      >
        <code>{children}</code>
      </List>
    </div>
  );
}
