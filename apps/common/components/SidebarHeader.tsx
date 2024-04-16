import React, { useMemo } from 'react';
import cx from 'classnames';

import {
  AllGuidesStyle,
  CompletionStyle,
  GuideHeaderCloseIcon,
  GuideHeaderProgressBar,
  GuideHeaderType,
} from '../types';
import { getHeaderStyleFlags } from '../utils/header';
import ArrowLeft from '../icons/ArrowLeft';
import { stopEvent } from '../utils/dom';
import { View } from '../types/shoyuUIState';
import {
  getViewFlags,
  isActiveGuidesView,
  isKbArticleView,
  isTicketView,
} from '../frontend/shoyuStateHelpers';
import EmojiSpacingFixWrapper from './EmojiSpacingFixWrapper';
import { COMPLETION_STYLE_CLASSES } from '../utils/constants';
import { Guide, Module, Step } from '../types/globalShoyuState';
import ProgressMeter from './ProgressMeter';
import { guideListConfig, viewToGuideListMap } from '../data/helpers';
import { isSkippedStep } from '../utils/steps';
import Minus from '../icons/Minus';
import Close from '../icons/Close';
import { KbArticle } from '../types/integrations';

export type SidebarHeaderProps = {
  type: GuideHeaderType;
  closeIcon?: GuideHeaderCloseIcon;
  progressBar?: GuideHeaderProgressBar;
  showModuleNameInStepView?: boolean;
  showGuideNameInStepView?: boolean;
  isFloating: boolean;
  draggable?: boolean;
  primaryColor: string;
  /**
   * Components to render between
   * the title and the close button.
   */
  guideTitleSibling?: React.ReactNode;
  secondaryColor: string;
  backgroundColor: string;
  classNames:
    | Partial<Record<'wrapper' | 'content' | 'title' | 'subtitle', string>>
    | undefined;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  view: View;
  allGuidesStyle: AllGuidesStyle;
  guide?: Guide;
  module?: Module;
  step?: Step;
  article?: KbArticle;
  stepCompletionStyle: CompletionStyle | null;
  onBack?: (e: React.MouseEvent<SVGElement>) => void;
  onClose?: (e: React.MouseEvent<HTMLDivElement>) => void;
  padding?: number;
};

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  (
    {
      type,
      closeIcon = GuideHeaderCloseIcon.minimize,
      progressBar,
      showModuleNameInStepView,
      showGuideNameInStepView,
      draggable,
      isFloating,
      primaryColor,
      guideTitleSibling,
      secondaryColor,
      backgroundColor,
      showBackButton,
      onBack,
      onClose,
      view,
      allGuidesStyle,
      guide,
      module,
      step,
      classNames,
      stepCompletionStyle,
      article,
      padding,
    },
    ref
  ) => {
    const { isClassicHeader, isBrightHeader, isStripedHeader, isSimpleHeader } =
      useMemo(() => getHeaderStyleFlags(type), [type]);

    const headerBackgroundColor = isClassicHeader
      ? secondaryColor
      : isBrightHeader
      ? primaryColor
      : backgroundColor;

    const isPrimaryBackgroundColor = headerBackgroundColor === primaryColor;

    const { isStepView, isGuideView } = useMemo(
      () => getViewFlags(view),
      [view]
    );

    const showGuideName = useMemo(
      () => isGuideView || showGuideNameInStepView,
      [isGuideView, showGuideNameInStepView]
    );

    const useCustomPadding = !showBackButton && typeof padding === 'number';

    return (
      <div className={cx(classNames?.wrapper, 'relative')}>
        <div
          ref={ref}
          className={cx(classNames?.content, {
            'px-4': !useCustomPadding,
            'border-t-8': isStripedHeader,
            'pt-1': isStripedHeader && isFloating,
            'pt-2': isStripedHeader && !isFloating,
            'text-xl font-semibold': isFloating,
            'text-base': !isFloating,
            'py-4': !isFloating && !isSimpleHeader,
            'py-3': isFloating || isSimpleHeader,
            'draggable-element cursor-move': draggable,
            'text-white': isPrimaryBackgroundColor,
          })}
          style={{
            backgroundColor: headerBackgroundColor,
            borderColor: primaryColor,
            zIndex: 2,
            padding: useCustomPadding ? padding : undefined,
          }}
        >
          <div className="flex items-center content-between">
            {showBackButton && (
              <div
                className={cx('m-auto', 'shrink-0', 'w-6', {
                  'mr-2': !isFloating,
                })}
              >
                <ArrowLeft
                  className="h-6 w-6 transition hover:opacity-60 fill-current cursor-pointer"
                  onClick={onBack}
                  onMouseDown={stopEvent}
                />
              </div>
            )}
            <div
              className={cx(
                'grow',
                'transition',
                'm-auto',
                'flex',
                'flex-col',
                'justify-center',
                'items-start',
                'overflow-hidden',
                { 'h-11': showModuleNameInStepView }
              )}
            >
              {showModuleNameInStepView && isStepView && module && (
                <div
                  className={cx(
                    classNames?.subtitle,
                    'text-xs font-normal text-opacity-70 truncate max-w-full'
                  )}
                >
                  {module.orderIndex + 1}.{' '}
                  <EmojiSpacingFixWrapper text={module.name} />
                </div>
              )}
              <div
                className={cx(
                  classNames?.title,
                  'truncate',
                  'font-semibold',
                  'text-lg',
                  'max-w-full',
                  {
                    [stepCompletionStyle
                      ? COMPLETION_STYLE_CLASSES[stepCompletionStyle]
                      : '']: step?.isComplete || guide?.isComplete,
                    'text-transparent': isStepView && !step?.name,
                  }
                )}
              >
                {isTicketView(view) ? (
                  'Report an issue'
                ) : isKbArticleView(view) && article.title ? (
                  article.title
                ) : isActiveGuidesView(view) ||
                  (isKbArticleView(view) && !article?.title) ? (
                  allGuidesStyle[
                    guideListConfig[viewToGuideListMap[View.activeGuides]].key
                  ]
                ) : (
                  <>
                    <EmojiSpacingFixWrapper
                      text={
                        showGuideName
                          ? guide?.name
                          : step
                          ? step.name || '-'
                          : ''
                      }
                    />
                    {isSkippedStep(step?.state) &&
                      !step.isComplete &&
                      !isGuideView && (
                        <span
                          style={{ userSelect: 'none' }}
                          className="text-sm mt-1 text-gray-400 ml-1 italic"
                        >
                          (Skipped)
                        </span>
                      )}
                  </>
                )}
              </div>
            </div>
            {showGuideName && guideTitleSibling}
            {isFloating && (
              <div className="flex justify-end shrink-0 text-gray-600 hover:text-gray-400 cursor-pointer w-1/12 py-2 self-start">
                <div
                  className={cx(
                    'flex',
                    'content-center',
                    'rounded',
                    'h-7',
                    'w-7',
                    'relative',
                    'p-1',
                    { 'bg-gray-100': headerBackgroundColor !== backgroundColor }
                  )}
                  onClick={onClose}
                >
                  {closeIcon === GuideHeaderCloseIcon.downArrow ? (
                    <ArrowLeft className="fill-current line-through -mt-2 -rotate-90" />
                  ) : closeIcon === GuideHeaderCloseIcon.minimize ? (
                    <Minus className="fill-current line-through m-auto" />
                  ) : closeIcon === GuideHeaderCloseIcon.x ? (
                    <Close className="fill-current line-through" />
                  ) : null}
                </div>
              </div>
            )}
          </div>
          {progressBar && (isGuideView || isStepView) && (
            <ProgressMeter
              primaryColorHex={
                isPrimaryBackgroundColor ? 'white' : primaryColor
              }
              completedSteps={guide?.completedStepsCount}
              totalSteps={guide?.totalSteps}
              type={progressBar}
              className="mt-2"
            />
          )}
        </div>
        {isBrightHeader && (
          <div className="w-full h-2 top-full left-0 absolute z-10">
            <div className="w-2 h-2 absolute left-0 top-0 overflow-hidden">
              <div
                className="rounded-tl-lg w-3 h-3 -ml-1 -mt-1"
                style={{ boxShadow: `4px 4px ${primaryColor} inset` }}
              />
            </div>
            <div className="w-2 h-2 absolute right-0 top-0 overflow-hidden">
              <div
                className="rounded-tr-lg w-3 h-3 -mr-1 -mt-1"
                style={{ boxShadow: `-4px 4px ${primaryColor} inset` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default SidebarHeader;
