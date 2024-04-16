import React, { MouseEvent } from 'react';
import cx from 'classnames';

interface Props {
  onClick?: (e: MouseEvent) => void;
  direction: 'backward' | 'forward';
  className?: string;
}

const NavButton: React.FC<Props> = ({ onClick, direction, className }) => (
  <div
    className={cx(
      'absolute',
      'z-30',
      'top-0',
      'flex',
      'hover:opacity-80',
      'w-6',
      'h-full',
      'cursor-pointer',
      className
    )}
    onClick={onClick}
  >
    <div
      className={cx('m-auto', 'flex', 'bg-white', 'rounded-full', 'w-5', 'h-5')}
      style={{
        boxShadow:
          '0px 3px 5px rgba(0, 0, 0, 0.12), 0px 0px 7px rgba(0, 0, 0, 0.08)',
      }}
    >
      <svg
        className="dark:text-gray-900 m-auto w-2.5 h-2.5"
        width="8"
        height="14"
        viewBox={`${direction === 'forward' ? '-1' : '1'} 0 8 14`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {direction === 'forward' ? (
          <path
            d="M1 1L7 7L1 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M7 1L1 7L7 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  </div>
);

export default NavButton;
