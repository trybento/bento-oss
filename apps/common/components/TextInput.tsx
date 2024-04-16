import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import cx from 'classnames';

import ErrorIcon from '../icons/Error';
import { px } from '../utils/dom';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';

export enum TextInputAs {
  input = 'input',
  textarea = 'textarea',
}

type Props = {
  onChange?: (value: string) => void;
  label?: string;
  isValid?: boolean;
  errorMessage?: string;
  disableAsText?: boolean;
  helperText?: ReactNode;
  className?: string;
  inputClassName?: string;
  placeholder?: string | null;
  icon?: ReactNode;
  rightIcon?: ReactNode;
} & Omit<
  | ({
      as?: TextInputAs.input;
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({
      as: TextInputAs.textarea;
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>),
  'onChange' | 'placeholder'
>;

const defaultWarningOffsetPx = 4;

const TextInput: FC<Props> = ({
  defaultValue = '',
  onChange,
  label,
  disabled,
  disableAsText = true,
  isValid = true,
  name,
  errorMessage = '',
  as = TextInputAs.input,
  helperText,
  required,
  className,
  inputClassName,
  icon,
  rightIcon,
  ...inputProps
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const showError = !isValid && !!errorMessage && !disabled;
  const id = `text-field-${name}`;
  const helperId = `text-field-helper-${name}`;

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
        {
          'pl-3': !icon,
          'pl-10': icon,
          'border-red-500': !isValid,
          'border-gray-300': isValid,
          'cursor-not-allowed': disabled,
        },
        inputClassName
      ),
    [inputClassName, isValid, disabled, icon]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange?.(e.target.value),
    [onChange]
  );

  const getWarningOffset = useCallback(() => {
    const offset = textareaRef.current
      ? textareaRef.current.offsetWidth - textareaRef.current.scrollWidth
      : 0;
    return px(
      offset < defaultWarningOffsetPx ? defaultWarningOffsetPx : offset
    );
  }, []);

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
        {disabled && disableAsText ? (
          <div
            className={cx('bento-input-field disabled text-sm', {
              'whitespace-pre-line': as === TextInputAs.textarea,
            })}
          >
            {defaultValue || '-'}
          </div>
        ) : (
          <div className="bento-input-field relative px-px">
            {as === TextInputAs.input ? (
              <input
                className={inputClasses}
                type="text"
                id={id}
                defaultValue={defaultValue}
                onChange={handleChange}
                aria-describedby={helperId}
                disabled={disabled}
                {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
              />
            ) : (
              <textarea
                ref={textareaRef}
                className={inputClasses}
                id={id}
                defaultValue={defaultValue}
                onChange={handleChange}
                aria-describedby={helperId}
                disabled={disabled}
                rows={2}
                {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              />
            )}
            {icon && (
              <div className="absolute inset-y-0 left-3 w-5 flex items-center pointer-events-none text-gray-500">
                {icon}
              </div>
            )}
            {rightIcon && (
              <div className="absolute inset-y-0 right-3 w-5 flex items-center text-gray-500">
                {rightIcon}
              </div>
            )}
            {!isValid && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-red-500"
                style={{ paddingRight: getWarningOffset() }}
              >
                <ErrorIcon style={{ width: '20px' }} />
              </div>
            )}
          </div>
        )}
        <InputHelper
          id={helperId}
          showError={showError}
          errorText={errorMessage}
          helperText={helperText}
        />
      </div>
    </div>
  );
};

export default TextInput;
