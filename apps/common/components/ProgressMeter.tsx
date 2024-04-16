import React, { HTMLAttributes } from 'react';
import cx from 'classnames';
import { GuideHeaderProgressBar } from '../types';

export type ProgressMeterProps = {
  primaryColorHex: string;
  incompleteColorHex?: string;
  focusLastComplete?: boolean;
  totalSteps?: number;
  completedSteps?: number;
  type?: GuideHeaderProgressBar;
  className?: HTMLAttributes<HTMLDivElement>['className'];
};

export default function ProgressMeter({
  primaryColorHex,
  incompleteColorHex,
  focusLastComplete,
  totalSteps = 0,
  completedSteps = 0,
  type = GuideHeaderProgressBar.sections,
  className,
}: React.PropsWithChildren<ProgressMeterProps>) {
  // There is no point in showing the progress bar if
  // we have less than 2 steps in total
  if (totalSteps < 2) return null;

  return (
    <div
      className={cx(className, 'flex w-full h-2', {
        'gap-2': type === GuideHeaderProgressBar.sections,
      })}
    >
      {[...Array(totalSteps)].map((_, idx) => {
        const incomplete = idx >= completedSteps;
        const isCurrent = idx === completedSteps - 1;

        return (
          <div
            key={`progress-meter-part-${idx}`}
            className={cx(
              'transition',
              'flex-1',
              'first:rounded-l-full',
              'last:rounded-r-full',
              {
                'opacity-30':
                  (incomplete && !incompleteColorHex) ||
                  (focusLastComplete && !isCurrent && !incomplete),
              }
            )}
            style={{
              background: (incomplete && incompleteColorHex) || primaryColorHex,
            }}
          />
        );
      })}
    </div>
  );
}
