import React, { useCallback } from 'react';
import { HStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { AttributeType } from 'bento-common/types';

import { useQueryAsHook } from 'hooks/useQueryAsHook';
import AccountUserQuery from 'queries/AccountUserQuery';
import CustomerUserGuides from './CustomerUserGuides';
import CustomerAttributesTable from '../components/AttributesTable';
import Page from 'components/layout/Page';

enum TabOptions {
  guides = 'Guides',
  attributes = 'Attributes',
}

type Props = {
  accountEntityId: string;
  accountUserEntityId: string;
};

export default function CustomerUser({ accountUserEntityId }: Props) {
  const router = useRouter();
  const { data: res } = useQueryAsHook(
    AccountUserQuery,
    { entityId: accountUserEntityId },
    { dependencies: [accountUserEntityId] }
  );
  const { accountUser, guides } = res || {};

  const handleTroubleshoot = useCallback(
    () => router.push('/command-center?tab=troubleshoot&ref=user'),
    []
  );

  if (!accountUser) {
    return null;
  }

  return (
    <Page
      title={accountUser.fullName || accountUser.externalId || 'Customers'}
      breadcrumbs={[
        {
          label: 'Customers',
          path: '/customers',
        },
        {
          label: accountUser.account.name || '',
          path: `/customers/${accountUser.account.entityId}`,
        },
        {
          label: accountUser.fullName || accountUser.externalId,
        },
      ]}
      actions={
        <Button variant="secondary" onClick={handleTroubleshoot}>
          Troubleshoot
        </Button>
      }
      tabs={[
        {
          title: 'Guides',
          component: () => (
            <CustomerUserGuides
              accountUserEntityId={accountUserEntityId}
              guides={guides}
            />
          ),
        },
        {
          title: 'Attributes',
          component: () => (
            <HStack alignItems="flex-start" spacing={10}>
              <CustomerAttributesTable
                type={AttributeType.accountUser}
                attributes={accountUser.attributes}
              />
              <CustomerAttributesTable
                type={AttributeType.account}
                attributes={accountUser.account.attributes}
              />
            </HStack>
          ),
        },
      ]}
    />
  );
}
