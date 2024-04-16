import { Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import Tooltip from 'system/Tooltip';

import {
  dateFormatter,
  timestampFormatter,
} from './Templates/Tabs/templateTabs.helpers';

export default function SimpleDateWithTimezoneTooltip({
  date,
}: {
  date: Date;
}) {
  const dayFormat = useMemo(() => dateFormatter.format(date), [date]);
  const timestampFormat = useMemo(
    () => timestampFormatter.format(date),
    [date]
  );

  return (
    <Tooltip label={timestampFormat} placement="top">
      <Text textDecoration="underline" fontWeight="semibold" display="inline">
        {dayFormat}
      </Text>
    </Tooltip>
  );
}
