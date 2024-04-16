import React, { useEffect } from 'react';
import Head from 'next/head';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';

/** @deprecated Remove after 6/5/2023 */
export default function IntegrationsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/data-and-integrations');
  }, []);

  return (
    <AppWrapper>
      <Head>
        <title>Integrations | Bento</title>
      </Head>
    </AppWrapper>
  );
}
