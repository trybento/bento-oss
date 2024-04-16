import React from 'react';
import AppWrapper from 'layouts/AppWrapper';

import AttributesProvider from 'providers/AttributesProvider';
import CreateAudience from 'components/CommandCenter/components/Audiences/CreateAudience';
import TargetingAudienceProvider from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';

export default function CreateAudiencePage() {
  return (
    <AppWrapper>
      <AttributesProvider>
        <TargetingAudienceProvider>
          <CreateAudience />
        </TargetingAudienceProvider>
      </AttributesProvider>
    </AppWrapper>
  );
}
