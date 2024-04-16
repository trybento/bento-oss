import React, { CSSProperties, useContext } from 'react';
import cx from 'classnames';

import { CustomUIContext } from '../providers/CustomUIProvider';

type ProgressBarProps = {
  numerator: number;
  denominator: number;
  isOutlined?: boolean;
  slim?: boolean;
  style?: CSSProperties;
};

export default function ProgressBar({
  numerator,
  denominator,
  isOutlined,
  slim,
  style = {},
}: ProgressBarProps) {
  const { primaryColorHex, secondaryColorHex } = useContext(CustomUIContext);

  let progressPercentage: number;
  if (denominator === 0) {
    progressPercentage = 0;
  } else {
    progressPercentage = Math.round((numerator / denominator) * 100);
  }

  if (progressPercentage === 0) progressPercentage = 1;

  return (
    <div
      className={cx(
        'relative',
        'w-full',
        'rounded-full',
        'overflow-hidden',
        'bento-progress-bar',
        'mt-3',
        {
          'h-1': slim,
          'h-4': !slim,
          border: isOutlined,
        }
      )}
      style={{
        borderColor: primaryColorHex,
        ...style,
      }}
    >
      <div
        className="w-full h-full absolute"
        style={{
          backgroundColor: isOutlined ? 'inherit' : secondaryColorHex,
        }}
      ></div>
      <div
        className={cx('h-full relative', {
          slanted: progressPercentage > 1,
        })}
        style={{
          backgroundColor: primaryColorHex,
          width: `${progressPercentage}%`,
          transition: 'all 1.2s cubic-bezier(0.1, 0.9, 0.32, 1)',
        }}
      ></div>
    </div>
  );
}
