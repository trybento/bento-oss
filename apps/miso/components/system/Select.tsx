import React, { forwardRef, useCallback, useMemo } from 'react';
import { Box, BoxProps, Icon } from '@chakra-ui/react';
import SvgIcon from '@mui/material/SvgIcon';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import SelectDefault, {
  components,
  Props as DefaultProps,
  SingleValueProps,
  OptionProps,
} from 'react-select';
import CreatableSelect, {
  CreatableProps,
  CreatableProps as DefaultCreatableProps,
} from 'react-select/creatable';
import theme from 'bento-common/frontend/theme';
import CloseIcon from '@mui/icons-material/Close';

export const selectize = <T extends string | number | boolean>(
  opts: Array<T>
): Array<SelectOptions<T>> => opts.map((o) => ({ label: String(o), value: o }));

export type SelectOptions<T = string> = {
  label: string;
  value: T;
};

export interface ExtendedSelectOptions<T = string> extends SelectOptions<T> {
  subLabel?: string;
  alt?: string;
  Icon?: React.ReactNode;
  extra?: {
    /** An icon */
    icon: typeof SvgIcon;
    /** Callback function to execute when the icon is clicked */
    callback?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /** A human-frindly title to describe the icon or the action it performs */
    title?: string;
  };
  element?: React.ReactElement;
  isDisabled?: boolean | string;
}

export const OptionWithSubLabel: (
  iconProps?: BoxProps
) => React.FC<OptionProps<any, any>> =
  (iconProps = {}) =>
  (props) => {
    const { data, isSelected, isDisabled } = props;

    return (
      <Box>
        <components.Option {...props}>
          <Box display="flex" flexDir="row" gap="2" alignItems="center">
            {!!data?.Icon && (
              <Box
                display="flex"
                color={
                  isDisabled
                    ? 'inherit'
                    : isSelected
                    ? 'white'
                    : 'icon.secondary'
                }
                alignContent="center"
                alignItems="center"
                {...iconProps}
              >
                {data.Icon}
              </Box>
            )}
            <Box
              display="flex"
              flexDir="row"
              gap="1"
              justifyContent="space-between"
              alignItems="center"
              width="full"
            >
              <Box display="flex" flexDir="column" overflow="hidden">
                <Box title={data.label} isTruncated>
                  {data.label}
                </Box>
                {data?.subLabel && (
                  <Box
                    fontSize="xs"
                    color={
                      isDisabled ? 'inherit' : isSelected ? 'white' : 'gray.500'
                    }
                  >
                    {data.subLabel}
                  </Box>
                )}
              </Box>

              {data.extra && (
                <Box
                  display="flex"
                  cursor="pointer"
                  zIndex="13"
                  color={
                    isDisabled
                      ? 'inherit'
                      : isSelected
                      ? 'white'
                      : 'icon.secondary'
                  }
                  onClick={data.extra.callback}
                  title={data.extra.title}
                >
                  <data.extra.icon fontSize="small" />
                </Box>
              )}
            </Box>
            {data.element}
          </Box>
        </components.Option>
      </Box>
    );
  };

export const SingleValueWithIcon: (
  iconProps?: BoxProps
) => React.FC<SingleValueProps<any>> = (iconProps) => (props) => {
  const { data } = props;

  return (
    <components.SingleValue {...props}>
      <Box display="flex" flexDir="row" p="2px">
        {!!data?.Icon && (
          <Box
            mr="2"
            my="auto"
            display="flex"
            color="icon.secondary"
            {...iconProps}
          >
            {data.Icon}
          </Box>
        )}

        <Box display="flex" flexDir="column">
          <Box my="auto">{data.label}</Box>
        </Box>
      </Box>
    </components.SingleValue>
  );
};

export const newOptionHighlight = (state, newOptionValue = '') => ({
  ...(state.value === newOptionValue && {
    borderBottom: '1px solid #d9d9d9',
    color: '#185ddc',
  }),
});

