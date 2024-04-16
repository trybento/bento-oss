import React from 'react';

export default function ListItem({
  node,
  children,
  isFirst: _isFirst,
  isLast: _isLast,
  ...restProps
}) {
  return (
    <li className="leading-norma ml-4" {...restProps}>
      {children}
    </li>
  );
}
