import React from 'react';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';
import AttributesProvider from 'providers/AttributesProvider';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import CustomerUser from '../../../../components/Customers/Customer/CustomerParticipants/CustomerUser';

export default function CustomerUserPage() {
  const router = useRouter();
  const { accountEntityId, accountUserEntityId } = router.query;

  if (!accountEntityId || !accountUserEntityId) return null;

  return (
    <AppWrapper>
      <AttributesProvider>
        <TableRendererProvider>
          <CustomerUser
            accountEntityId={accountEntityId as string}
            accountUserEntityId={accountUserEntityId as string}
          />
        </TableRendererProvider>
      </AttributesProvider>
    </AppWrapper>
  );
}
