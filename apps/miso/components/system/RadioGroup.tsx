import React, { useMemo } from 'react';
import {
  RadioGroup as DefaultRadioGroup,
  RadioGroupProps as DefaultRadioGroupProps,
  HStack,
  VStack,
} from '@chakra-ui/react';

export interface RadioGroupProps extends DefaultRadioGroupProps {
  alignment?: 'horizontal' | 'vertical';
  spacing?: string;
}

const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ alignment, spacing, ...restProps }: RadioGroupProps, ref) => {
    const Stack = useMemo(
      () => (alignment === 'vertical' ? VStack : HStack),
      [alignment]
    );

    const style = useMemo(
      () =>
        alignment === 'vertical'
          ? { align: 'left', spacing: spacing ?? '8px' }
          : { spacing: spacing ?? '24px' },
      [alignment, spacing]
    );

    return (
      <DefaultRadioGroup {...restProps} ref={ref}>
        <Stack {...style}>{restProps.children}</Stack>
      </DefaultRadioGroup>
    );
  }
);

export default RadioGroup;
