import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import useTraceUpdate from './useTraceUpdates';

type Opts = {
  /** Allows skipping querying conditionally */
  disable?: boolean;
  /** Add a behavior if the fetch fails for some reason */
  onError?: (e: Error) => void;
  /** Re-fetch when these change */
  dependencies?: any[];
};

/**
 * Prevent query spamming if dependencies change rapidly
 */
const DEBOUNCE_INTERVAL = 300;

/**
 * Automatically fetch data using a query
 */
export const useQueryAsHook = <V extends object, T>(
  mutation: (variables: V) => Promise<T>,
  variables: V,
  { dependencies = [], disable, onError }: Opts = {}
) => {
  useTraceUpdate(variables);
  const [data, setData] = useState<T>(null);
  const [loading, setLoading] = useState(true);

  const getQueryData = useCallback(
    debounce(
      async () => {
        try {
          if (!disable) {
            const res = await mutation(variables);
            setData(res);
          } else {
            setData(null);
          }
        } catch (e) {
          onError?.(e);
        } finally {
          setLoading(false);
        }
      },
      DEBOUNCE_INTERVAL,
      {
        leading: true,
        trailing: false,
      }
    ),
    [variables, disable]
  );

  useEffect(() => {
    void getQueryData();
  }, dependencies);

  return { data, refetch: getQueryData, loading };
};
