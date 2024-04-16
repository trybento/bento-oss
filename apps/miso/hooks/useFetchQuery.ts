import { useCallback, useEffect, useRef, useState } from 'react';
import fetchQuery, { GraphQLArgs } from 'queries/fetchQuery';
import isEqual from 'lodash/isEqual';

/** Custom implementation of useLazyLoadQuery. */
export const useFetchQuery = <
  QueryT extends {
    variables: QueryT['variables'];
    response: QueryT['response'];
  }
>(
  args: Omit<GraphQLArgs<QueryT['variables']>, 'variables'> & {
    variables?: GraphQLArgs<QueryT['variables']>['variables'];
  }
) => {
  const argsRef = useRef<typeof args>();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<QueryT['response'] | null>(null);

  const getQueryData = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = (await fetchQuery({
        ...argsRef.current,
        variables: argsRef.current.variables || {},
      })) as QueryT['response'];

      setData(res);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isEqual(argsRef.current, args)) {
      argsRef.current = args;
      void getQueryData();
    }
  }, [args]);

  return { data, isLoading, refetch: getQueryData };
};
