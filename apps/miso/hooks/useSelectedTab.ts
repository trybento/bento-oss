import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { EditorWrapperTab } from 'components/EditorCommon/types';
import {
  changeUrlTabQueryByIndex,
  currentTab,
} from 'components/EditorCommon/common';

export const useSelectedTab = <T extends string>(
  tabOptions: EditorWrapperTab<T>[]
) => {
  const router = useRouter();

  const tabOptionStrings = useMemo(
    () => tabOptions.map((o) => o.title) as string[],
    [tabOptions]
  );

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    currentTab(router.query, tabOptionStrings)
  );

  const onTabChange = useCallback(
    (index: number) => {
      changeUrlTabQueryByIndex(index, tabOptionStrings, router);
      setSelectedTabIndex(index);
    },
    [router.query]
  );

  useEffect(() => {
    const { tab } = router?.query || {};
    if (tab) {
      const routeTabIndex = tabOptionStrings.findIndex(
        (o) => o.toLocaleLowerCase() === tab
      );
      if (routeTabIndex !== -1 && routeTabIndex !== selectedTabIndex) {
        setSelectedTabIndex(routeTabIndex);
      }
    }
  }, [router?.query]);

  return { onTabChange, selectedTabIndex, tabOptionStrings };
};
