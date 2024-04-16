import React, { FC, ReactNode, useCallback, useMemo } from 'react';

import {
  FormControl,
  FormLabel,
  BoxProps,
  FormHelperText,
  Box,
  FormLabelProps,
} from '@chakra-ui/react';
import useRandomKey from 'bento-common/hooks/useRandomKey';

import Select, {
  ExtendedSelectOptions,
  OptionWithSubLabel,
  SelectOptions,
  SelectProps,
} from 'system/Select';
import withFormikField, {
  WithFormikFieldContextProps,
} from 'components/hocs/withFormikField';

type Props = {
  options: ExtendedSelectOptions[];
  variant?: FormLabelProps['variant'];
  label?: ReactNode;
  isSearchable?: boolean;
  helperText?: ReactNode;
  defaultValue: number | string;
  alignment?: 'vertical' | 'horizontal';
  onChange?: (selection: SelectOptions) => void;
  selectWidth?: BoxProps['width'];
  disabled?: boolean;
} & Omit<BoxProps, 'onChange'> &
  Pick<
    SelectProps,
    'placeholder' | 'noOptionsMessage' | 'components' | 'isCreatable'
  >;

const SelectField: FC<Props & WithFormikFieldContextProps> = ({
  options,
  label,
  variant,
  isSearchable = false,
  alignment = 'vertical',
  helperText,
  isCreatable,
  placeholder,
  disabled,
  noOptionsMessage,
  defaultValue,
  components = {
    Option: OptionWithSubLabel({ color: 'icon.secondary' }),
  },
  selectWidth,
  onChange,
  isFormikContext,
  fontSize = 'sm',
  ...boxProps
}) => {
  const key = useRandomKey([options]);

  const selectedOption = useMemo<ExtendedSelectOptions>(
    () => options.find((o) => o.value === defaultValue),
    [defaultValue, options]
  );

  const handleChange = useCallback(
    (selection: SelectOptions) => {
      if (isFormikContext) {
        onChange(selection.value);
      } else {
        onChange(selection);
      }
    },
    [isFormikContext, onChange]
  );

  return (
    <FormControl
      as="fieldset"
      display="flex"
      flexDir={alignment === 'vertical' ? 'column' : 'row'}
      {...boxProps}
    >
      {!!label && (
        <FormLabel
          fontSize={fontSize}
          variant={variant}
          my={alignment === 'horizontal' ? 'auto' : undefined}
        >
          {label}
        </FormLabel>
      )}
      <Box
        ml={alignment === 'horizontal' ? 'auto' : undefined}
        my="auto"
        w={selectWidth}
      >
        <Select
          key={key}
          placeholder={placeholder}
          isSearchable={isSearchable}
          options={options}
          isCreatable={isCreatable}
          value={selectedOption}
          menuPlacement="auto"
          onChange={handleChange}
          isDisabled={disabled}
          components={components}
          noOptionsMessage={noOptionsMessage}
        />
      </Box>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default withFormikField<Props>(SelectField);
