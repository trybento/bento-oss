import React, {
  ChangeEvent,
  KeyboardEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  ChakraProps,
  FormLabelProps,
  InputProps,
} from '@chakra-ui/react';
import tinycolor from 'tinycolor2';
// @ts-expect-error
import transparentBg from '../assets/img/transparent_bg.png';

import { HexColorPicker } from 'react-colorful';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';

import useLocalStorage from '../hooks/useClientStorage';
import { LS_KEYS } from 'bento-common/hooks/useClientStorage';
import {
  isTransparent,
  UI_FONT_SIZE,
  validateColor,
  ValidateColorOptions,
} from 'bento-common/utils/color';
import withFormikField, {
  WithFormkikFieldProps,
} from '../hocs/withFormikField';
import { ClientStorage } from '../utils/clientStorage';
import Portal from './Portal';

const getDefaultSwatches = (includeTransparent?: boolean) => [
  '#BCDFFA',
  '#DDEDCA',
  '#FFEBB6',
  '#FECED3',
  '#FECED3',
  '#2C98F0',
  '#8DC252',
  '#FEC02F',
  '#F2453D',
  '#9B2FAE',
  '#134A9F',
  '#356823',
  '#FD6F22',
  '#B51F23',
  '#4A1C8A',
  '#FFFFFF',
  '#D9D9D9',
  '#969696',
  '#525252',
  '#000000',
  ...(includeTransparent ? ['transparent'] : []),
];

const RECENTS_TO_KEEP = 5;

interface ColorFieldOwnProps extends ValidateColorOptions {
  label?: string;
  name?: string;
  helperText?: ReactNode;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  labelVariant?: FormLabelProps['variant'];
  inputProps?: InputProps;
  allowTransparent?: boolean;
  error?: string;
  /** Allow a custom popover trigger if we don't want a default input */
  popoverTrigger?: ReactNode;
  onClose?: () => void;
  showUnset?: boolean;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  disabled?: boolean;
}

export type ColorFieldProps = ColorFieldOwnProps & ChakraProps;

enum ChangeAction {
  input = 'input',
  click = 'click',
}

const getTransparentProps = (color: string) =>
  isTransparent(color)
    ? {
        backgroundImage: `url(${transparentBg.src})`,
        backgroundPosition: 'center',
      }
    : {};

