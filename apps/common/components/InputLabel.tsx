import React, { FC, LabelHTMLAttributes } from 'react';
import cx from 'classnames';

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const InputLabel: FC<Props> = ({
  children,
  required,
  className,
  ...restProps
}) => (
  <label
    className={cx(
      'bento-input-field-label font-semibold text-sm block mb-1',
      className
    )}
    {...restProps}
  >
    {children}
    {required ? '*' : ''}
  </label>
);

export default InputLabel;
