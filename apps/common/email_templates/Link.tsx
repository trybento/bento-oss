import React, { AnchorHTMLAttributes, CSSProperties, FC } from 'react';

interface Props extends Omit<AnchorHTMLAttributes<{}>, 'style'> {
  style?: CSSProperties;
}

const Link: FC<Props> = ({ children, style, ...props }) => (
  <a
    target="_blank"
    style={{ color: '#2a9edb', textDecoration: 'none', ...style }}
    {...props}
  >
    {children}
  </a>
);

export default Link;
