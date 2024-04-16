import React, { CSSProperties } from 'react';

export interface DotsStyling {
  dotColor?: string;
}

interface Props extends DotsStyling {
  total: number;
  current: number;
  style?: CSSProperties;
}

const DotsIndicator: React.FC<Props> = ({
  total,
  current,
  dotColor = 'gray',
  style = {},
}) => {
  return (
    <div className="absolute w-full flex" style={style}>
      <div className="mx-auto flex gap-1">
        {[...Array(total)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-full w-2 h-2 border border-gray-300"
            style={{ background: idx === current ? dotColor : '#F5FAFE' }}
          />
        ))}
      </div>
    </div>
  );
};

export default DotsIndicator;
