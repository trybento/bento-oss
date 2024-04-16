import React from 'react';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';

import Box from 'system/Box';
import AttributesProvider from 'providers/AttributesProvider';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import CustomerGuides from 'components/Customers/Customer/CustomerGuides';
import { GuideResetToastProvider } from 'components/GuideResetToast';

export default function CustomerUserPage() {
  const router = useRouter();
  const { accountEntityId } = router.query;

  if (!accountEntityId) return null;

  return (
    <AppWrapper overflowX="hidden">
      <Box
        h="full"
        w="full"
        px={['32px', '32px', '32px', '64px']}
        py="32px"
        display="flex"
        flexDirection="column"
      >
        <AttributesProvider>
          <TableRendererProvider>
            <GuideResetToastProvider>
              <CustomerGuides accountEntityId={accountEntityId as string} />
            </GuideResetToastProvider>
          </TableRendererProvider>
        </AttributesProvider>
      </Box>
    </AppWrapper>
  );
}
