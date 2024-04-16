import {
  BoxProps,
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import DynamicAttributeInput from 'bento-common/components/ModalDynamicAttribute/DynamicAttributeInput';
import UrlInput, { UrlInputProps } from 'bento-common/components/UrlInput';
import { Attribute } from 'bento-common/types';
import debounce from 'lodash/debounce';
import React, { ChangeEvent, FC, ReactNode, useCallback, useMemo } from 'react';

import { QUERY_DEBOUNCE_DELAY } from '~src/components/helpers/constants';
import withFormikField from '~src/hocs/withFormikField';
import colors from '~src/ui/colors';

export enum TextFieldInputType {
  text = 'text',
  dynamic = 'dynamic',
  url = 'url',
}

export interface TextFieldProps extends Omit<BoxProps, 'onChange'> {
  attributes: Attribute[];
  label?: ReactNode;
  variant?: FormLabelProps['variant'];
  helperText?: ReactNode;
  helperTextProps?: Omit<BoxProps, 'onChange'>;
  placeholder?: string;
  inputLeftElement?: ReactNode;
  inputRightElement?: ReactNode;
  disabled?: boolean;
  onChange?: (value: string) => void;
  defaultValue?: string;
  required?: boolean;
  showRequired?: boolean;
  autoFocus?: boolean;
  /** wether to use the dynamic attributes input or not */
  inputType?: TextFieldInputType;
  /** Only for URL fields */
  urlOptions?: Omit<
    UrlInputProps,
    'onContentChange' | 'disabled' | 'initialUrl' | 'inputStyle'
  >;
  isInvalid?: boolean;
  errorMessage?: string;
}

const TextField: FC<TextFieldProps> = ({
  attributes,
  label,
  variant,
  fontSize = 'md',
  defaultValue,
  helperText,
  helperTextProps,
  placeholder,
  onChange,
  disabled,
  required,
  inputType,
  urlOptions,
  isInvalid,
  autoFocus,
  showRequired,
  inputLeftElement,
  errorMessage,
  inputRightElement,
  ...boxProps
}) => {
  const handleChange = useCallback(
    debounce((newValue: string) => {
      if (disabled) return;
      onChange(newValue);
    }, QUERY_DEBOUNCE_DELAY),
    [onChange, disabled],
  );

  const handleInput = useCallback(
    (v: ChangeEvent<HTMLInputElement> | string) => {
      handleChange(typeof v === 'string' ? v : v.target.value);
    },
    [handleChange],
  );

  const requiredLabel = useMemo(
    () => (showRequired ? (required ? '(Required)' : '(Optional)') : ''),
    [required, showRequired],
  );

  const showErrorState = !!errorMessage && isInvalid;

  return (
    <FormControl as="fieldset" isDisabled={disabled} {...boxProps}>
      {!!label && (
        <FormLabel as="legend" fontSize={fontSize} variant={variant}>
          {label} {requiredLabel}
        </FormLabel>
      )}
      <InputGroup>
        {inputLeftElement && (
          <InputLeftElement pointerEvents="none" color="gray.500">
            {inputLeftElement}
          </InputLeftElement>
        )}
        {inputRightElement && (
          <InputRightElement pointerEvents="none" color="gray.500">
            {inputRightElement}
          </InputRightElement>
        )}
        {inputType === TextFieldInputType.dynamic ? (
          <DynamicAttributeInput
            attributes={attributes}
            initialValue={defaultValue}
            onContentChange={handleInput}
            disabled={disabled}
            fontSize={fontSize}
            inputStyle={{
              borderRadius: '4px',
              borderColor: colors.gray[200],
              width: 'inherit',
            }}
            w={boxProps.w ?? boxProps.width}
            autoFocus={autoFocus}
            minW={boxProps.minW ?? boxProps.minWidth}
            maxW={boxProps.maxW ?? boxProps.maxWidth}
          />
        ) : inputType === TextFieldInputType.url ? (
          <UrlInput
            attributes={attributes}
            initialUrl={defaultValue}
            onContentChange={handleInput}
            disabled={disabled}
            fontSize={fontSize}
            inputStyle={{
              borderRadius: '4px',
              borderColor: isInvalid ? 'red' : undefined,
              width: 'inherit',
            }}
            w={boxProps.w ?? boxProps.width}
            minW={boxProps.minW ?? boxProps.minWidth}
            maxW={boxProps.maxW ?? boxProps.maxWidth}
            autoFocus={autoFocus}
            {...urlOptions}
          />
        ) : (
          <Input
            fontSize={fontSize}
            onChange={handleInput}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            borderColor={isInvalid ? colors.error.bright : undefined}
            h={boxProps.h ?? boxProps.height}
          />
        )}
      </InputGroup>
      {!!helperText && !showErrorState && (
        <FormHelperText {...helperTextProps}>{helperText}</FormHelperText>
      )}
      {showErrorState && (
        <FormHelperText color={colors.error.bright}>
          {errorMessage}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default withFormikField<TextFieldProps>(TextField);
