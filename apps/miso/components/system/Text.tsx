import React from 'react';
import { Text as DefaultText, TextProps } from '@chakra-ui/react';

export interface Props extends TextProps {
  children: React.ReactNode;
}

const Text = React.forwardRef<HTMLParagraphElement, Props>(
  (props: Props, ref) => <DefaultText {...props} ref={ref} />
);

export default Text;
