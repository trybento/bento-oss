import { useState, useEffect, useCallback } from 'react';
import { isChromeExtensionInstalled } from 'bento-common/features/wysiwyg/messaging';

import { WYSIWYG_CHROME_EXTENSION_ID } from 'utils/constants';

export default function useChromeExtensionInstalled() {
  const [installed, setInstalled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(
    async (
      /** Whether to forcefully run */
      force?: boolean
    ) => {
      if (isLoading && !force) return;
      setIsLoading(true);
      const installed = await isChromeExtensionInstalled(
        WYSIWYG_CHROME_EXTENSION_ID
      );
      setInstalled(installed);
      setIsLoading(false);
    },
    [isLoading]
  );

  useEffect(() => {
    refresh(true);
  }, []);

  return {
    installed,
    isLoading,
    refresh,
  };
}
