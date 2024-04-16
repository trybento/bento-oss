import React, { useMemo } from 'react';
import Select from 'system/Select';

const GroupConditionSelect = ({
  defaultValue,
  onChange,
  options,
  disabled = false,
}) => {
  const defaultOption = useMemo(
    () => options.find((option) => option.value === defaultValue),
    [defaultValue]
  );

  return (
    <Select
      isDisabled={disabled}
      isSearchable={false}
      defaultValue={defaultOption}
      onChange={onChange}
      options={options}
      defaultIndicator
      styles={{
        container: (provided) => ({
          ...provided,
          display: 'inline-block',
          width: '60px',
        }),
        valueContainer: (provided) => ({
          ...provided,
          paddingRight: 0,
        }),
        control: (provided) => ({
          ...provided,
          border: 'none',
          boxShadow: 'none',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          padding: 0,
          width: '20px',
        }),
        singleValue: (provided) => ({
          ...provided,
          textDecoration: 'underline',
        }),
      }}
    />
  );
};

export default GroupConditionSelect;
