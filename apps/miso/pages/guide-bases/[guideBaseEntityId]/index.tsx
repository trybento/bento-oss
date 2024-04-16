import React from 'react';
import { useRouter } from 'next/router';

import AppWrapper from 'layouts/AppWrapper';
import GuideBase from 'components/GuideBases';

export default function CustomizeGuideRoute() {
  const router = useRouter();
  const { guideBaseEntityId } = router.query;

  return (
    <AppWrapper>
      <GuideBase guideBaseEntityId={guideBaseEntityId as string} />
    </AppWrapper>
  );
}
