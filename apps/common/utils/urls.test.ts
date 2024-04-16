import { isTargetPage } from './urls';
import { displayUrlToWildcardUrl } from './wildcardUrlHelpers';

describe('isTargetPage', () => {
  test.each([
    ['https://fqdn/path?q=foo#bar', 'https://fqdn/path'],
    ['https://fqdn/path', displayUrlToWildcardUrl('https://fqdn/*')],
    ['https://fqdn/path/foo', displayUrlToWildcardUrl('https://fqdn/path/*')],
    ['https://fqdn', 'https://fqdn'],
    ['https://fqdn', 'https://fqdn/'],
    ['https://fqdn/', 'https://fqdn'],
    ['https://fqdn/////', 'https://fqdn'],
    ['https://fqdn/?a=b', 'https://fqdn'],
    ['https://fqdn/?a=b#hash', 'https://fqdn'],
    ['https://fqdn/#hash', 'https://fqdn'],
    [
      'https://fqdn/path/foo/bar/',
      displayUrlToWildcardUrl('https://fqdn/path/*/bar'),
    ],
    [
      'https://fqdn/path/foo/bar',
      displayUrlToWildcardUrl('https://fqdn/path/*/bar'),
    ],
    [
      'https://fqdn/path?q=foo',
      displayUrlToWildcardUrl('https://fqdn/path?q=*'),
    ],
    [
      'https://fqdn/path?q=foo#hash',
      displayUrlToWildcardUrl('https://fqdn/path?q=*'),
    ],
    [
      'https://fqdn/path?q=foo#hash',
      displayUrlToWildcardUrl('https://fqdn/path'),
    ], // not strict with qs/hash since not present in the expectation
    [
      'http://localhost:3000/companies/05360bc6-ffe9-4019-8510-2b582a658684/home',
      displayUrlToWildcardUrl(
        '(http|https)://(localhost:3000|app.basis.so|app-staging.basis.so)/companies/*/home'
      ),
    ],
    [
      'http://app.basis.so/companies/05360bc6-ffe9-4019-8510-2b582a658684/home',
      displayUrlToWildcardUrl(
        '(http|https)://(localhost:3000|app.basis.so|app-staging.basis.so)/companies/*/home'
      ),
    ],
    [
      'https://app.stage.lightup.ai/#/ws/abcd/addDataSource?returnTo=dataSourceLists',
      displayUrlToWildcardUrl(
        'https://app.stage.lightup.ai/#/ws/*/addDataSource?returnTo=dataSourceLists'
      ),
    ],
    [
      'http://app-staging.basis.so/companies/05360bc6-ffe9-4019-8510-2b582a658684/home',
      displayUrlToWildcardUrl(
        '(http|https)://(localhost:3000|app.basis.so|app-staging.basis.so)/companies/*/home'
      ),
    ],

    // Ignore differences in HTTP/S
    ['https://fqdn/path', 'http://fqdn/path'],
    ['http://fqdn/path', 'https://fqdn/path'],
  ])('should match (%s, %s)', (current, target) => {
    expect(isTargetPage(current, target)).toBe(true);
  });

  test.each([
    ['https://one', 'https://two'],
    ['http://fqdn:80/path', 'http://fqdn:8080/path'],
    ['https://fqdn/path', 'https://fqdn/otherpath'],
    ['https://foo.domain/path', 'https://bar.domain/path'],
    ['https://fqdn/path', 'https://fqdn'],
    ['https://fqdn/path#hash', 'https://fqdn/path/#otherhash'],
    ['https://fqdn/path?foo=a&bar=b', 'https://fqdn/path?foo=c'],
    [
      'https://fqdn/path?foo=a&bar=b',
      displayUrlToWildcardUrl('https://fqdn/path?foo=*&bar=c'),
    ],
    ['https://fqdn/path', displayUrlToWildcardUrl('https://fqdn/path?foo=*')], // strict about qs since
    ['https://fqdn/path', displayUrlToWildcardUrl('https://fqdn/path?foo=bar')], // strict about hash tag
    ['https://fqdn/path', null],
    [null, 'https://two'],
    ['https://fqdn/path', undefined],
    [undefined, 'https://two'],
    [
      'https://app.thnks.com/#/guides?country=US',
      displayUrlToWildcardUrl(
        'https://app.thnks.com/#/send-thnks?country=US&gridType=list'
      ),
    ],
    [
      'https://app.thnks.com/#/my-thnks/',
      displayUrlToWildcardUrl('https://app.thnks.com/#/my-thnks/sent'),
    ],
    [
      'https://fqdn/path?q=foo#other',
      displayUrlToWildcardUrl('https://fqdn/path?q=*#hash'),
    ],
    [null, null],
    [undefined, undefined],
    [undefined, null],
    [null, undefined],
  ])('should NOT match (%s, %s)', (current, target) => {
    expect(isTargetPage(current, target)).toBe(false);
  });
});
