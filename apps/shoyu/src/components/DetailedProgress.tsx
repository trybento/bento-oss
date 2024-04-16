import React, { CSSProperties } from 'react';
import cx from 'classnames';
import { Theme } from 'bento-common/types';
import { Module, Step } from 'bento-common/types/globalShoyuState';
import { isTimelineTheme } from 'bento-common/data/helpers';

import ProgressBar from './ProgressBar';
import TimelineProgress from './layouts/timeline/TimelineProgress';

interface ProgressBarWithStepsProps {
  theme?: Theme;
  numCompletedSteps: number;
  totalNumSteps: number;
  module?: Module;
  combineModules?: boolean;
  selectedStep?: Step;
  progressStyle?: CSSProperties;
  showProgress?: boolean;
  showStepsCompleted?: boolean;
  className?: string;
}

export default function DetailedProgress({
  numCompletedSteps,
  totalNumSteps,
  theme = Theme.nested,
  module,
  combineModules,
  selectedStep,
  showProgress = true,
  progressStyle = {},
  showStepsCompleted = true,
  className,
}: ProgressBarWithStepsProps) {
  const isTimeline = isTimelineTheme(theme);
  return (
    <div className={cx('flex flex-col', { 'w-full': !isTimeline }, className)}>
      {showProgress && (
        <div className="w-full">
          {isTimeline ? (
            <TimelineProgress
              module={module}
              combineModules={combineModules}
              selectedStep={selectedStep}
            />
          ) : (
            <ProgressBar
              numerator={numCompletedSteps}
              denominator={totalNumSteps}
              style={progressStyle}
              slim
            />
          )}
        </div>
      )}
      {showStepsCompleted && (
        <div className="bento-detailed-progress flex text-xs mt-1">
          <div className="select-none">
            {numCompletedSteps} of {totalNumSteps} completed
          </div>
        </div>
      )}
    </div>
  );
}
