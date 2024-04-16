import React from 'react';
import { useRouter } from 'next/router';
import Box from 'system/Box';
import AppWrapper from 'layouts/AppWrapper';
import SplitTest from 'components/SplitTest/SplitTest';

export default function SplitTestsPage() {
  const router = useRouter();
  const { splitTestEntityId } = router.query;
  if (!splitTestEntityId) return null;

  return (
    <AppWrapper>
      <Box px="16" py="8">
        <SplitTest splitTestEntityId={splitTestEntityId as string} />
      </Box>
    </AppWrapper>
  );
}
