import React from 'react';
import { RenderLeafProps } from 'slate-react';
import { TextNode } from 'bento-common/types/slate';

interface LeafProps extends RenderLeafProps {
  leaf: TextNode;
  children: React.ReactNode;
}

const HEADER_LINE_HEIGHT = '1.5em';
const HEADER_MARGINS = '0.6em 0';

/** Wrapper around the actual text nodes */
export default function Leaf({
  attributes,
  children,
  leaf,
}: LeafProps): JSX.Element {
  let kids = children;
  if (leaf.bold) {
    kids = <strong>{kids}</strong>;
  }
  if (leaf.italic) {
    kids = <em>{kids}</em>;
  }
  if (leaf.underline) {
    kids = <u>{kids}</u>;
  }
  if (leaf.strikethrough) {
    kids = <s>{kids}</s>;
  }
  if (leaf.code) {
    kids = (
      <code className="font-mono bg-code-block text-code-block whitespace-pre-wrap rounded px-2 py-0.5 mx-1">
        {kids}
      </code>
    );
  }

  const headerCommonStyles: React.CSSProperties = {
    margin: HEADER_MARGINS,
  };

  let style: React.CSSProperties = {};

  if (leaf.h1) {
    style = {
      fontSize: '2em',
      lineHeight: HEADER_LINE_HEIGHT,
      fontWeight: 700,
      ...headerCommonStyles,
    };
  }
  if (leaf.h2) {
    style = {
      fontSize: '1.5em',
      lineHeight: HEADER_LINE_HEIGHT,
      fontWeight: 600,
      ...headerCommonStyles,
    };
  }

  if (leaf.color) style = { ...style, color: leaf.color };

  return (
    <span style={style} {...attributes}>
      {kids}
    </span>
  );
}
