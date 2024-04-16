import React from 'react';
import { useRouter } from 'next/router';
import AppWrapper from 'layouts/AppWrapper';
import EditModule from 'components/Modules/EditModule';

export default function StepGroupEditorPage() {
  const router = useRouter();
  const { moduleEntityId } = router.query;
  if (!moduleEntityId) return null;

  return (
    <AppWrapper>
      <EditModule moduleEntityId={moduleEntityId as string} />
    </AppWrapper>
  );
}
