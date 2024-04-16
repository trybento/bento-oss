import React, { FC } from 'react';
import { getNodeStyle } from '../helpers';
import { AlignmentEnum } from 'bento-common/types';

interface BlockQuoteNode {
  type: 'block-quote';
  children: any;
  alignment?: AlignmentEnum;
}

interface Props {
  node: BlockQuoteNode;
  children: any;
}

const BlockQuote: FC<Props> = ({ children, node }) => {
  const style = getNodeStyle(node);
  return (
    <blockquote
      className="leading-normal mb-2"
      style={{
        paddingLeft: '10px',
        borderLeft: '2px solid #ddd',
        // TODO: Use a darker and lighter color
        // of the current font color.
        color: '#aaa',
        ...style,
      }}
    >
      <div>{children}</div>
    </blockquote>
  );
};

export default BlockQuote;
