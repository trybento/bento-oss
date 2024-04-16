import React from 'react';
import GuidePriorityTab from './components/GuidePriorityTab';
import Page from 'components/layout/Page';
import TroubleshootTab from './components/TroubleshootTab';
import AnalyticsTab from './components/AnalyticsTab';
import BlockedAccountsPanel from 'components/OrgSettings/BlockedAccountsPanel';
import AudiencesTabRenderer from './components/Audiences/AudiencesTab';

export default function CommandCenterPage() {
  return (
    <Page
      title="Command center"
      tabs={[
        { title: 'Troubleshoot', component: () => <TroubleshootTab /> },
        { title: 'Guide priority', component: () => <GuidePriorityTab /> },
        { title: 'Analytics', component: () => <AnalyticsTab /> },
        {
          title: 'Blocked accounts',
          component: () => <BlockedAccountsPanel useCCHeader />,
        },
        { title: 'Audiences', component: () => <AudiencesTabRenderer /> },
      ]}
    />
  );
}
