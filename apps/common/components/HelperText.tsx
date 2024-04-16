import React from 'react';
import { Text as DefaultText, TextProps } from '@chakra-ui/react';

export interface Props extends TextProps {
  children: React.ReactNode;
}

const HelperText = React.forwardRef<HTMLParagraphElement, Props>(
  (props: Props, ref) => (
    <DefaultText ref={ref} mt="2" color="gray.600" fontSize="xs" {...props} />
  )
);

export default HelperText;
