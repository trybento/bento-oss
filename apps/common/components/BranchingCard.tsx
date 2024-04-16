import React, { useMemo } from 'react';
import cx from 'classnames';

import {
  BranchingCardStyle,
  CYOABackgroundImagePosition,
} from 'bento-common/types';
import { BranchingChoice } from 'bento-common/types/globalShoyuState';

import { px } from '../utils/dom';
import Done from '../icons/Done';
import { formatDate } from '../utils/dates';

type BranchingCardProps = {
  backgroundColor: string;
  choice: BranchingChoice;
  disabled?: boolean;
  fontSizeClass?: string;
  isBackgroundColorDark: boolean;
  isInline: boolean;
  maxWidth: number;
  minWidth: number;
  textColor: string;
  onClick: () => void;
};

const SELECTED_ICON_SIZE = 20;

const BranchingCard = ({
  backgroundColor,
  choice,
  disabled = false,
  fontSizeClass = 'text-base',
  isBackgroundColorDark,
  isInline,
  maxWidth,
  minWidth,
  textColor,
  onClick,
}: BranchingCardProps) => {
  const style = choice.style as BranchingCardStyle;

  const hasImage = !!style?.backgroundImageUrl;

  const imageSize = useMemo<string | undefined>(
    () =>
      style?.backgroundImagePosition !== CYOABackgroundImagePosition.background
        ? isInline
          ? '60px'
          : '45px'
        : undefined,
    [style?.backgroundImagePosition, isInline]
  );

  const isVerticalStack =
    hasImage &&
    isInline &&
    [
      CYOABackgroundImagePosition.top,
      CYOABackgroundImagePosition.bottom,
    ].includes(style?.backgroundImagePosition);

  const [
    isBackgroundImage,
    isLeftImage,
    isRightImage,
    isBotomImage,
    isTopImage,
  ] = [
    style?.backgroundImagePosition === CYOABackgroundImagePosition.background,
    style?.backgroundImagePosition === CYOABackgroundImagePosition.left ||
      (!isVerticalStack &&
        style?.backgroundImagePosition === CYOABackgroundImagePosition.top),
    style?.backgroundImagePosition === CYOABackgroundImagePosition.right ||
      (!isVerticalStack &&
        style?.backgroundImagePosition === CYOABackgroundImagePosition.bottom),
    style?.backgroundImagePosition === CYOABackgroundImagePosition.bottom &&
      isVerticalStack,
    style?.backgroundImagePosition === CYOABackgroundImagePosition.top &&
      isVerticalStack,
  ];

  const [flexDirClass, textAlignmentClass] =
    hasImage && !isBackgroundImage
      ? isLeftImage || isRightImage
        ? [undefined, 'text-left']
        : ['flex-col', 'text-center']
      : [undefined, 'text-center'];

  return (
    <div>
      <div
        key={choice.key}
        className={cx(
          'bento-cyoa-option',
          'flex',
          'relative',
          'p-4',
          'select-none',
          'rounded',
          'transition-all',
          'duration-75',
          fontSizeClass,
          'overflow-hidden',
          'font-medium',
          flexDirClass,
          {
            'option-complete': choice.targetData?.completedAt,
            'cursor-pointer': !disabled,
            'cursor-not-allowed': disabled,
            'dark-hover': isBackgroundColorDark,
            'dark-focus': isBackgroundColorDark && choice.selected,
            'hover:opacity-80': !isBackgroundColorDark,
            'opacity-90': !isBackgroundColorDark && choice.selected,
            'items-center': !hasImage,
            'flex-row-reverse': isRightImage,
            'flex-col-reverse': isBotomImage,
          }
        )}
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          minWidth: px(minWidth),
          maxWidth: px(maxWidth),
          height: isInline ? '140px' : '115px',
        }}
        onClick={onClick}
        title={choice.label}
      >
        {hasImage && (
          <div
            className={cx(
              'bento-cyoa-option-image',
              'flex',
              'items-center',
              'shrink-0',
              {
                'absolute w-full h-full left-0 top-0': isBackgroundImage,
                'h-full mr-4': isLeftImage,
                'h-full ml-4': isRightImage,
                'w-full justify-items-center mb-4': isTopImage,
                'w-full justify-items-center mt-4': isBotomImage,
              }
            )}
          >
            <div
              className={cx('flex', 'w-full', {
                'h-full': isBackgroundImage,
                'mx-auto': isTopImage || isBotomImage,
              })}
              style={{ width: imageSize, height: imageSize }}
            >
              <img
                className={cx('block', 'object-cover', 'w-full', 'h-full')}
                src={style?.backgroundImageUrl}
                alt=""
              />
            </div>
          </div>
        )}
        <div
          className={cx('my-auto', 'w-full', textAlignmentClass, {
            'line-clamp-1': isVerticalStack,
            'line-clamp-4': isInline && !isVerticalStack,
            'line-clamp-3': !isInline && !isVerticalStack,
          })}
          style={{ zIndex: 1 }}
        >
          {choice.label}
        </div>
        {choice.selected && !choice.targetData?.completedAt && (
          <div
            className="absolute right-1 top-1 rounded-full flex items-center"
            style={{
              backgroundColor: textColor,
              width: SELECTED_ICON_SIZE,
              height: SELECTED_ICON_SIZE,
              minWidth: SELECTED_ICON_SIZE,
              minHeight: SELECTED_ICON_SIZE,
              padding: '0px 3px 0 3px',
              color: 'inherit',
            }}
          >
            <div
              className="font-medium m-auto w-full"
              style={{ maxWidth: '18px' }}
            >
              <Done
                className="w-auto fill-current"
                style={{ color: backgroundColor }}
              />
            </div>
          </div>
        )}
      </div>
      {choice.targetData?.completedAt && (
        <div className="bento-branch-target flex flex-row flex-wrap mt-2 px-2 text-xs font-normal italic">
          <span className="max-w-full flex flex-row mr-1">
            "
            <span className="truncate" title={choice.targetData.name}>
              {choice.targetData.name}
            </span>
            "
          </span>
          <span className="whitespace-nowrap">
            completed on {formatDate(choice.targetData.completedAt)}
          </span>
        </div>
      )}
    </div>
  );
};

export default BranchingCard;
