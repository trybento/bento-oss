import * as React from 'react';

import { Props } from 'system/H1';
import Text from 'system/Text';
import colors from 'helpers/colors';

/**
 * Legend/subtitle for headings
 */
const HeadingSub = React.forwardRef<HTMLElement, Props>(
  (props: Props, ref: any) => (
    <Text color={colors.text.secondary} {...props} ref={ref} />
  )
);

export default HeadingSub;
