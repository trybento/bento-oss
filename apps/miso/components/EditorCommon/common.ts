import { Theme } from 'bento-common/types';
import { NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { isEmptySlate } from 'bento-common/components/RichTextEditor/helpers';
import { ToastInstance } from 'hooks/useToast';
import { MODULE_ALIAS_SINGULAR } from 'bento-common/utils/naming';
import {
  CommonTargeting,
  GroupCondition,
  TargetingType,
} from 'bento-common/types/targeting';
import { TemplateValue } from 'bento-common/types/templateData';

export const defaultCommonTargeting = <T>(): CommonTargeting<T> => ({
  account: {
    grouping: GroupCondition.all,
    rules: [],
    type: TargetingType.all,
  },
  accountUser: {
    grouping: GroupCondition.all,
    rules: [],
    type: TargetingType.all,
  },
});

/* Hacky state to hide GuideSettings if its a new template, due to data deletion bug */
export const useUnsavedNewTemplateState = (
  templateData: TemplateValue,
  themeType = Theme.nested
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [unsavedNewTemplate, setIsUnsavedNewTemplate] =
    useState<boolean>(false);

  useEffect(() => {
    let firstStep;
    switch (themeType) {
      case Theme.flat:
        firstStep = templateData.modules?.[0]?.stepPrototypes?.[0];
        if (
          !templateData.name &&
          (!firstStep || isEmptySlate(firstStep.bodySlate))
        ) {
          setIsUnsavedNewTemplate(true);
        }
        break;
      default:
        if (!templateData.name && templateData.modules.length === 0) {
          setIsUnsavedNewTemplate(true);
        }
        break;
    }
  }, []);

  return [unsavedNewTemplate, setIsUnsavedNewTemplate];
};

export const getTabIndex = (tab: EditElementTabLabels, tablist: string[]) => {
  return tablist.indexOf(tab);
};

export enum EditElementTabLabels {
  content = 'Content',
  /** Previously for cyoa, possibly deprecate */
  preview = 'Preview',
  targeting = 'Targeting',
  launching = 'Launching',
  history = 'History',
  analytics = 'Analytics',
  style = 'Preview & Style',
  /** onboarding & contextual */
  checklistStyle = 'Location & Style',
}

/** Assume default tab 0 is content */
export const currentTab = (
  query: ParsedUrlQuery,
  tabList: string[]
): number => {
  if (!query || !query.tab) return 0;
  const tab = capitalizeFirstLetter(
    decodeURI(query.tab as string)
  ) as EditElementTabLabels;

  const index = getTabIndex(tab, tabList);
  if (index > -1) return index;

  return 0;
};

export const changeUrlTabQueryByIndex = (
  currentTabIndex: number,
  tabList: string[],
  router: NextRouter
) => {
  const { tab, ...rest } = router.query;
  const tabName = tabList[currentTabIndex]?.toLowerCase();
  const pathname = window.location.pathname;
  router.replace(
    {
      pathname,
      query: {
        ...rest,
        tab: tabName,
      },
    },
    `${pathname}?tab=${tabName}`,
    { shallow: true }
  );
};

export const changeUrlTabQueryByTabTitle = (
  tabTitle: EditElementTabLabels,
  router: NextRouter
) => {
  const tabName = tabTitle.toLowerCase();
  const pathname = window.location.pathname;
  router.replace(
    {
      pathname,
      query: {
        tab: tabName,
      },
    },
    `${pathname}?tab=${tabName}`,
    { shallow: true }
  );
};

export enum LibraryTabQuery {
  template = 'guides',
  stepGroup = 'modules',
  nps = 'nps',
  splitTests = 'splitTests',
  audiences = 'audiences',
}

const elementNotFound = (
  router: NextRouter,
  toast: ToastInstance,
  /** Title to be shown in the toast. */
  elementTitle: string,
  /** Query param used for redirect. */
  tabQueryParam: LibraryTabQuery
) => {
  toast({
    title: `${elementTitle} not found!`,
    isClosable: true,
    status: 'error',
  });

  router.push(`/library?tab=${tabQueryParam}`);
};

export const templateNotFound = (router: NextRouter, toast: ToastInstance) => {
  elementNotFound(router, toast, 'Template', LibraryTabQuery.template);
};

export const testNotFound = (router: NextRouter, toast: ToastInstance) => {
  elementNotFound(router, toast, 'Test', LibraryTabQuery.splitTests);
};

export const surveyNotFound = (router: NextRouter, toast: ToastInstance) => {
  elementNotFound(router, toast, 'Survey', LibraryTabQuery.nps);
};

export const moduleNotFound = (router: NextRouter, toast: ToastInstance) => {
  elementNotFound(
    router,
    toast,
    capitalizeFirstLetter(MODULE_ALIAS_SINGULAR),
    LibraryTabQuery.stepGroup
  );
};
