import React from 'react';

interface CodeBlockNode {
  type: 'code-block';
  children: any;
}

interface CodeBlockProps {
  node: CodeBlockNode;
  children: any;
}

export default function CodeBlock({ children }: CodeBlockProps) {
  return (
    <ol className="bento-code-block font-mono bg-code-block text-code-block rounded py-3 pl-5 pr-3 whitespace-pre-wrap mb-2 list-outside code-list-item">
      {children}
    </ol>
  );
}
