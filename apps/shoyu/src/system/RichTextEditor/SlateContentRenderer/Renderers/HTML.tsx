import React from 'react';

interface HTMLNode {
  type: 'html';
  children: any;
}

interface HTMLProps {
  node: HTMLNode;
  children: any;
}

export default function HTML({ node }: HTMLProps) {
  return (
    <div className="text-center m-auto flex justify-center">
      <div dangerouslySetInnerHTML={{ __html: node.children?.[0]?.text }} />
    </div>
  );
}
