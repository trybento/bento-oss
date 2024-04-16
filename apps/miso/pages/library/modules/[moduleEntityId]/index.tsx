import React from 'react';
import { useRouter } from 'next/router';

import Box from 'system/Box';

import AppWrapper from 'layouts/AppWrapper';

/**
 * Deprecated Aug 18 '23
 */
export default function EditModuleInAccountRoute() {
  const router = useRouter();
  const { moduleEntityId } = router.query;
  if (moduleEntityId) {
    router.push(`/library/step-groups/${moduleEntityId}`);
    return null;
  } else {
    router.push('/library/step-groups');
  }

  return (
    <AppWrapper>
      <Box />
    </AppWrapper>
  );
}
