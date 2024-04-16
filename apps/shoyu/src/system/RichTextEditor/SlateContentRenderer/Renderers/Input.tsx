import React from 'react';
import { getNodeStyle } from '../helpers';

export interface InputProps {
  node: any;
  children?: any;
  onChange?: () => void;
}

export default function Input({ node, onChange, ...restProps }: InputProps) {
  const handleChange = () => {
    onChange && onChange();
  };

  const style = getNodeStyle(node);
  const placeholder = node.children?.[0]?.text;
  const isMultiline = !!node.isMultiline;

  return (
    <div className="w-full mt-6 mb-8 flex justify-center" {...restProps}>
      {isMultiline ? (
        <textarea
          className="transition duration-200 font-base px-4 w-72 border-gray-100 border rounded rounded-md"
          placeholder={placeholder}
          onChange={handleChange}
          rows={3}
          style={{
            width: '280px',
            ...style,
          }}
        />
      ) : (
        <input
          type="text"
          className="transition duration-200 font-base px-4 h-10 w-72 border-gray-100 border rounded rounded-md"
          placeholder={placeholder}
          onChange={handleChange}
          width="280px"
          style={style}
        />
      )}
    </div>
  );
}
