import React from 'react';
import { useRouter } from 'next/router';

import AppWrapper from 'layouts/AppWrapper';
import EditUserGuideBase from 'components/UserGuideBases/EditUserGuideBase';

export default function CustomizeGuideRoute() {
  const router = useRouter();
  const { guideBaseEntityId } = router.query;

  return (
    <AppWrapper>
      <EditUserGuideBase guideBaseEntityId={guideBaseEntityId as string} />
    </AppWrapper>
  );
}
