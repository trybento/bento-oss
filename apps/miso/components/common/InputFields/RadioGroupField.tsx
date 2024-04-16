import React, { ReactNode, useCallback } from 'react';

import {
  FormControl,
  FormLabel,
  BoxProps,
  RadioProps,
  FormHelperText,
  FormLabelProps,
} from '@chakra-ui/react';
import RadioGroup, { RadioGroupProps } from 'system/RadioGroup';
import Radio from 'system/Radio';
import { useFormikContext } from 'formik';
import { stringToBoolean } from 'bento-common/utils/strings';
import useRandomKey from 'bento-common/hooks/useRandomKey';

const RadioGroupField: React.FC<
  {
    options: {
      value: RadioProps['value'];
      label: ReactNode;
      as?: number | string | boolean | null;
    }[];
    name: string;
    label?: ReactNode;
    variant?: FormLabelProps['variant'];
    helperText?: ReactNode;
    disabled?: boolean;
    defaultValue?: number | string;
    value?: number | string;
    alignment?: RadioGroupProps['alignment'];
    optionMr?: RadioProps['mr'];
    castResult?: 'boolean' | 'number';
    onChange?: (value: string | number | boolean) => void;
  } & Omit<BoxProps, 'onChange'>
> = ({
  options,
  name,
  label,
  variant,
  helperText,
  defaultValue,
  value,
  disabled,
  onChange,
  castResult,
  fontSize = 'md',
  optionMr = 6,
  alignment = 'vertical',
  ...boxProps
}) => {
  const { setFieldValue } = useFormikContext();
  const key = useRandomKey([options]);

  const handleChange = useCallback(
    (newValue: string) => {
      if (disabled) return;
      let castedValue: string | boolean | number;
      switch (castResult) {
        case 'boolean':
          castedValue = stringToBoolean(newValue);
          break;
        case 'number':
          castedValue = Number(newValue);
          break;
        default:
          castedValue = newValue;
          break;
      }

      if (onChange) {
        onChange(castedValue);
        return;
      }
      setFieldValue(name, castedValue);
    },
    [setFieldValue, name, onChange, castResult, disabled]
  );

  return (
    <FormControl as="fieldset" isDisabled={disabled} {...boxProps}>
      {label && (
        <FormLabel as="legend" fontSize={fontSize} variant={variant}>
          {label}
        </FormLabel>
      )}
      <RadioGroup
        key={`radio-group-${key}`}
        defaultValue={String(defaultValue)}
        value={value}
        onChange={handleChange}
        alignment={alignment}
        pointerEvents={disabled ? 'none' : undefined}
      >
        {options.map((option) => (
          <Radio
            key={`radio-${name}-${option.value}`}
            name={name}
            bg="white"
            value={option.value}
            label={option.label}
            mr={optionMr}
          />
        ))}
      </RadioGroup>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default RadioGroupField;
