import React from 'react';
import { Text as DefaultText, TextProps } from '@chakra-ui/react';

import colors from 'helpers/colors';

export interface Props extends TextProps {
  children: React.ReactNode;
}

const ErrorText = React.forwardRef<HTMLParagraphElement, Props>(
  (props: Props, ref) => (
    <DefaultText
      ref={ref}
      mt="2"
      color={colors.error.bright}
      fontSize="xs"
      {...props}
    />
  )
);

export default ErrorText;