const DropdownIndicator = (props) => {
  return props.isDisabled ? null : (
    <UnfoldMore style={{ width: '24px' }} color={props.theme.color} />
  );
};

export type SelectProps =
  | {
      /** If provided, renders a small X on the right, which will invoke this callback */
      onClear?: () => void;
      clearInputOnChange?: boolean;
      defaultIndicator?: boolean;
      /** Used to indicate that filter is handled externally. */
      asyncFilter?: boolean;
    } & (
      | ({ isCreatable?: false } & DefaultProps)
      | ({ isCreatable: true } & DefaultCreatableProps<any, any, any>)
    );

const selectStyles: DefaultProps['styles'] = {
  dropdownIndicator: (provided) => ({
    ...provided,
    color: theme.colors.gray[600],
  }),
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
    border: `1px solid ${theme.colors.border}`,
    maxWidth: '100%',
    flexWrap: 'nowrap',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 1500,
  }),
  multiValue: (provided) => ({
    ...provided,
    borderRadius: '12px',
    padding: '0px 5px',
    backgroundColor: '#edf2f7',
    fontWeight: 600,
    color: '#1a202c',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    whiteSpace: 'break-spaces',
    textOverflow: 'initial',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    ':hover': {
      cursor: 'pointer',
      opacity: 0.8,
    },
  }),
};

/**
 * Used for creatable dropdowns
 * that may need different functionality
 * that the one provided from system/Select.tsx.
 */
export const creatableStylingProps: {
  className: string;
  styles: DefaultProps['styles'];
  components: DefaultProps['components'];
} = {
  className: 'react-creatable-select-container',
  styles: selectStyles,
  components: { DropdownIndicator, IndicatorSeparator: null },
};

const Select = forwardRef<any, SelectProps>(function BentoSelect(
  {
    isCreatable,
    asyncFilter,
    defaultIndicator,
    onInputChange,
    onChange,
    onClear,
    clearInputOnChange,
    styles,
    components: customComponents,
    ...props
  },
  ref
) {
  const handleInputChange = useCallback<DefaultProps['onInputChange']>(
    (newInputValue, changeAction) => {
      if (changeAction.action === 'input-change') {
        onInputChange?.(newInputValue, changeAction);
      } else if (changeAction.action === 'input-blur') {
        onInputChange?.('', changeAction);
      }
    },
    [onInputChange]
  );

  const selectProps: Partial<DefaultProps | CreatableProps<any, any, any>> = {
    onChange: useCallback<DefaultProps['onChange']>(
      (value, action) => {
        onChange?.(value, action);
        if (clearInputOnChange)
          handleInputChange('', {
            action: 'input-blur',
            prevInputValue: props.value,
          });
      },
      [clearInputOnChange, onChange, handleInputChange, props.value]
    ),
    onInputChange: handleInputChange,
    filterOption: useMemo(
      () => (asyncFilter ? (_o, _i) => true : undefined),
      [asyncFilter]
    ),
    styles: useMemo(() => ({ ...selectStyles, ...styles }), [styles]),
    components: useMemo(
      () => ({
        ...(!defaultIndicator && { DropdownIndicator }),
        IndicatorSeparator: null,
        ClearIndicator: props.isMulti ? null : components.ClearIndicator,
        ...customComponents,
      }),
      [customComponents, defaultIndicator]
    ),
    ...props,
  };

  return (
    <Box w="full" position="relative">
      {isCreatable ? (
        <CreatableSelect
          ref={ref}
          className="react-creatable-select-container"
          {...selectProps}
        />
      ) : (
        <SelectDefault
          ref={ref}
          className="react-select-container"
          {...selectProps}
        />
      )}
      {onClear && (
        <Box
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          display="flex"
          right="5"
          onClick={onClear}
        >
          <Icon cursor="pointer" transform="scale(0.7)" as={CloseIcon} />
        </Box>
      )}
    </Box>
  );
});

export default Select;
