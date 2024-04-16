import React from 'react';
import { useRouter } from 'next/router';

import Box from 'system/Box';

import AppWrapper from 'layouts/AppWrapper';
import Template from 'components/Templates/Template';
import MockedAttributesProviderComponent from 'providers/MockedAttributesProvider';

export default function EditTemplateInAccountRoute() {
  const router = useRouter();
  const { templateEntityId, step } = router.query;
  if (!templateEntityId) return null;

  return (
    <AppWrapper>
      {/**
       * min-width set to prevent previews and other
       * elements from overflowing the selected tab
       * container.
       */}
      <Box px="16" py="8" minW="1350px">
        <MockedAttributesProviderComponent>
          <Template
            templateEntityId={templateEntityId as string}
            step={step as string}
          />
        </MockedAttributesProviderComponent>
      </Box>
    </AppWrapper>
  );
}
