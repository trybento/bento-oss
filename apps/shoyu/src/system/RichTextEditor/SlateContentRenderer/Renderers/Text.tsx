import React, { useMemo } from 'react';
import cx from 'classnames';
import { SlateRendererProps, TextNode } from 'bento-common/types/slate';
import { AlignmentEnum } from 'bento-common/types';

import { getNodeStyle } from '../helpers';
import { isNil } from 'bento-common/utils/lodash';
import { px } from 'bento-common/utils/dom';

interface TextProps extends SlateRendererProps {
  node: TextNode;
}

const ZERO_WIDTH_NO_BREAK_SPACE = `\u2060`;

const alignmentClasses = {
  [AlignmentEnum.left]: 'text-left',
  [AlignmentEnum.right]: 'text-right',
  [AlignmentEnum.center]: 'text-center',
};

const textStyleKeys: (keyof TextNode)[] = [
  'bold',
  'code',
  'h1',
  'h2',
  'italic',
  'strikethrough',
  'underline',
];

export default function Text({ node, children, options }: TextProps) {
  const { bold, italic, underline, code, h1, h2, fontSize } = node;
  const isEmpty = !node.text;

  // Useful classes for Custom CSS.
  const textStyleClasses: string = useMemo(
    () =>
      node
        ? textStyleKeys.reduce(
            (acc, key) => acc + (node[key] ? `${key}-text ` : ''),
            ''
          )
        : '',
    [node]
  );

  const style = useMemo(() => {
    const result = getNodeStyle(node);
    if (!isNil(fontSize)) result.fontSize = px(fontSize);
    return result;
  }, [node, fontSize]);

  return (
    <>
      <span
        id={h1 || h2 ? node.text : undefined}
        style={style}
        className={cx(
          options?.alignment?.p && alignmentClasses[options.alignment.p],
          code &&
            options?.alignment?.code &&
            alignmentClasses[options.alignment.code],
          { 'font-inherit': !h1 && !h2 && !code },
          isEmpty || {
            'font-mono bg-code-block text-code-block whitespace-pre-wrap px-2 py-0.5 mx-1 rounded':
              code,
            'font-semibold text-xl': h1,
            'font-semibold text-lg': h2,
            italic,
            underline,
            'font-bold': bold,
          },
          textStyleClasses
        )}
      >
        {node.text || ZERO_WIDTH_NO_BREAK_SPACE}
      </span>
      {children}
    </>
  );
}
