import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Box,
  ChakraProps,
  Editable,
  EditableInput,
  EditablePreview,
  Text,
} from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import { getNextFocusProp } from 'hooks/useNextFocus';
import colors from 'helpers/colors';

interface Props extends ChakraProps {
  id?: string;
  nextFocusTargetId?: string;
  initialDisplayTitle?: string | null;
  onChange: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  shouldAutoFocus?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  errorMessage?: string;
}

// Note: having multiple inputs with shouldAutoFocus
// enabled will create a race condition.
const EditableLabel: React.FC<Props> = ({
  id,
  nextFocusTargetId,
  initialDisplayTitle,
  onChange,
  onFocus,
  onBlur,
  shouldAutoFocus,
  placeholder,
  isDisabled,
  errorMessage,
  ...rest
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    shouldAutoFocus && !isDisabled && inputRef.current?.focus();
  }, []);

  const debouncedChange = useCallback(
    debounce((newValue: string) => {
      onChange(newValue);
    }, 600),
    []
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const noop = useCallback(
    (
      e: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      e.stopPropagation();
      e.preventDefault();
    },
    []
  );

  return (
    <Editable
      color={initialDisplayTitle || isFocused ? '#1A202C' : '#c6ceda'}
      onChange={debouncedChange}
      onFocus={isDisabled ? noop : handleFocus}
      onBlur={isDisabled ? undefined : (handleBlur as any)}
      onClick={isDisabled ? noop : undefined}
      startWithEditView={!initialDisplayTitle && shouldAutoFocus}
      selectAllOnFocus={false}
      defaultValue={initialDisplayTitle || ''}
      placeholder={placeholder}
      isDisabled={isDisabled}
      position="relative"
      {...rest}
    >
      <Box>
        <EditableInput
          borderRadius="none"
          _focus={{
            outline: 'none',
            borderBottom: '1px solid #185ddc',
          }}
          {...getNextFocusProp(nextFocusTargetId)}
          ref={inputRef}
        />
        <EditablePreview
          id={id}
          borderRadius="none"
          borderBottom={
            errorMessage ? `1px solid ${colors.error.bright}` : undefined
          }
          w="full"
          display="block"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        />
      </Box>
      {errorMessage && !isFocused && (
        <Text
          pos="absolute"
          fontSize="xs"
          color="error.bright"
          fontWeight="normal"
        >
          {errorMessage}
        </Text>
      )}
    </Editable>
  );
};

export default EditableLabel;
