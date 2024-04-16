import React from 'react';
import { Icon } from '@chakra-ui/react';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';

import Tooltip from 'system/Tooltip';

type WarningBadgeProps = {
  tooltip: string;
};

export enum DefaultWarnings {
  CyoaIncomplete = 'Some branches don’t have destination guides',
}

const WarningBadge: React.FC<WarningBadgeProps> = ({ tooltip }) => {
  return (
    <Tooltip label={tooltip || ''} placement="top">
      <Icon as={WarningTwoToneIcon} color="red.500" />
    </Tooltip>
  );
};

export default WarningBadge;
