import React from 'react';
import { useRouter } from 'next/router';
import Box from 'system/Box';
import AppWrapper from 'layouts/AppWrapper';
import MockedAttributesProviderComponent from 'providers/MockedAttributesProvider';
import EditNps from 'components/Nps/EditNps';

export default function EditNpsPage() {
  const router = useRouter();
  const { npsEntityId } = router.query;
  if (!npsEntityId) return null;

  return (
    <AppWrapper>
      {/**
       * min-width set to prevent previews and other
       * elements from overflowing the selected tab
       * container.
       */}
      <Box px="16" py="8" minW="1350px">
        <MockedAttributesProviderComponent>
          <EditNps npsEntityId={npsEntityId as string} />
        </MockedAttributesProviderComponent>
      </Box>
    </AppWrapper>
  );
}
