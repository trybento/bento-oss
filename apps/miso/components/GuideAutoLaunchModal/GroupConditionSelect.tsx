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
      menuPlacement="bottom"
      styles={{
        container: (provided) => ({
          ...provided,
          display: 'inline-block',
          width: '55px',
          margin: '0 4px',
        }),
        valueContainer: (provided) => ({
          ...provided,
          padding: 0,
          justifyContent: 'center',
        }),
        control: (provided) => ({
          ...provided,
          minHeight: '1.2em',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          padding: 0,
          width: '20px',
          transform: 'translateX(-25%)',
        }),
        singleValue: (provided) => ({
          ...provided,
          fontWeight: 500,
        }),
        menu: (provided) => ({
          ...provided,
          marginTop: '-5px',
        }),
      }}
    />
  );
};

export default GroupConditionSelect;
