import React from 'react';
import { BoxProps } from '@chakra-ui/layout';

import Badge, { BadgeStyle } from 'system/Badge';

type Props = {
  inUse: boolean;
} & Omit<BoxProps, 'style'>;

const UsageBadge: React.FC<Props> = ({ inUse, ...boxProps }) => (
  <Badge
    label={inUse ? 'Used' : 'Not used'}
    variant={inUse ? BadgeStyle.active : BadgeStyle.inactive}
    minW="75px"
    {...boxProps}
  />
);

export default UsageBadge;
