import React, { useContext } from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

import { CustomUIContext } from '../providers/CustomUIProvider';

interface ProgressCircleProps {
  numerator: number;
  denominator: number;
}

export default function ProgressCircle({
  numerator,
  denominator,
}: ProgressCircleProps) {
  const { toggleColorHex, secondaryColorHex, isEmbedToggleColorInverted } =
    useContext(CustomUIContext);

  let circularProgressText: string | null = null;
  let circularProgressStyle = {};
  let shouldStackVertically = false;

  if (denominator === 100) {
    circularProgressText = `${numerator}%`;
    circularProgressStyle = { fontSize: '10px' };
  } else if (numerator > 9 && denominator > 9) {
    shouldStackVertically = true;
  } else {
    circularProgressText = `${numerator}/${denominator}`;
  }

  let progressPercentage: number;
  if (denominator === 0) {
    progressPercentage = 0;
  } else {
    progressPercentage = Math.round((numerator / denominator) * 100);
  }

  return (
    <CircularProgressbarWithChildren
      className="circular-progress"
      strokeWidth={15}
      styles={{
        path: {
          stroke: isEmbedToggleColorInverted ? 'white' : toggleColorHex,
          strokeLinecap: 'butt',
          transition: 'stroke-dashoffset 1.2s cubic-bezier(0.1, 0.9, 0.32, 1)',
        },
        trail: {
          stroke: isEmbedToggleColorInverted
            ? 'rgba(255, 255, 255, 0.4)'
            : secondaryColorHex,
        },
      }}
      value={progressPercentage}
    >
      {shouldStackVertically ? (
        <span style={{ fontSize: '10px' }}>
          <div>{numerator}</div>
          <div style={{ borderTop: '1px solid' }}>{denominator}</div>
        </span>
      ) : (
        <div
          className="text-xs circular-progress-text"
          style={circularProgressStyle}
        >
          {circularProgressText}
        </div>
      )}
    </CircularProgressbarWithChildren>
  );
}
