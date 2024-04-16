import React, { useCallback, useContext, useMemo, useState } from 'react';
import cx from 'classnames';
import { Guide } from 'bento-common/types/globalShoyuState';
import { fromNow } from 'bento-common/utils/dates';
import { pluralize } from 'bento-common/utils/pluralize';
import { isAnnouncement } from 'bento-common/data/helpers';

import { GuideCardDetails } from '../../../types/global';
import { CustomUIContext } from '../../providers/CustomUIProvider';
import { isTooltip } from '../../lib/formFactors';
import DetailedProgress from '../DetailedProgress';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  withBorder?: boolean;
};

export function ActiveGuidesCard({
  className,
  style,
  children,
  withBorder = true,
  ...props
}: React.PropsWithChildren<CardProps>) {
  return (
    <div
      className={cx(
        'rounded',
        'flex',
        'cursor-pointer',
        'transition-all',
        'duration-75',
        'text-current',
        className,
        { 'border border-gray-100 bg-white': withBorder }
      )}
      style={{
        boxShadow: withBorder ? '0px 4px 8px rgba(0, 0, 0, 0.08)' : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function ActiveGuidesCardTitle({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span
      className={cx(
        'text-sm',
        'truncate',
        'font-semibold',
        'my-auto',
        'select-none',
        'text-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type GuideCardProps = {
  guide: Guide;
  guideDetails: GuideCardDetails;
  onClick: React.EventHandler<React.MouseEvent>;
  className?: string;
  style?: React.CSSProperties;
};

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  guideDetails,
  className,
  style,
  onClick,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const { primaryColorHex, fontColorHex } = useContext(CustomUIContext);

  const doneOrComplete = guide.completedAt || guide.doneAt || guide.savedAt;
  const announcement =
    isAnnouncement(guide.designType) || isTooltip(guide.formFactor);

  const statusLabel = announcement
    ? guide.completedAt || guide.doneAt
      ? 'Last viewed'
      : 'Saved'
    : guide.completedAt
    ? 'Completed'
    : guide.doneAt
    ? 'Done'
    : '';

  /**
   * Should be hidden for announcements (modals and banners),
   * tooltips and any other single step guide (onboarding or contextual).
   */
  const shouldShowProgress = useMemo<boolean>(
    () => (announcement ? false : guide.totalSteps > 1),
    [announcement, guide.totalSteps]
  );

  return (
    <ActiveGuidesCard
      className={cx('flex-col', className)}
      style={style}
      onClick={onClick}
      onMouseEnter={useCallback(() => setHovered(true), [])}
      onMouseLeave={useCallback(() => setHovered(false), [])}
    >
      <div className={cx('flex', 'truncate', 'border-b', 'border-gray-100')}>
        <div className="flex w-full p-4 truncate">
          <ActiveGuidesCardTitle
            className="bento-resource-center-card-title"
            title={guide.name}
            style={{
              ...(hovered && { color: primaryColorHex }),
            }}
          >
            {guide.name}{' '}
            {!guide.isViewed && (
              <span
                className="font-semibold ml-1 text-sm"
                style={{
                  color: primaryColorHex || 'text-gray-400',
                  animation: 'fadeIn 1s ',
                  animationTimingFunction: 'ease-in',
                  animationDelay: '1s',
                }}
              >
                NEW!
              </span>
            )}
          </ActiveGuidesCardTitle>
        </div>
      </div>
      <div className="flex flex-col px-4 pt-2 text-xs flex-1 gap-1 text-gray-600 bento-resource-center-card-body">
        {guideDetails.description ? (
          <div
            className={cx(
              'line-clamp-2',
              'bento-resource-center-card-description'
            )}
          >
            {guideDetails.description}
          </div>
        ) : (
          <>
            {(doneOrComplete
              ? [
                  {
                    label: 'First step',
                    value: guideDetails.firstStepName,
                    labelClass:
                      'bento-resource-center-completed-card-first-step-label',
                    contentClass:
                      'bento-resource-center-completed-card-first-step-content',
                  },
                  {
                    label: 'Last step',
                    value: guideDetails.lastStepName,
                    labelClass:
                      'bento-resource-center-completed-card-last-step-label',
                    contentClass:
                      'bento-resource-center-completed-card-last-step-content',
                  },
                ]
              : [
                  {
                    label: 'Next step',
                    value: '',
                    labelClass:
                      'bento-resource-center-active-card-next-step-label',
                  },
                  {
                    label: '',
                    value: guideDetails.firstIncompleteStep?.name,
                    contentClass:
                      'bento-resource-center-active-card-next-step-content',
                  },
                ]
            ).map((row, i) => (
              <div
                key={`${row.label}-${row.value}-${i}`}
                className={cx('truncate', row.labelClass)}
              >
                {row.label && (
                  <>
                    <span className="font-semibold underline">
                      {row.label}:
                    </span>{' '}
                  </>
                )}
                <span className={cx(row.contentClass)}>{row.value}</span>
              </div>
            ))}
          </>
        )}
      </div>
      <div className={cx('px-4 pb-3 pt-4')}>
        <div
          className={cx('flex text-xs h-7', {
            'text-gray-500': !fontColorHex,
            'text-current': fontColorHex,
          })}
        >
          {doneOrComplete ? (
            <>
              {!announcement && (
                <div
                  className={cx(
                    'my-auto',
                    'bento-resource-center-completed-card-step-count'
                  )}
                >
                  {guide.totalSteps || 0}{' '}
                  {pluralize(guide.totalSteps || 0, 'step')}
                </div>
              )}
              {statusLabel && (
                <div
                  className={cx(
                    'ml-auto',
                    'my-auto',
                    'italic',
                    'bento-resource-center-card-date-data'
                  )}
                >
                  {statusLabel}:{' '}
                  {fromNow(
                    guide.completedAt! || guide.doneAt! || guide.savedAt!
                  )}
                </div>
              )}
            </>
          ) : shouldShowProgress ? (
            <DetailedProgress
              className="bento-resource-center-card-progress-bar"
              totalNumSteps={guide.totalSteps || 0}
              numCompletedSteps={guide.completedStepsCount || 0}
              progressStyle={{ marginTop: 0 }}
            />
          ) : null}
        </div>
      </div>
    </ActiveGuidesCard>
  );
};
