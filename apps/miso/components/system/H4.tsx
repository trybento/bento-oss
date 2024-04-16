import * as React from 'react';

import { Props } from 'system/H1';
import Text from 'system/Text';

/**
 * h4 header with 20 pixels of font size
 *
 * @see https://www.figma.com/file/tmBITIKQjDZuroCmE9lR3N/Bento-Styles
 */
const H4 = React.forwardRef<HTMLElement, Props>((props: Props, ref: any) => (
  <Text
    fontSize="xl"
    as="h4"
    fontWeight="bold"
    color="gray.900"
    {...props}
    ref={ref}
  />
));

H4.displayName = 'H4';

export default H4;
