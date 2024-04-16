import React, { CSSProperties, FC, PropsWithChildren } from 'react';

export const defaultEmailStyles: CSSProperties = {
  background: '#f5f5f5',
  paddingTop: '15px',
};

const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div
      style={{
        background: defaultEmailStyles.background,
        fontFamily: 'Helvetica,Arial,sans-serif',
        fontSize: '14px',
      }}
    >
      <div style={{ margin: '0 auto', maxWidth: '582px', padding: '20px 0' }}>
        <div
          style={{
            width: '100%',
            background: 'white',
            borderRadius: '7px',
            padding: '10px 0',
          }}
        >
          <div
            style={{
              borderBottom: `1px solid ${defaultEmailStyles.background}`,
              padding: '20px 0',
            }}
          />
          <div style={{ padding: '20px 30px' }}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
