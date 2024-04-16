// This was taken from apps/shoyu/src/components/SidebarToggleTab/ProgressCircle.tsx
// and modified to work in the miso app
// Modifications:
// - Pass in colors/inverted with props instead of context
// - Update tailwind specific styles; text-xs

import React, { useContext } from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

interface ProgressCircleProps {
  numerator: number;
  denominator: number;
  toggleTextColor: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  isEmbedToggleColorInverted: boolean;
}

export default function ProgressCircle({
  numerator,
  denominator,
  toggleTextColor,
  primaryColorHex,
  secondaryColorHex,
  isEmbedToggleColorInverted,
}: ProgressCircleProps) {
  let circularProgressText: string;
  let circularProgressStyle = {
    fontSize: '12px',
    lineHeight: '16px',
    color: toggleTextColor,
  };
  if (denominator === 100) {
    circularProgressText = `${numerator}%`;
    circularProgressStyle = { ...circularProgressStyle, fontSize: '10px' };
  } else {
    circularProgressText = `${numerator}/${denominator}`;
    if (denominator > 9) {
      circularProgressStyle = { ...circularProgressStyle, fontSize: '10px' };
    }
  }

  if (isEmbedToggleColorInverted) {
    circularProgressStyle = { ...circularProgressStyle, color: '#fff' };
  }

  let progressPercentage: number;
  if (denominator === 0) {
    progressPercentage = 0;
  } else {
    progressPercentage = Math.round((numerator / denominator) * 100);
  }

  return (
    <CircularProgressbarWithChildren
      strokeWidth={15}
      styles={{
        path: {
          stroke: isEmbedToggleColorInverted ? 'white' : primaryColorHex,
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
      <div style={circularProgressStyle}>{circularProgressText}</div>
    </CircularProgressbarWithChildren>
  );
}
