import React, { CSSProperties, FC } from 'react';
import { defaultEmailStyles } from './Layout';
interface Props {
  style?: CSSProperties;
}

const TextBlock: FC<React.PropsWithChildren<Props>> = ({ children, style }) => (
  <div
    style={{
      display: 'inline-block',
      paddingTop: defaultEmailStyles.paddingTop,
      ...style,
    }}
  >
    {children}
  </div>
);

export default TextBlock;
