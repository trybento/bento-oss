import React from 'react';
import { TextNode } from 'bento-common/types/slate';

import DefaultText from '../../Text';

interface TextProps {
  node?: TextNode;
  children?: any;
}

const NON_BREAKING_WHITE_SPACE = `\u00a0`;

/** Actual text nodes */
export default function Text(props: TextProps) {
  const { node, children, ...restProps } = props;

  let asProp;
  if (node.italic) {
    asProp = 'i';
  } else if (node.underline) {
    asProp = 'u';
  } else if (node.code) {
    asProp = 'code';
  } else if (node.h1) {
    asProp = 'h1';
  } else if (node.h2) {
    asProp = 'h2';
  } else {
    asProp = 'p';
  }

  const textStyleProps = {
    fontWeight: node.bold || node.h1 ? 'bold' : 'normal',
    color: node.color,
    as: asProp,
  };

  return (
    <>
      <DefaultText {...textStyleProps} display="inline" {...restProps}>
        {node.text || NON_BREAKING_WHITE_SPACE}
      </DefaultText>
      {children}
    </>
  );
}
