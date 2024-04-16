import React from 'react';
import { useRouter } from 'next/router';

import AppWrapper from 'layouts/AppWrapper';
import CreateGuideBase from 'components/ActiveGuides/CreateGuideBase';

export default function CreateGuideBaseRoute() {
  const router = useRouter();
  const { accountEntityId, templateEntityId } = router.query;
  if (!accountEntityId) return null;

  return (
    <AppWrapper>
      <CreateGuideBase
        accountEntityId={accountEntityId as string}
        {...(templateEntityId
          ? {
              templateEntityId: templateEntityId as string,
            }
          : {})}
      />
    </AppWrapper>
  );
}
