import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';
import cx from 'classnames';
import InputLabel from './InputLabel';
import { isValidDate } from '../utils/dates';

type Props = {
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string | null;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'placeholder'
>;

const DateInput: FC<Props> = ({
  defaultValue = '',
  onChange,
  label,
  disabled,
  name,
  required,
  className,
  inputClassName,
  ...inputProps
}) => {
  const id = `date-field-${name}`;

  const inputClasses = useMemo(
    () =>
      cx(
        'text-sm',
        'bg-white',
        'text-gray-900',
        'w-full',
        'h-10',
        'pl-3',
        'pr-6',
        'placeholder-gray-400',
        'focus:shadow-outline',
        'border',
        'border-gray-300',
        {
          'cursor-not-allowed': disabled,
        },
        inputClassName
      ),
    [inputClassName, disabled]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const isNewValueValid = newValue && isValidDate(newValue);
      onChange?.(isNewValueValid ? newValue : '');
    },
    [onChange]
  );

  return (
    <div
      className={cx(
        'bento-input-field-wrapper flex flex-col gap-2 w-full',
        className
      )}
    >
      <div>
        {label && (
          <InputLabel htmlFor={id} required={required}>
            {label}
          </InputLabel>
        )}
        <div className="bento-input-field relative px-px">
          <input
            className={inputClasses}
            type="date"
            id={id}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={disabled}
            {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        </div>
      </div>
    </div>
  );
};

export default DateInput;
