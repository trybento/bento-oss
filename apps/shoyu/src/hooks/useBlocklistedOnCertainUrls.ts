import { useEffect, useState } from 'react';
import useLocation from 'bento-common/hooks/useLocation';
import { isTargetPage } from 'bento-common/utils/urls';
import { debugMessage } from 'bento-common/utils/debugging';

type UseBlocklistedOnCertainUrlsArgs = [
  /** List of blacklisted URLs (with wildcards/regex support) */
  blacklistedUrls: string[]
];

export default function useBlocklistedOnCertainUrls(
  ...args: UseBlocklistedOnCertainUrlsArgs
): boolean {
  const [blocklist] = args;
  const [hidden, setHidden] = useState<boolean>(false);
  const appLocation = useLocation();

  useEffect(() => {
    const newHidden = blocklist.some((targetUrl) =>
      isTargetPage(appLocation.href, targetUrl)
    );
    if (hidden !== newHidden) {
      setHidden(newHidden);
      debugMessage('[BENTO] Hidden on certain urls evaluated', {
        newHidden,
        blocklist,
      });
    }
  }, [appLocation.href, blocklist]);

  return hidden;
}
