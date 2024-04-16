import React from 'react';
import { TextProps } from '@chakra-ui/react';

import Text from 'system/Text';

export interface Props extends TextProps {
  children: React.ReactNode;
}

const H1 = React.forwardRef<HTMLParagraphElement, Props>(
  (props: Props, ref) => (
    <Text
      fontSize="3xl"
      as="h1"
      fontWeight="bold"
      color="gray.900"
      {...props}
      ref={ref}
    />
  )
);

H1.displayName = 'H1';

export default H1;
