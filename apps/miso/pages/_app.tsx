import React, { useMemo } from 'react';
import { AppProps } from 'next/app';
import theme from 'bento-common/frontend/theme';
import { ThemeProvider } from 'bento-common/components/ThemeProvider';
import { ReactRelayContext } from 'react-relay';
import Script from 'next/script';

import 'tailwindcss/tailwind.css';
import '../styles/styles.css';
import 'bento-common/icons/BentoSpinner.css';

import { AvatarCacheProvider } from 'providers/AvatarCacheProvider';
import { useEnvironment } from 'utils/relay';

import { TAB_TITLE } from 'utils/constants';
import Head from 'next/head';
import useAccessToken from 'hooks/useAccessToken';
import LoggedInUserProviderQueryRenderer from 'providers/LoggedInUserProvider';
import BentoOnboardingGuideProviderQueryRenderer from 'providers/BentoOnboardingGuideProvider';
import { useRouter } from 'next/router';
import env from '@beam-australia/react-env';
import VisualBuilderProvider from 'providers/VisualBuilderProvider';
import OrganizationInlineEmbedProvider from 'providers/OrganizationInlineEmbedProvider';

interface AppPropsWithError extends AppProps {
  err?: Error | undefined;
}

/**
 * Paths/routes which shouldn't be wrapped with the logged in user or bento
 *   onboarding guide providers. Similarly, it doesn't make sense to instantiate
 *   any internal tools or the bento sidebar for these either
 */
const bentoSnippetBlockList = [
  // not only the actual login page but also the select org page
  '/login',
  '/start-trial',
  // this page manually adds the logged in user provider
  '/trial-ended',
  // both of these don't have any user context yet
  '/reset-password',
  '/invite-sign-up',
  // the tag editor uses /tags/<tag_id>/edit and /tags/new as redirect pages
  // and they don't need the providers
  '/tags/',
  // auto-complete element selector
  '/autocomplete-element',
  // inline embed injection editor
  '/inline-injection',
  // auto guide builder
  '/auto-guide-builder',
];

/** @todo streamline document in case of WYSIWYG editor */
function App({ Component, pageProps, err }: AppPropsWithError) {
  const router = useRouter();
  const environment = useEnvironment();

  const shouldLoadBentoSnippet = useMemo(
    () => !bentoSnippetBlockList.some((path) => router.route.startsWith(path)),
    [router.route]
  );

  const { accessToken } = useAccessToken(shouldLoadBentoSnippet);

  return (
    <>
      <Head>
        <title>{TAB_TITLE}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </Head>
      <ReactRelayContext.Provider value={{ environment }}>
        <ThemeProvider theme={theme}>
          <AvatarCacheProvider>
            {accessToken && shouldLoadBentoSnippet ? (
              <LoggedInUserProviderQueryRenderer>
                <BentoOnboardingGuideProviderQueryRenderer>
                  <VisualBuilderProvider>
                    <OrganizationInlineEmbedProvider>
                      <Component {...pageProps} err={err} />
                    </OrganizationInlineEmbedProvider>
                  </VisualBuilderProvider>
                </BentoOnboardingGuideProviderQueryRenderer>
              </LoggedInUserProviderQueryRenderer>
            ) : !shouldLoadBentoSnippet ? (
              <Component {...pageProps} err={err} />
            ) : (
              <></>
            )}
          </AvatarCacheProvider>
        </ThemeProvider>
      </ReactRelayContext.Provider>
      <Script src="/__ENV.js" strategy="beforeInteractive" />
      {shouldLoadBentoSnippet && (
        <Script
          id="bento-snippet"
          src={env('EMBEDDABLE_SRC')}
          async
          type="module"
        />
      )}
    </>
  );
}

export default App;
