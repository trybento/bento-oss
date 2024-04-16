import React from 'react';

const Footer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <>
    <div style={{ padding: '30px 0' }}>
      <div style={{ borderBottom: `1px solid #cbd5e0` }} />
    </div>
    <div
      style={{
        fontSize: '11px',
        color: '#8f8f8f',
      }}
    >
      {children}
    </div>
  </>
);

export default Footer;
