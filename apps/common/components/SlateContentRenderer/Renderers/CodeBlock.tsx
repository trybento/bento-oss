import React from 'react';

interface CodeBlockNode {
  type: 'code-block';
  children: any;
}

interface CodeBlockProps {
  node: CodeBlockNode;
  children: any;
}

export default function CodeBlock({ node, children }) {
  return (
    <ol className="font-mono bg-code-block text-code-block rounded py-3 pl-10 pr-3 whitespace-pre-wrap mb-2 list-decimal list-outside">
      {children}
    </ol>
  );
}
