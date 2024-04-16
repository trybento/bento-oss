import React, { useCallback, useMemo, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import theme from 'bento-common/frontend/theme';
import isEmail from 'is-email';
import { SelectOption } from 'bento-common/components/RichTextEditor/extensions/Select/withSelect';
import { removeWhiteSpaces } from 'bento-common/data/helpers';

interface EmailInputProps {
  onChange: (value: string) => void;
  defaultValue: string;
  disabledDomains?: string[];
  placeholder?: string;
}

export default function EmailInput({
  placeholder,
  defaultValue,
  disabledDomains = [],
  onChange,
}: EmailInputProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<SelectOption[]>(
    removeWhiteSpaces(defaultValue)
      .split(',')
      .filter(Boolean)
      .map((value) => ({ label: value, value }))
  );

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleChange = useCallback(
    (newValue) => {
      setOptions(newValue);
      onChange(
        newValue.reduce((acc, o) => acc + (acc ? ', ' : '') + o.value, '')
      );
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isMenuOpen) e.preventDefault();
    },
    [isMenuOpen]
  );

  const filterOptions = useCallback(
    (candidate: { label: string; value: string; data: any }, input: string) => {
      if (input) {
        const validEmail =
          isEmail(candidate.value) &&
          !disabledDomains.find((d) => candidate.value.endsWith(d));

        setIsMenuOpen(validEmail);
        return validEmail;
      }
      return true;
    },
    []
  );

  const styles = useMemo(
    () => ({
      multiValue: (styles) => ({
        ...styles,
        borderRadius: '9999px',
        padding: '0px 5px',
        backgroundColor: '#edf2f7',
        fontWeight: 600,
        color: '#1a202c',
      }),
      multiValueRemove: (styles) => ({
        ...styles,
        ':hover': {
          cursor: 'pointer',
          opacity: 0.8,
        },
      }),
      control: (provided) => ({
        ...provided,
        minHeight: '40px',
        border: `1px solid ${theme.colors.border}`,
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 1500,
      }),
    }),
    [theme]
  );

  const noop = useCallback(() => null, []);

  const formatCreateLabel = useCallback((input: string) => {
    return (
      <div>
        Add email: <span style={{ fontWeight: 600 }}>{input}</span>
      </div>
    );
  }, []);

  return (
    <CreatableSelect
      className="react-creatable-select-container"
      placeholder={placeholder}
      styles={styles}
      components={{
        DropdownIndicator: noop,
        IndicatorSeparator: noop,
      }}
      noOptionsMessage={noop}
      formatCreateLabel={formatCreateLabel}
      onChange={handleChange}
      defaultValue={options}
      onMenuClose={handleMenuClose}
      onKeyDown={handleKeyDown}
      filterOption={filterOptions}
      options={options}
      isMulti
    />
  );
}
