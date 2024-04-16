import React, { ReactNode } from 'react';
import cx from 'classnames';

interface Props {
  className?: string;
  id?: string;
  showError?: boolean;
  helperText: ReactNode;
  errorText?: string;
}

const InputHelper: React.FC<Props> = ({
  id,
  className,
  helperText,
  showError,
  errorText,
}) => {
  return (
    <>
      {(showError || !!helperText) && (
        <span
          className={cx('text-xs', className, { 'text-red-500': showError })}
          id={id}
        >
          {showError ? errorText : helperText}
        </span>
      )}
    </>
  );
};

export default InputHelper;
