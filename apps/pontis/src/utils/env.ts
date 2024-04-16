import { memoize } from 'lodash';

/**
 * If we're in development mode.
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * If we're not in "development" mode.
 *
 * @returns true if we're in production mode
 */
export const isProduction = (): boolean => !isDevelopment();

/**
 * Determines if we're targeting Staging, regardless of which build mode (dev, prod).
 *
 * Commonly, staging builds will be in "production" mode.
 *
 * @see https://docs.plasmo.com/framework/workflows/build#with-a-custom-tag
 */
export const isStaging = (): boolean => {
  return process.env.PLASMO_TAG === 'staging';
};

/**
 * Fetches the extension's version and caches it for all other cases.
 * This is only be computed once per runtime.
 */
export const getVersion = memoize(() => chrome.runtime.getManifest().version);
