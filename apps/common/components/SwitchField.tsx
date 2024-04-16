import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  FormControl,
  FormLabel,
  BoxProps,
  FormHelperText,
  Switch,
  FormLabelProps,
  Checkbox,
} from '@chakra-ui/react';
import withFormikField from '../hocs/withFormikField';
import { stringToBoolean } from 'bento-common/utils/strings';
import { CHECKBOX_HOVERED_FILTER } from './Checkbox';

interface Option {
  value: string | number | boolean;
  label?: string;
  castResult?: number | string | boolean;
}

interface Props
  extends Omit<BoxProps, 'onChange' | 'defaultValue' | 'value' | 'as'> {
  checkedOption: Option;
  uncheckedOption: Option;
  label?: ReactNode;
  variant?: FormLabelProps['variant'];
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  showRequired?: boolean;
  defaultValue: string | number | boolean;
  as?: 'checkbox';
  onChange?: (value: string | number | boolean) => void;
}

const SwitchField = forwardRef<HTMLDivElement, Props>(
  (
    {
      checkedOption,
      uncheckedOption,
      label,
      helperText,
      defaultValue,
      onChange,
      fontSize = 'md',
      variant,
      required,
      showRequired,
      as,
      disabled,
      ...boxProps
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleChange = useCallback(() => {
      if (disabled) return;

      const { value: newValue, castResult } =
        defaultValue === checkedOption.value ? uncheckedOption : checkedOption;

      let castedValue: string | boolean | number = castResult
        ? String(newValue)
        : newValue;

      if (castResult) {
        castedValue = String(newValue);
        switch (castResult) {
          case 'boolean':
            castedValue = stringToBoolean(newValue as string);
            break;
          case 'number':
            castedValue = Number(newValue);
            break;
          default:
            castedValue = newValue;
            break;
        }
      } else {
        castedValue = newValue;
      }

      onChange(castedValue);
    }, [onChange, defaultValue, checkedOption, uncheckedOption, disabled]);

    const requiredLabel = useMemo(
      () => (showRequired ? (required ? '(Required)' : '(Optional)') : ''),
      [required, showRequired]
    );

    const hoverHandlers = useMemo(
      () => ({
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      }),
      []
    );

    const isChecked = defaultValue === checkedOption.value;

    return (
      <FormControl
        as="fieldset"
        display="flex"
        gridGap={as === 'checkbox' ? 2 : 0}
        isDisabled={disabled}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        onClick={handleChange}
        userSelect="none"
        ref={ref as any}
        {...hoverHandlers}
        {...boxProps}
      >
        {!!label && (
          <FormLabel as="legend" fontSize={fontSize} variant={variant}>
            {label} {requiredLabel}
          </FormLabel>
        )}
        {as === 'checkbox' ? (
          <Checkbox
            isChecked={isChecked}
            isDisabled={disabled}
            bg="white"
            my="auto"
            pointerEvents="none"
            filter={
              isHovered && isChecked ? CHECKBOX_HOVERED_FILTER : undefined
            }
          />
        ) : (
          <Switch
            size="md"
            isChecked={isChecked}
            isDisabled={disabled}
            mr="3"
            pointerEvents="none"
          />
        )}
        {isChecked
          ? checkedOption.label || uncheckedOption.label || ''
          : uncheckedOption.label || checkedOption.label || ''}
        {!!helperText && (
          <FormHelperText whiteSpace="nowrap" mt="unset">
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

export default withFormikField<Props>(SwitchField);
