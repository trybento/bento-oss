import React from 'react';
import AttributesTab from './components/AttributesTab';
import EventsTab from './components/EventsTab';
import Integrations from 'components/Integrations';
import Page from 'components/layout/Page';

export default function DataPage() {
  return (
    <Page
      title="Data and integrations"
      tabs={[
        { title: 'Integrations', component: () => <Integrations /> },
        { title: 'Attributes', component: () => <AttributesTab /> },
        { title: 'Events', component: () => <EventsTab /> },
      ]}
    />
  );
}
