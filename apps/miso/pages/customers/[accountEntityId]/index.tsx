import React from 'react';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';
import AttributesProvider from 'providers/AttributesProvider';
import Customer from 'components/Customers/Customer/Customer';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import UsersProvider from 'providers/UsersProvider';

export default function CustomersPage() {
  const router = useRouter();
  const { accountEntityId } = router.query;

  if (!accountEntityId) return null;

  return (
    <AppWrapper overflowX="hidden">
      <AttributesProvider>
        <TableRendererProvider>
          <UsersProvider>
            <Customer accountEntityId={accountEntityId as string} />
          </UsersProvider>
        </TableRendererProvider>
      </AttributesProvider>
    </AppWrapper>
  );
}
