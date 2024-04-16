import React, { useContext } from 'react';
import { CustomUIContext } from '../../../../providers/CustomUIProvider';

export default function Divider({ node, children, ...restProps }) {
  const { borderColor } = useContext(CustomUIContext);
  return (
    <div
      className="h-4"
      style={{
        margin: '16px 1px 0',
        width: '100%',
        borderTop: `2px solid ${borderColor || '#e0e0e0'}`,
      }}
      {...restProps}
    >
      {children}
    </div>
  );
}
