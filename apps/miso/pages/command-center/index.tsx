import React from 'react';
import CommandCenter from 'components/CommandCenter';
import AppWrapper from 'layouts/AppWrapper';
import AttributesProvider from 'providers/AttributesProvider';

export default function CommandCenterPage() {
  return (
    <AppWrapper>
      <AttributesProvider>
        <CommandCenter />
      </AttributesProvider>
    </AppWrapper>
  );
}
