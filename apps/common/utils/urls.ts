export function stripQueryStringAndHashFromPath(url: string): string {
  return url.split('?')[0].split('#')[0];
}

/**
 * Clean functionally-irrelevant trailing slashes
 */
function removeTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * This method is expected to be strict about protocol, hostname, port, and paths,
 * while also being NOT strict about query string and hash (unless present in
 * the target URL definition).
 *
 * @todo support relative urls (#2349)
 */
export function isTargetPage(
  /** The current or expected application page url */
  currentPageUrl: string | null | undefined,
  /** The guide's targeting page url */
  guidePageUrl: string | null | undefined
): boolean {
  try {
    /**
     * We treat HTTP and HTTPS interchangeably. Given the target URL can
     * be an arbitrary regex, we need to "simulate" both protocols when checking.
     *
     * We do this by using a two-way switch, which should cater for both cases:
     *
     * - http://domain.com -> [https://domain.com, http://domain.com]
     * - https://domain.com -> [https://domain.com, http://domain.com]
     */
    const pageUrlsToCheck = [
      currentPageUrl?.replace('http://', 'https://'),
      currentPageUrl?.replace('https://', 'http://'),
    ];

    return pageUrlsToCheck.some((pageUrl) => {
      if (
        !pageUrl ||
        pageUrl === undefined ||
        !guidePageUrl ||
        guidePageUrl === undefined
      )
        return false;

      if (pageUrl === guidePageUrl) return true;

      const regexp = `^${guidePageUrl.replace(/\/$/, '/?')}$`;
      const cleanedPageUrl = removeTrailingSlashes(
        stripQueryStringAndHashFromPath(pageUrl)
      );

      return !!pageUrl.match(regexp) || !!cleanedPageUrl.match(regexp);
    });
  } catch (error) {
    if (
      error instanceof SyntaxError &&
      error.message.includes('Invalid regular expression')
    ) {
      console.error(
        '[BENTO] Error when checking whether a guide matches the current page',
        error
      );
      return false;
    }
    // rethrow if something else
    throw error;
  }
}

export function isAbsoluteUrl(url: string) {
  return (
    typeof url === 'string' &&
    (url.indexOf('://') > 0 || url.indexOf('//') === 0)
  );
}
