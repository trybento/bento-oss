import React, { useCallback, useRef } from 'react';
import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ChakraProvider } from '@chakra-ui/react';
import { PortalRefProvider } from '../providers/PortalRefProvider';

interface Props {
  cache?: EmotionCache;
  children: React.ReactNode;
  theme: Record<string, unknown>;
  portalRoot?: HTMLElement;
}

/**
 * To my future self or fellow engineers - you may be asking why on earth
 * we need to wrap the Chakra provider here?
 *
 * It turns out that if you reference Chakra components from a shared library,
 * and import the provider from another library, two separate style caches are
 * instantiated somewhere behind the scenes. This therefore means that all
 * components imported from the common library will be missing styles.
 *
 * It seems this is only really a problem when trying to render things in a shadow
 * DOM, as otherwise both style caches just get rendered to the same DOM. Therefore,
 * this problem only really applies to Pontis for now.
 */
export const ThemeProvider: React.FC<Props> = ({
  cache,
  children,
  theme,
  portalRoot,
}) => {
  const portalRef = useRef(portalRoot);

  const getInner = () => {
    return (
      <ChakraProvider
        theme={theme}
        resetCSS
        toastOptions={{
          portalProps: { containerRef: portalRoot ? portalRef : undefined },
        }}
      >
        <PortalRefProvider root={portalRoot}>{children}</PortalRefProvider>
      </ChakraProvider>
    );
  };

  return cache ? (
    <CacheProvider value={cache}>{getInner()}</CacheProvider>
  ) : (
    getInner()
  );
};
