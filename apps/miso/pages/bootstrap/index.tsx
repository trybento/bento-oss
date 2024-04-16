import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import AppWrapper from 'layouts/AppWrapper';
import useToast from 'hooks/useToast';
import { SessionRedirect } from 'helpers';

import Box from 'system/Box';
import useAccessToken from 'hooks/useAccessToken';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { BOOTSTRAP_CACHE_KEY } from 'utils/constants';
import * as BootstrapTemplateMutation from 'mutations/BootstrapTemplate';

function BootstrapComponent() {
  const router = useRouter();
  const toast = useToast();

  const { accessToken } = useAccessToken();

  const handleRequestBootstrap = useCallback(
    async (entityId: string) => {
      try {
        const {
          bootstrapTemplates: {
            template: { entityId: eId },
          },
        } = await BootstrapTemplateMutation.commit({ entityId });

        toast({
          title: 'Template applied!',
          status: 'success',
        });

        router.push(`/library/templates/${eId}?${BOOTSTRAP_CACHE_KEY}=true`);
      } catch (e) {
        toast({
          title: e.message || 'Something went wrong',
          status: 'error',
        });

        router.push('/library');
      }
    },
    [accessToken]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetTemplate = urlParams.get('target');
    const cachedTarget = sessionStorage.getItem(BOOTSTRAP_CACHE_KEY);
    const target = targetTemplate || cachedTarget;

    if (!target) {
      toast({
        title: 'No template requested',
        status: 'error',
      });

      router.push('/library');
      return;
    }

    if (accessToken) {
      if (cachedTarget) sessionStorage.removeItem(BOOTSTRAP_CACHE_KEY);

      /* Clear any other potential redirect caches */
      sessionStorage.removeItem('redirectAfterLogin');
      void handleRequestBootstrap(target);
    } else {
      /* Cache state quickly if not logged in */
      sessionStorage.setItem(BOOTSTRAP_CACHE_KEY, targetTemplate);

      SessionRedirect.set(window.location.href);
    }
  }, [accessToken]);

  return <BentoLoadingSpinner h="75vh" />;
}

export default function BootstrapPage() {
  return (
    <AppWrapper overflowX="hidden">
      <Head>
        <title>Template | Bento</title>
      </Head>
      <Box
        h="full"
        w="full"
        px={['32px', '32px', '32px', '64px']}
        py="32px"
        display="flex"
        flexDirection="column"
      >
        <BootstrapComponent />
      </Box>
    </AppWrapper>
  );
}
