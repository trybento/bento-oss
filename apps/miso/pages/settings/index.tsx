import React, { useEffect } from 'react';
import AppWrapper from 'layouts/AppWrapper';
import { useRouter } from 'next/router';

/** Deprecate /settings as a branding page */
export default function UISettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/styles');
  }, []);

  return <AppWrapper overflowX="hidden">Redirecting...</AppWrapper>;
}
