import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  BoxProps,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
} from '@chakra-ui/react';
import Tooltip from 'system/Tooltip';
import useDebouncedInput from 'hooks/useDebouncedInput';

interface NameInputEditableControlProps
  extends Omit<BoxProps, 'onChange' | 'defaultValue' | 'onBlur'> {
  tooltipLabel?: string;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  inputWidth?: BoxProps['w'];
  siblingComponent?: React.ReactNode;
  /** For save on blur. Will reset touched */
  onBlur?: (touched: boolean) => void;
  canEdit?: boolean;
}

export interface NameInputProps extends NameInputEditableControlProps {
  defaultValue: string;
  onChange: (name: string) => void;
  shouldAutoFocus?: boolean;
  handleDelete?: () => void;
  handleDuplicate?: () => void;
  placeholder?: string;

  disabled?: boolean;
}

const NameInputEditableControl: React.FC<NameInputEditableControlProps> = ({
  tooltipLabel,
  onEditStart,
  onEditEnd,
  siblingComponent,
  inputWidth,
  canEdit,
  onBlur,
  ...boxProps
}) => {
  const [touched, setTouched] = useState<boolean>(false);
  const { isEditing, getEditButtonProps } = useEditableControls();

  const editBtnProps = getEditButtonProps();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canEdit) return;

      e.stopPropagation();
      setTouched(true);
      editBtnProps?.onClick(e);
    },
    [editBtnProps.onClick, canEdit]
  );

  useEffect(() => {
    if (isEditing) {
      onEditStart?.();
      setTouched(true);
      return;
    } else {
      touched && onEditEnd?.();
    }
  }, [isEditing]);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleBlur = useCallback(() => {
    onBlur?.(touched);
  }, [onBlur, touched]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') onBlur?.(touched);
    },
    [onBlur, touched]
  );

  return (
    <>
      <Tooltip
        label={canEdit && !isEditing ? tooltipLabel : null}
        placement="top-start"
      >
        <Box
          display="flex"
          {...boxProps}
          {...editBtnProps}
          onClick={handleClick}
        >
          <EditableInput
            width={inputWidth}
            onClick={stopPropagation}
            borderRadius="0px"
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            _focus={{ borderBottom: '1px solid blue', boxShadow: 'none' }}
          />
          <EditablePreview
            overflow="hidden"
            textOverflow="ellipsis"
            minW="40px"
            minH="20px"
          />
        </Box>
      </Tooltip>
      {siblingComponent ? siblingComponent : null}
    </>
  );
};

export const NameInput: React.FC<NameInputProps> = ({
  defaultValue,
  onChange,
  shouldAutoFocus,
  _disabled,
  onInput,
  placeholder,
  canEdit,
  siblingComponent,
  tooltipLabel,
  inputWidth = 'full',
  onEditStart,
  onEditEnd,
  onBlur,
  ...boxProps
}) => {
  const [name, setName] = useDebouncedInput(defaultValue, onChange);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      textAlign="left"
      width="100%"
      {...boxProps}
    >
      <Editable
        fontSize="inherit"
        isDisabled={!canEdit}
        color={name ? '#1A202C' : '#c6ceda'}
        fontWeight="inherit"
        flexGrow="1"
        onChange={setName}
        onInput={onInput}
        startWithEditView={shouldAutoFocus && !name}
        selectAllOnFocus={false}
        value={name || ''}
        placeholder={placeholder}
        isPreviewFocusable={false}
      >
        <Box display="flex">
          <NameInputEditableControl
            {...boxProps}
            onBlur={onBlur}
            tooltipLabel={tooltipLabel}
            onEditStart={onEditStart}
            onEditEnd={onEditEnd}
            siblingComponent={siblingComponent}
            inputWidth={inputWidth}
            canEdit={canEdit}
          />
        </Box>
      </Editable>
    </Box>
  );
};
