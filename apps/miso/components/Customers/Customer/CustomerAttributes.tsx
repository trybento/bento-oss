import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Flex } from '@chakra-ui/react';

import H2 from 'system/H2';
import TopBreadcrumbs from '../../common/Breadcrumbs';
import AccountQuery from 'queries/AccountQuery';
import { AttributeType } from 'bento-common/types';
import { AccountQueryQuery$data } from 'relay-types/AccountQueryQuery.graphql';
import CustomerAttributesTable from './components/AttributesTable';

type Props = {
  accountEntityId: string;
};

export default function CustomerAttributes({ accountEntityId }: Props) {
  const [account, setAccount] = useState<AccountQueryQuery$data['account']>();

  const getGuideBases = useCallback(async () => {
    if (!accountEntityId) return;

    const res = await AccountQuery({ entityId: accountEntityId });

    if (res.account) setAccount(res.account);
  }, [accountEntityId]);

  useEffect(() => {
    void getGuideBases();
  }, [accountEntityId]);

  if (!account) return null;

  return (
    <Flex
      overflow="hidden"
      flexDirection="column"
      flex="1"
      minH={['1000px', '720px']}
    >
      <Head>
        <title>{account?.name || 'Customers'} | Bento</title>
      </Head>
      <TopBreadcrumbs
        trail={[
          {
            label: 'Customers',
            path: '/customers',
          },
          {
            label: account?.name || '',
            path: `/customers/${accountEntityId}`,
          },
          {
            label: 'Account attributes',
          },
        ]}
      />
      <Flex flexDirection="column">
        <H2 mt="1">{account?.name}</H2>
      </Flex>
      <Flex w="50%">
        <CustomerAttributesTable
          type={AttributeType.account}
          attributes={account.attributes}
        />
      </Flex>
    </Flex>
  );
}
