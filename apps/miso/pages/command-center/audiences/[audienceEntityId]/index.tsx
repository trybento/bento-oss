import React from 'react';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';
import EditAudience from 'components/CommandCenter/components/Audiences/EditAudience';
import AttributesProvider from 'providers/AttributesProvider';
import TargetingAudienceProvider from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';

export default function EditAudiencePage() {
  const router = useRouter();
  const { audienceEntityId } = router.query;

  if (!audienceEntityId) return null;

  return (
    <AppWrapper>
      <AttributesProvider>
        <TargetingAudienceProvider>
          <EditAudience audienceEntityId={audienceEntityId as string} />
        </TargetingAudienceProvider>
      </AttributesProvider>
    </AppWrapper>
  );
}
