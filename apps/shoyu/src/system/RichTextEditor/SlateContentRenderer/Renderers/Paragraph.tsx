import React from 'react';
import cx from 'classnames';
import { AlignmentEnum } from 'bento-common/types';
import { getNodeStyle } from '../helpers';
import { SlateRendererProps } from 'bento-common/types/slate';

interface ParagraphNode {
  type: 'paragraph';
  children: any;
  alignment?: AlignmentEnum;
}

interface ParagraphProps extends SlateRendererProps {
  node: ParagraphNode;
}

export default function Paragraph({
  children,
  node,
  isLast,
  isFirst,
}: ParagraphProps) {
  const style = getNodeStyle(node);

  return (
    // We use a div instead of p because Slate collects children of different types
    // under paragraphs. A div is not a valid child of p, so we must use div.
    <div
      className={cx('bento-paragraph leading-normal', {
        'mb-2': !isLast,
        'mt-2': !isFirst,
      })}
      style={{ fontSize: 'inherit', lineHeight: 'inherit', ...style }}
    >
      {children}
    </div>
  );
}
