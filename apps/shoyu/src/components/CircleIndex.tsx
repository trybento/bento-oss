import React, { useCallback, useContext, useState } from 'react';
import cx from 'classnames';
import { CustomUIContext } from '../providers/CustomUIProvider';
import Done from '../icons/done.svg';
import { px } from '../lib/helpers';

export enum CircleIndexSize {
  xl = 'xl',
  lg = 'lg',
  md = 'md',
}

type CircleIndexProps = {
  isComplete?: boolean;
  index?: string | number;
  size?: CircleIndexSize;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  bgColor?: string;
  disabled?: boolean;
};

const STYLING = {
  [CircleIndexSize.md]: {
    fontSizeClass: 'text-sm',
    circleSizePx: 24,
    doneSizePx: 18,
  },
  [CircleIndexSize.lg]: {
    fontSizeClass: 'text-base',
    circleSizePx: 32,
    doneSizePx: 18,
  },
  [CircleIndexSize.xl]: {
    fontSizeClass: 'text-base',
    circleSizePx: 40,
    doneSizePx: 24,
  },
};

const CircleIndex = ({
  isComplete,
  index,
  size = CircleIndexSize.md,
  className = '',
  onClick,
  disabled,
  bgColor = '',
}: CircleIndexProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { secondaryColorHex, primaryColorHex } = useContext(CustomUIContext);
  const clickeable = !!onClick;

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  /**
   * NOTE: Tooltip removed until a better solution
   * with more control for logic and styling is found.
   */
  // const tooltipLabel =
  //   clickeable && !isComplete ? 'Mark step as complete' : undefined;

  return (
    <>
      <div
        className={cx('rounded-full', 'flex', 'items-center', className, {
          completed: isComplete,
          'text-white': isComplete,
          'bg-gray-400': isComplete,
          'text-gray-900': !isComplete,
          'bg-gray-100': !isComplete,
          'cursor-pointer': onClick && !disabled,
          'hover:opacity-80': onClick && isComplete,
        })}
        style={{
          ...(!isComplete && { backgroundColor: bgColor || secondaryColorHex }),
          ...(clickeable && isComplete && { backgroundColor: primaryColorHex }),
          width: px(STYLING[size].circleSizePx),
          height: px(STYLING[size].circleSizePx),
          minWidth: px(STYLING[size].circleSizePx),
          minHeight: px(STYLING[size].circleSizePx),
          padding: '0px 3px 0 3px',
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // data-tip={tooltipLabel}
        // data-delay-show="500"
        // data-arrow-color="transparent"
        // data-place="top"
        // data-offset="{ 'top': 5 }"
      >
        <div
          className={`${STYLING[size].fontSizeClass} font-medium m-auto w-full`}
          style={{ maxWidth: px(STYLING[size].doneSizePx) }}
        >
          {isComplete || (isHovered && clickeable && !disabled) ? (
            <Done
              className="w-auto color-black fill-current"
              style={{
                ...(clickeable && {
                  color: isComplete ? 'white' : primaryColorHex,
                }),
              }}
            />
          ) : (
            <div className="block w-full text-center">{index}</div>
          )}
        </div>
      </div>
      {/* {!!tooltipLabel && <Tooltip />} */}
    </>
  );
};

export default CircleIndex;
