import React, { useEffect } from 'react';
import Head from 'next/head';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';

export default function AudiencesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/command-center?tab=audiences');
  }, []);

  return (
    <AppWrapper>
      <Head>
        <title>Audiences | Bento</title>
      </Head>
    </AppWrapper>
  );
}
