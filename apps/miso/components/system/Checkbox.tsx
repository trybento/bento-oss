import React, {
  ChangeEvent,
  forwardRef,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';
import {
  Checkbox as DefaultCheckbox,
  FormLabel,
  FormLabelProps,
  useCheckbox,
} from '@chakra-ui/react';

interface Props extends Omit<FormLabelProps, 'onChange'> {
  isChecked: boolean;
  isDisabled?: boolean;
  onChange: (_e: ChangeEvent<HTMLInputElement>) => void;
  animationDisabled?: boolean;
}

export const CHECKBOX_HOVERED_FILTER = 'brightness(0.8)';

/**
 * Use this component instead of the default Checkbox to address
 * click issues in the built version of the admin UI (staging/production).
 *
 * Notes:
 * - Bug fixed in chakra v2.2.6 https://github.com/chakra-ui/chakra-ui/issues/5943#issuecomment-1261223066
 * - Chakra v2 needs React v18.
 */
const Checkbox = forwardRef<HTMLInputElement, PropsWithChildren<Props>>(
  (
    {
      children,
      onChange,
      isChecked,
      isDisabled,
      animationDisabled,
      ...restProps
    },
    ref
  ) => {
    const { getInputProps } = useCheckbox({
      isChecked,
      isIndeterminate: false,
      isDisabled,
      onChange,
    });

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const hoverHandlers = useMemo(
      () => ({
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      }),
      []
    );

    return (
      <FormLabel
        display="flex"
        gridGap="2"
        m="auto"
        fontWeight="normal"
        cursor="pointer"
        userSelect="none"
        {...hoverHandlers}
        {...restProps}
      >
        <input {...getInputProps()} hidden ref={ref} />
        <DefaultCheckbox
          className={
            animationDisabled ? 'checkbox-animation-disabled' : undefined
          }
          isChecked={isChecked}
          isDisabled={isDisabled}
          pointerEvents="none"
          filter={isHovered && isChecked ? CHECKBOX_HOVERED_FILTER : undefined}
        />
        {children}
      </FormLabel>
    );
  }
);

export default Checkbox;
