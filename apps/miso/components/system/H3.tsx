import * as React from 'react';

import { Props } from 'system/H1';
import Text from 'system/Text';

/**
 * h3 header with 24 pixels of font size
 *
 * @see https://www.figma.com/file/tmBITIKQjDZuroCmE9lR3N/Bento-Styles
 */
const H3 = React.forwardRef<HTMLParagraphElement, Props>(
  (props: Props, ref) => (
    <Text
      fontSize="2xl"
      as="h3"
      fontWeight="bold"
      color="gray.900"
      {...props}
      ref={ref}
    />
  )
);

H3.displayName = 'H3';

export default H3;
