import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useContext,
} from 'react';
import cx from 'classnames';

import { CustomUIContext } from '../../../../../providers/CustomUIProvider';

export default function Button({
  children,
  className = '',
  style = {},
  narrow = false,
  fullWidth = false,
  noMargin = false,
  ...restProps
}: {
  children: any;
  narrow?: boolean;
  fullWidth?: boolean;
  noMargin?: boolean;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const { primaryColorHex } = useContext(CustomUIContext);
  const { color, background, borderColor, ...restStyle } = style;

  return (
    <div
      className={cx('bento-step-content-button-wrapper text-center w-full', {
        'mt-6 mb-8': !noMargin,
      })}
      style={restStyle}
    >
      <button
        {...restProps}
        className={cx(
          `
          bento-step-content-button
          px-4
          hover:opacity-80
          active:opacity-60
          transition
          duration-200
          whitespace-nowrap
          relative
          select-none
          font-medium
          text-white
          align-middle
          rounded
          rounded-md
          `,
          {
            'w-full': fullWidth,
            'h-10 text-base': !narrow,
            'h-8 text-sm': narrow,
          },
          className
        )}
        style={{
          background: background || primaryColorHex,
          minWidth: '40px',
          color,
          borderColor,
        }}
        type="button"
      >
        {children}
      </button>
    </div>
  );
}
