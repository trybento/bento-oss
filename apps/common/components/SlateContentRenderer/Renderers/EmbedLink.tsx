import React from 'react';

import { Link as DefaultLink } from '@chakra-ui/react';
import env from '@beam-australia/react-env';

interface LinkNode {
  type: 'link';
  url: string;
  children: any;
}

interface LinkProps {
  node: LinkNode;
  children: any;
}

export default function EmbedLink({ node, ...restProps }: LinkProps) {
  const url = node.url;
  let openInNewWindow = true;
  if (url && url.includes(env('CLIENT_HOST'))) {
    openInNewWindow = false;
  }

  return (
    <DefaultLink href={node.url} isExternal={openInNewWindow} {...restProps} />
  );
}
