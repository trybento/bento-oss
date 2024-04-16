import React from 'react';
// TODO: Get rid of this and replace with manual SVG fallback generation, adds a lot to our bundle size
import { Cache, ConfigProvider } from 'react-avatar';

const cache = new Cache({
  // Keep cached source failures for up to 7 days
  sourceTTL: 7 * 24 * 3600 * 1000,

  // Keep a maximum of 20 entries in the source cache
  sourceSize: 20,
});

export function AvatarCacheProvider({ children }) {
  return <ConfigProvider cache={cache}>{children}</ConfigProvider>;
}
