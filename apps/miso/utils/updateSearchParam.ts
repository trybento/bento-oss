import { NextRouter } from 'next/router';

export default function updateSearchParam(
  router: NextRouter,
  key: string,
  value: any
) {
  let newQuery;

  if (value === '' || value === null || value === undefined) {
    if (router.query?.[key] !== undefined) {
      delete router.query[key];
    }
    newQuery = { ...router.query };
  } else {
    newQuery = { ...router.query, [key]: value };
  }

  router.replace(
    { pathname: window.location.pathname, query: newQuery },
    undefined,
    { shallow: true }
  );
}
