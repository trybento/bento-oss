import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import {
  BoxProps,
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
} from '@chakra-ui/react';
import NumberInput, { NumberInputProps } from 'system/NumberInput';
import withFormikField from '../../hocs/withFormikField';

/** TODO: Improve typing to avoid the need of passing 'inputProps' */
interface Props extends Omit<BoxProps, 'onChange' | 'defaultValue' | 'value'> {
  name: string;
  label?: ReactNode;
  variant?: FormLabelProps['variant'];
  onChange?: NumberInputProps['onChange'];
  helperText?: ReactNode;
  helperTextProps?: Omit<BoxProps, 'onChange'>;
  inputProps: Omit<NumberInputProps, 'onChange'>;
  required?: boolean;
  disabled?: boolean;
  showRequired?: boolean;
}

const NumberField: React.FC<Props> = ({
  name,
  label,
  fontSize = 'sm',
  inputProps,
  helperTextProps,
  onChange,
  disabled,
  helperText,
  variant,
  required,
  showRequired,
  ...boxProps
}) => {
  const { min, max } = inputProps;
  const [resetCount, setResetCount] = useState<number>(0);

  const handleChange = useCallback(
    debounce((newValue: number) => {
      if (disabled) return;

      const _newValue =
        max !== undefined && newValue > max
          ? max
          : min !== undefined && newValue < min
          ? min
          : newValue;

      onChange?.(_newValue);

      // Reset input if new value exceeds limits.
      if (newValue !== _newValue) {
        setResetCount((current) => current + 1);
      }
    }, 500),
    [onChange, min, max, disabled]
  );

  const requiredLabel = useMemo(
    () => (showRequired ? (required ? '(Required)' : '(Optional)') : ''),
    [required, showRequired]
  );

  return (
    <FormControl as="fieldset" isDisabled={disabled} {...boxProps}>
      {!!label && (
        <FormLabel as="legend" fontSize={fontSize} variant={variant}>
          {label} {requiredLabel}
        </FormLabel>
      )}
      <NumberInput
        key={`${name}-number-input-r${resetCount}`}
        onChange={handleChange}
        disabled={disabled}
        {...inputProps}
      />
      {!!helperText && (
        <FormHelperText {...helperTextProps}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default withFormikField<Props>(NumberField);
