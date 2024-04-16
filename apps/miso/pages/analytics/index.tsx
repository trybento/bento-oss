import React from 'react';
import AppWrapper from 'layouts/AppWrapper';
import Analytics from 'components/Analytics';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import MaintenanceWall from 'components/MaintenanceWall';
import { useAnalyticsMaintenancePage } from 'hooks/useFeatureFlag';

export default function AnalyticsPage() {
  const analyticsMaintenancePageEnabled = useAnalyticsMaintenancePage();

  return (
    <AppWrapper overflowX="hidden">
      {analyticsMaintenancePageEnabled ? (
        <MaintenanceWall pageName="analytics" h="100vh" />
      ) : (
        <TableRendererProvider>
          <Analytics />
        </TableRendererProvider>
      )}
    </AppWrapper>
  );
}
