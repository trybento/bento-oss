import * as React from 'react';

import { Props } from 'system/H1';
import Text from 'system/Text';

const H6 = React.forwardRef<HTMLElement, Props>((props: Props, ref: any) => (
  <Text
    fontSize="sm"
    fontWeight="bold"
    color="text.secondary"
    mb="2"
    {...props}
    ref={ref}
  />
));

H6.displayName = 'H6';

export default H6;
