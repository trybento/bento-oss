import React, { useCallback, useMemo } from 'react';
import {
  NumberInput as ChakraNumberInput,
  NumberInputProps as DefaultNumberInputProps,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

export type NumberInputProps = Omit<
  DefaultNumberInputProps,
  'onChange' | 'invert'
> & {
  neverEmpty?: boolean;
  onChange?: (val: number) => void;
  minimalist?: boolean;
  transformValue?: {
    parse: (v: number) => number;
    format: (v: number | string) => number | string;
  };
  hideStepper?: boolean;
  disabled?: boolean;
};

const MINIMALIST_ICON_SIZE_PX = '18px';

const ensureNeverEmpty =
  (cb: (val: number) => void, enabled: boolean) =>
  (strValue: string, numValue: number) =>
    cb((enabled && !strValue) || isNaN(numValue) ? 0 : numValue);

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      neverEmpty,
      onChange,
      value,
      minimalist,
      transformValue = {
        parse: (v: number) => v,
        format: (v: number) => v,
      },
      hideStepper,
      placeholder,
      disabled,
      ...props
    }: NumberInputProps,
    ref
  ) => {
    const handleChange = useCallback(
      ensureNeverEmpty(
        (val) => onChange(transformValue.parse(val)),
        neverEmpty
      ),
      [transformValue, onChange, neverEmpty]
    );

    const [upProps, downProps] = useMemo(() => {
      if (minimalist) {
        const common = { border: '0px solid transparent' };

        return [
          {
            ...common,
            children: (
              <ChevronUpIcon
                w={MINIMALIST_ICON_SIZE_PX}
                h={MINIMALIST_ICON_SIZE_PX}
              />
            ),
          },
          {
            ...common,
            children: (
              <ChevronDownIcon
                w={MINIMALIST_ICON_SIZE_PX}
                h={MINIMALIST_ICON_SIZE_PX}
              />
            ),
          },
        ];
      }

      return [{}, {}];
    }, [minimalist]);

    return (
      <ChakraNumberInput
        borderColor="border"
        onChange={handleChange}
        bg="white"
        value={transformValue.format(value)}
        fontSize="sm"
        {...props}
        ref={ref}
      >
        <NumberInputField
          fontSize="inherit"
          borderRadius="base"
          placeholder={placeholder}
          disabled={disabled}
        />
        {!hideStepper && (
          <NumberInputStepper pointerEvents={disabled ? 'none' : undefined}>
            <NumberIncrementStepper {...upProps} />
            <NumberDecrementStepper {...downProps} />
          </NumberInputStepper>
        )}
      </ChakraNumberInput>
    );
  }
);

export default NumberInput;
