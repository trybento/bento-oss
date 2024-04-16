import env from '@beam-australia/react-env';

export const DEFAULT_TIME_ZONE = 'America/Los_Angeles';
export const getLocalTz = () =>
  window.Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIME_ZONE;

export const TAB_TITLE = 'Bento Everboarding';
export const NA_LABEL = 'N/A';

export const BENTO_APP_ID = env('BENTO_APP_ID');

export const IS_SERVER = typeof window === 'undefined';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/**
 * Determines if the app is running in Staging.
 */
export const IS_STAGING = (env('CLIENT_HOST') || '').includes('staging');

/**
 * Cache bootstrap states in session stores to handle redirects
 * If in query, indicates we're handling a freshly cloned template
 */
export const BOOTSTRAP_CACHE_KEY = 'bootstrap';

/**
 * Since Chakra V2, dynamic rows require some
 * delay in order for the animation to work.
 */
export const DYNAMIC_ACCORDION_ITEM_DELAY_MS = 350;

/**
 * Determines the WYSIWYG editor chrome extension ID.
 * This is necessary to allow Miso to communicate back and forth with the chrome extension.
 *
 * @see https://chrome.google.com/u/1/webstore/devconsole
 */
export const WYSIWYG_CHROME_EXTENSION_ID = env('WYSIWYG_CHROME_EXTENSION_ID');
