import { useCallback, useEffect } from 'react';
import env from '@beam-australia/react-env';

import useToast from 'hooks/useToast';
import { DEPLOYED_TO_PRODUCTION } from 'helpers/constants';

/**
 * Enable some console methods to facilitate testing
 */
export default function useTestingUtils(accessToken: string): void {
  const toast = useToast();

  const requestRollup = useCallback(async () => {
    const API_HOST = env('API_HOST');

    const res = await fetch(`${API_HOST}/diagnostics/rollup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      toast({
        title: 'Error requesting rollup.',
        isClosable: true,
        status: 'error',
      });

      return;
    }

    toast({
      title: 'Rollup requested. It may take a minute to run.',
      isClosable: true,
      status: 'success',
    });
  }, [accessToken, toast]);

  useEffect(() => {
    if (DEPLOYED_TO_PRODUCTION) return;

    const globalScope = window as any;

    globalScope.requestRollup = requestRollup;

    return () => {
      globalScope.requestRollup = undefined;
    };
  }, [accessToken]);
}
