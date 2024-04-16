import React from 'react';

import DynamicIndicatorIcon from 'icons/Dynamic';

type Props = {
  style?: React.CSSProperties;
  label?: string;
};

const DynamicIcon: React.FC<Props> = ({ style }) => {
  return (
    <DynamicIndicatorIcon
      style={{
        width: '15px',
        height: '15px',
        display: 'inline',
        ...style,
      }}
    />
  );
};

export default DynamicIcon;
