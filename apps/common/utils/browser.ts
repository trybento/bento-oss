export type BrowserList =
  | 'chrome'
  | 'edge'
  | 'firefox'
  | 'safari'
  | 'ie'
  | undefined;

export const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  let browser: BrowserList = undefined;

  // Detect Chrome
  if (/Chrome/.test(userAgent) && !/Chromium/.test(userAgent)) {
    browser = 'chrome';
  }
  // Detect Chromium-based Edge
  else if (/Edg/.test(userAgent)) {
    browser = 'edge';
  }
  // Detect Firefox
  else if (/Firefox/.test(userAgent)) {
    browser = 'firefox';
  }
  // Detect Safari
  else if (/Safari/.test(userAgent)) {
    browser = 'safari';
  }
  // Detect Internet Explorer
  else if (/Trident/.test(userAgent)) {
    browser = 'ie';
  }

  return browser;
};

/**
 * Determines whether an error is a "QuotaExceededError".
 *
 * Browsers love throwing slightly different variations of QuotaExceededError
 * (this is especially true for old browsers/versions), so we need to check
 * different fields and values to ensure we cover every edge-case.
 *
 * @see https://mmazzarolo.com/blog/2022-06-25-local-storage-status/
 */
export const isQuotaExceededError = (err: unknown): boolean => {
  return (
    err instanceof DOMException &&
    // everything except Firefox
    (err.code === DOMException.QUOTA_EXCEEDED_ERR ||
      // Firefox
      err.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      err.name === 'QuotaExceededError' ||
      // Firefox
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException#invalidaccesserror
 */
export const isInvalidAccessError = (err: unknown): boolean => {
  return (
    err instanceof DOMException && err.code === DOMException.INVALID_ACCESS_ERR
  );
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException#aborterror
 */
export const isAbortError = (err: unknown): boolean => {
  return err instanceof DOMException && err.code === DOMException.ABORT_ERR;
};

/** Check if Mac. appVersion is deprecated but used as fallback */
export const isMac = () =>
  ((navigator as any).userAgentData?.platform
    ? (navigator as any).userAgentData.platform
    : navigator.appVersion
  )
    .toLowerCase()
    .indexOf('mac') != -1;
