import React, { useCallback, useState } from 'react';
import Multiselect from '../components/Dropdown/Multiselect';
import cx from 'classnames';

export interface SelectOptionProps {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOptionProps[];
  placeholder?: string;
  isMulti?: boolean;
  value?: string | string[];
  disabled?: boolean;
  handleChange?: (value: string | SelectOptionProps[]) => void;
}
const CLASSNAME = 'bento-dropdown';

const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  value,
  isMulti,
  handleChange,
  disabled,
  className,
  ...restProps
}: SelectProps) => {
  const [selectedValue, setSelectedValue] = useState<
    string | string[] | undefined
  >(value);

  const [selectedMultipleValue, setSelectedMultipleValue] = useState<
    string | SelectOptionProps[] | undefined
  >(value as any);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange && handleChange(e.target.value);
    setSelectedValue(e.target.value);
  };

  const onMultiSelectChange = (newValue) => {
    setSelectedMultipleValue(newValue);
  };

  const onMultiSelectClose = useCallback(() => {
    handleChange && handleChange(selectedMultipleValue!);
  }, [selectedMultipleValue]);

  return isMulti ? (
    <Multiselect
      defaultValue={value}
      onChange={onMultiSelectChange}
      onMenuClose={onMultiSelectClose}
      options={options!}
      isDisabled={disabled}
      className={cx(CLASSNAME, 'multi', className)}
    />
  ) : (
    <select
      className={cx(
        CLASSNAME,
        'transition',
        'duration-200',
        'font-base',
        'px-4',
        'h-10',
        'w-full',
        'border',
        'border-gray-200',
        'rounded',
        'overflow-hidden',
        'text-ellipsis',
        'bg-white',
        className
      )}
      defaultValue={selectedValue}
      onChange={onChange}
      disabled={disabled}
      {...restProps}
      style={{ fontSize: 'inherit' }}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {(options || []).map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
