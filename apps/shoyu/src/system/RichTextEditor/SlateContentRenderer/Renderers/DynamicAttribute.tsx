import React from 'react';
import { TextNode } from 'bento-common/types/slate';

interface DynamicAttributeNode {
  type: 'dynamic-attribute';
  children: TextNode[];
}

export interface DynamicAttributeProps {
  node: DynamicAttributeNode;
  children: any;
  attributes: any;
}

export default function DynamicAttribute({ children }) {
  return <div className="inline-block">{children}</div>;
}
