import React from 'react';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';

import Box from 'system/Box';
import AttributesProvider from 'providers/AttributesProvider';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import CustomerAttributes from 'components/Customers/Customer/CustomerAttributes';

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
            <CustomerAttributes accountEntityId={accountEntityId as string} />
          </TableRendererProvider>
        </AttributesProvider>
      </Box>
    </AppWrapper>
  );
}
