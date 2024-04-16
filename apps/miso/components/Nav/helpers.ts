import { fetchQueryThrottled } from 'queries/fetchQuery';
import { LIBRARY_MODULES_QUERY } from 'components/Library/LibraryModules';
import { NextRouter } from 'next/router';
import { CUSTOMERS_QUERY } from 'components/Customers';

export enum NavItems {
  Customers = 'Customers',
  Guides = 'Guides',
  Library = 'Library',
  Analytics = 'Analytics',
  CommandCenter = 'CommandCenter',
  Tags = 'Tags',
  Styles = 'Styles',
  ResourceCenter = 'ResourceCenter',
  Home = 'home',
  Integrations = 'integrations',
}

/** Send a query in advance to cache the data */
export const preFetchQuery = (activeTab: NavItems, path: NavItems) => {
  if (activeTab === path) return;

  switch (path) {
    case NavItems.Library:
      fetchQueryThrottled({
        variables: {},
        query: LIBRARY_MODULES_QUERY,
      });
      break;
    case NavItems.Customers:
      fetchQueryThrottled({
        variables: {},
        query: CUSTOMERS_QUERY,
      });
      break;
    default:
  }
};

/** Search route for current tab */
export const getActiveTab = (router: NextRouter) => {
  if (
    router.pathname.includes('/accounts') ||
    router.pathname.includes('/guide-bases') ||
    router.pathname.includes('/user-guide-bases') ||
    router.pathname.includes('/customers')
  ) {
    return NavItems.Customers;
  } else if (router.pathname.includes('library')) {
    return NavItems.Library;
  } else if (router.pathname === '/analytics') {
    return NavItems.Analytics;
  } else if (router.pathname === '/tags') {
    return NavItems.Tags;
  } else if (router.pathname === '/styles') {
    return NavItems.Styles;
  } else if (router.pathname.includes('integrations')) {
    return NavItems.Integrations;
  } else if (router.pathname.includes('resource-center')) {
    return NavItems.ResourceCenter;
  } else if (router.pathname.includes('/command-center')) {
    return NavItems.CommandCenter;
  }
  return NavItems.Home;
};
