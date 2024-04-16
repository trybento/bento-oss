import * as React from 'react';

import { Props } from 'system/H1';
import Text from 'system/Text';

const H2 = React.forwardRef<HTMLParagraphElement, Props>(
  (props: Props, ref) => (
    <Text
      fontSize="32px"
      lineHeight="40px"
      as="h2"
      color="gray.900"
      fontWeight="bold"
      {...props}
      ref={ref}
    />
  )
);

H2.displayName = 'H2';

export default H2;
