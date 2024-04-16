import * as React from 'react';

import { Props } from 'system/H1';
import Text from 'system/Text';

const H5 = React.forwardRef<HTMLElement, Props>((props: Props, ref: any) => (
  <Text
    fontSize="md"
    fontWeight="bold"
    color="gray.900"
    mb={4}
    {...props}
    ref={ref}
  />
));

H5.displayName = 'H5';

export default H5;
