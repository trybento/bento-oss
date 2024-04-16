import React, { useEffect } from 'react';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';

/** Deprecate /guides */
export default function ActiveGuidesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/library');
  }, []);

  return <AppWrapper overflowX="hidden">Redirecting...</AppWrapper>;
}
