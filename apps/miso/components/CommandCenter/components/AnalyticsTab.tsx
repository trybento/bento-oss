import React, { useMemo } from 'react';
import { subMonths } from 'date-fns';

import Box from 'system/Box';
import AnalyticsData from 'components/Analytics/AnalyticsData';
import TabInfoHeader from '../../layout/TabInfoHeader';

/**
 * Analytics tab for command center
 */
export default function AnalyticsTab() {
  const dates = useMemo(() => {
    const today = new Date();
    const lastMonth = subMonths(new Date(), 1);
    return { lastMonth, today };
  }, []);

  return (
    <Box>
      <TabInfoHeader title="How are your guides performing?">
        See an overview of how your guides are performing across customers. Data
        is updated daily.
      </TabInfoHeader>
      <AnalyticsData startDate={dates.lastMonth} endDate={dates.today} />
    </Box>
  );
}
