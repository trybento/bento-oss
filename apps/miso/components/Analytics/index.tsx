import React, { useMemo } from 'react';
import AnalyticsData from './AnalyticsData';
import Page from 'components/layout/Page';

export default function Analytics() {
  const dates = useMemo(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return { lastMonth, today };
  }, []);

  return (
    <Page title="Guide analytics">
      <AnalyticsData startDate={dates.lastMonth} endDate={dates.today} />
    </Page>
  );
}
