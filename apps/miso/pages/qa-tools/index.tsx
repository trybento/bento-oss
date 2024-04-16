import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppWrapper from 'layouts/AppWrapper';
import Box from 'system/Box';
import AttributesProvider from 'providers/AttributesProvider';
import QATools from './QATools';
import { DEPLOYED_TO_PRODUCTION } from 'helpers/constants';

export default function QAToolsPage() {
  const router = useRouter();

  useEffect(() => {
    /* Disable this page on Prod */
    if (DEPLOYED_TO_PRODUCTION) router.push('/library');
  }, []);

  return (
    <AppWrapper>
      <Head>
        <title>QA Tools | Bento</title>
      </Head>
      <Box h="full" w="full" py="32px" display="flex" flexDirection="column">
        <AttributesProvider>
          <QATools />
        </AttributesProvider>
      </Box>
    </AppWrapper>
  );
}
