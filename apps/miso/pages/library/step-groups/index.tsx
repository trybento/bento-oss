import React from 'react';
import AttributesProvider from 'providers/AttributesProvider';
import StepGroupLibrary from 'components/Library/StepGroupLibrary';
import AppWrapper from 'layouts/AppWrapper';

export default function StepGroupsPage() {
  return (
    <AppWrapper>
      <AttributesProvider>
        <StepGroupLibrary />
      </AttributesProvider>
    </AppWrapper>
  );
}