const ColorField: FC<ColorFieldProps> = ({
  label,
  helperText,
  name,
  isRequired,
  shouldBeDark,
  defaultValue = '',
  maxW = '280px',
  error,
  defaultIsOpen,
  onChange,
  labelVariant,
  inputProps = {},
  allowTransparent,
  popoverTrigger,
  onClose,
  isOpen,
  showUnset,
  disabled,
  ...chakraProps
}) => {
  const { value: cachedRecentColors, setValue: setCachedRecentColors } =
    useLocalStorage(ClientStorage.localStorage, LS_KEYS.RecentColors, '[]');

  const { readOnlyValue, hexPickerValue } = useMemo(
    () => ({
      readOnlyValue:
        defaultValue === '#00000000' ? 'transparent' : defaultValue,
      hexPickerValue: tinycolor(defaultValue).toHex(),
    }),
    [defaultValue]
  );
  const [resetCount, setResetCount] = useState<number>(0);
  const readOnlyRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputColor, setInputColor] = useState<string>(defaultValue);
  const inputKey = `color-field-${name}-${inputColor}-${resetCount}`;
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    setRecentColors(JSON.parse(cachedRecentColors));
  }, [cachedRecentColors]);

  const persistUsedColor = useCallback(() => {
    const newRecents = uniq([defaultValue, ...recentColors]);
    setCachedRecentColors(JSON.stringify(newRecents.slice(0, RECENTS_TO_KEEP)));
    onClose?.();
  }, [defaultValue, onClose]);

  const availableSwatches = useMemo(() => {
    return Array.from(
      new Set(
        recentColors
          ? getDefaultSwatches(allowTransparent).concat(
              recentColors.reduce((acc, color) => {
                if (
                  allowTransparent ||
                  (!allowTransparent && !isTransparent(color))
                )
                  acc.push(color);
                return acc;
              }, [])
            )
          : []
      )
    );
  }, [recentColors, allowTransparent]);

  const handleColorChange = useCallback(
    (hex: string, action?: ChangeAction) => {
      const replaceTransparent = !allowTransparent && isTransparent(hex);
      const newValue = replaceTransparent
        ? hex.slice(0, -2)
        : hex === '#transparent'
        ? 'transparent'
        : hex;

      onChange(newValue);
      // Forces input re-render with new color.
      // Disabled for 'input' action to keep input focused.
      if (action !== ChangeAction.input || replaceTransparent)
        setInputColor(newValue);
    },
    [onChange, allowTransparent]
  );

  const handleColorChangeDebounced = useCallback(
    debounce(handleColorChange, 500),
    [handleColorChange]
  );

  const focusInput = useCallback(() => {
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  }, []);

  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleColorChangeDebounced(e.target.value, ChangeAction.input);
    },
    [handleColorChange]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      readOnlyRef.current?.click();
    }
  }, []);

  const handleSwatchSelection = useCallback(
    (swatch: string) => () => {
      handleColorChange(swatch);
    },
    [handleColorChange]
  );

  const handleUnset = useCallback(() => {
    onChange(null);
    setResetCount((v) => v + 1);
    /* Run close later so we don't have race condition between onClose and onChange */
    setTimeout(() => {
      readOnlyRef.current?.click();
    }, 0);
  }, [onChange]);

  return (
    <FormControl as="fieldset" isInvalid={!!error} {...chakraProps}>
      {label && (
        <FormLabel as="legend" fontSize={UI_FONT_SIZE} variant={labelVariant}>
          {label}
        </FormLabel>
      )}
      <InputGroup maxW={maxW}>
        <Popover
          trigger="click"
          placement="bottom-start"
          isLazy
          lazyBehavior="keepMounted"
          onClose={persistUsedColor}
          onOpen={focusInput}
          matchWidth={true}
          closeOnBlur
          isOpen={disabled ? false : isOpen}
          defaultIsOpen={defaultIsOpen}
        >
          <PopoverTrigger>
            {popoverTrigger ? (
              <Box display="flex" ref={readOnlyRef}>
                {popoverTrigger}
              </Box>
            ) : (
              <Box w="100%" maxW={maxW}>
                <Input
                  ref={readOnlyRef}
                  id={name}
                  key={`readonly-${inputKey}`}
                  isDisabled={disabled}
                  name={name}
                  fontSize={UI_FONT_SIZE}
                  value={readOnlyValue}
                  readOnly
                  style={{
                    paddingLeft: '2.5em',
                  }}
                  borderColor="border"
                  {...inputProps}
                />
                <Box
                  position="absolute"
                  top="50%"
                  transform="translateY(-50%)"
                  left="1em"
                  width="1em"
                  height="1em"
                  backgroundColor={defaultValue}
                  {...getTransparentProps(defaultValue)}
                  border="1px solid #e7e7e7"
                  borderRadius="sm"
                />
              </Box>
            )}
          </PopoverTrigger>
          <Box zIndex="12">
            <Portal>
              <PopoverContent minW="240px" maxW="280px">
                <PopoverBody
                  className="color-picker-popover"
                  style={{ boxSizing: 'border-box' }}
                >
                  <Box padding="0.5em" style={{ boxSizing: 'border-box' }}>
                    <HexColorPicker
                      color={hexPickerValue}
                      onChange={handleColorChangeDebounced}
                    />
                    <FormLabel as="legend">Hex</FormLabel>
                    <Input
                      key={inputKey}
                      ref={inputRef}
                      id={name}
                      name={name}
                      fontSize={UI_FONT_SIZE}
                      defaultValue={inputColor}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                    />
                    <Box mt="4" className="swatches">
                      {availableSwatches.map((swatch, index) => (
                        <Box
                          key={`color-swatch-${index}`}
                          backgroundColor={swatch}
                          {...getTransparentProps(swatch)}
                          onClick={handleSwatchSelection(swatch)}
                          style={{
                            height: '18px',
                            cursor: 'pointer',
                            boxSizing: 'border-box',
                            border: '1px solid #e7e7e7',
                            borderRadius: '4px',
                          }}
                        />
                      ))}
                      {showUnset && (
                        <Box
                          style={{
                            height: '18px',
                            cursor: 'pointer',
                            boxSizing: 'border-box',
                            border: '1px solid #e7e7e7',
                            borderRadius: '4px',
                          }}
                          onClick={handleUnset}
                        >
                          <Box
                            w="full"
                            h="full"
                            background="linear-gradient(to top right, #fff calc(50% - 2px), red , #fff calc(50% + 2px) )"
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Box>
        </Popover>
      </InputGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

function withValidation<P extends object & ColorFieldProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const hoc = React.forwardRef((props: P & WithFormkikFieldProps<P>, ref) => {
    const validate = useCallback(
      (value) =>
        validateColor(value, {
          shouldBeDark: props.shouldBeDark,
          isRequired: props.isRequired,
        }),
      [props.shouldBeDark, props.isRequired]
    );

    return <WrappedComponent {...(props as P)} validate={validate} ref={ref} />;
  });
  hoc.displayName = 'withValidation';
  return hoc;
}

export default composeComponent<ColorFieldProps>([
  withValidation,
  withFormikField,
])(ColorField);
